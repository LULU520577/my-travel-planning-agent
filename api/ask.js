import { GoogleGenAI, mcpToTool } from "@google/genai";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 3) Before anything else: if process.env.GEMINI_API_KEY is missing or empty, return 503 with {"error":"GEMINI_API_KEY is not set. Add it in Vercel and redeploy."}. If the question is missing or longer than 500 characters, return 400.
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    return res.status(503).json({ error: "GEMINI_API_KEY is not set. Add it in Vercel and redeploy." });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const question = body.question ?? body.prompt;

  if (!question || typeof question !== 'string' || !question.trim() || question.trim().length > 500) {
    return res.status(400).json({ error: "Question is required and must not exceed 500 characters." });
  }

  const trimmedQuestion = question.trim();

  // 4) Split process.env.MCP_SERVERS on commas and trim each address.
  const defaultMcpServers = "https://my-travel-planning-agent.vercel.app/api/mcp,https://flights.flightpowers.com/mcp,https://api.moodtrip.ai/api/mcp-http,https://geo.thinair.co/mcp";
  const rawMcpServers = process.env.MCP_SERVERS || defaultMcpServers;
  const addresses = rawMcpServers
    .split(',')
    .map((addr) => addr.trim())
    .filter(Boolean);

  const connectedClients = [];
  const unavailable = [];

  // For each one, create new Client({ name: "travel-planner-agent", version: "1.0.0" })
  // and connect it with new StreamableHTTPClientTransport(new URL(address)), giving up after 8 seconds.
  // A server that fails goes into an "unavailable" list with its address and the reason, and the request carries on without it.
  await Promise.all(
    addresses.map(async (address) => {
      try {
        const client = new Client(
          { name: "travel-planner-agent", version: "1.0.0" },
          { capabilities: {} }
        );
        const transport = new StreamableHTTPClientTransport(new URL(address));

        let timeoutId;
        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error("Connection timed out after 8 seconds")), 8000);
        });

        await Promise.race([
          client.connect(transport),
          timeoutPromise
        ]).finally(() => {
          if (timeoutId) clearTimeout(timeoutId);
        });

        connectedClients.push(client);
      } catch (err) {
        unavailable.push({
          address,
          reason: err?.message || String(err)
        });
      }
    })
  );

  try {
    // 5) Call ai.models.generateContent with model "gemini-3.8-flash", the question as contents, and config:
    // { systemInstruction, tools: [mcpToTool(...connectedClients)], automaticFunctionCalling: { maximumRemoteCalls: 6 } }.
    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = "answer only from tool results; give the source and the fetched_at time for every figure; if a tool returns an error or nothing, say so in one sentence and do not guess; at most 120 words.";

    const tools = connectedClients.length > 0 ? [mcpToTool(...connectedClients)] : [];

    let response;
    let lastErr;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: trimmedQuestion,
          config: {
            systemInstruction,
            ...(tools.length > 0 ? { tools } : {}),
            automaticFunctionCalling: {
              maximumRemoteCalls: 6
            }
          }
        });
        break;
      } catch (e) {
        lastErr = e;
        if (attempt === 0) {
          await new Promise((r) => setTimeout(r, 1200));
        }
      }
    }

    if (!response && lastErr) {
      throw lastErr;
    }

    // 6) Build tool_calls from response.automaticFunctionCallingHistory:
    // one entry per functionCall part, with its name and args, marked failed when the matching functionResponse contains an error.
    const tool_calls = [];
    const history = response.automaticFunctionCallingHistory || [];

    const responsesByName = new Map();
    const responsesById = new Map();

    for (const turn of history) {
      if (Array.isArray(turn.parts)) {
        for (const part of turn.parts) {
          if (part.functionResponse) {
            const resp = part.functionResponse;
            if (resp.id) responsesById.set(resp.id, resp.response);
            if (resp.name) responsesByName.set(resp.name, resp.response);
          }
        }
      }
    }

    for (const turn of history) {
      if (Array.isArray(turn.parts)) {
        for (const part of turn.parts) {
          if (part.functionCall) {
            const call = part.functionCall;
            const resp = (call.id && responsesById.get(call.id)) ?? responsesByName.get(call.name);

            let failed = false;
            if (resp) {
              if (typeof resp === 'object' && resp !== null) {
                if (resp.error || resp.isError || (resp.status && resp.status >= 400)) {
                  failed = true;
                }
              } else if (typeof resp === 'string' && (resp.toLowerCase().startsWith('error') || resp.includes('"error":'))) {
                failed = true;
              }
            }

            tool_calls.push({
              name: call.name,
              args: call.args || {},
              failed
            });
          }
        }
      }
    }

    // 7) Return 200 with { answer: response.text, tool_calls, unavailable, model: "gemini-3.8-flash", answered_at }
    return res.status(200).json({
      answer: response.text || "",
      tool_calls,
      unavailable,
      model: "gemini-3.8-flash",
      answered_at: new Date().toISOString()
    });
  } catch (err) {
    // If Gemini itself fails, return 502 with its status and a one-line reason.
    let status = 502;
    if (err?.status && typeof err.status === 'number') status = err.status;
    else if (err?.statusCode && typeof err.statusCode === 'number') status = err.statusCode;

    let reason = "Gemini generation failed";
    if (err?.message) {
      try {
        const parsed = JSON.parse(err.message);
        if (parsed?.error?.message) {
          reason = parsed.error.message;
          if (parsed.error.code) status = parsed.error.code;
        } else {
          reason = err.message.split('\n')[0];
        }
      } catch {
        reason = err.message.split('\n')[0];
      }
    }

    return res.status(502).json({
      error: reason,
      status
    });
  } finally {
    // Close every client in a finally block.
    await Promise.allSettled(connectedClients.map((client) => client.close()));
  }
}
