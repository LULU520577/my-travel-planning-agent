import { handleMcpGet, handleMcpPost } from '../src/server/mcpEndpoint.ts';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return handleMcpGet(req, res);
  }
  if (req.method === 'POST') {
    return handleMcpPost(req, res);
  }
  return res.status(405).json({ error: 'Method Not Allowed' });
}
