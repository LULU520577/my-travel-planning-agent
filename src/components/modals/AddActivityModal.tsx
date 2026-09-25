import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { ActivityItem } from '../../types/travel';
import { X, Plus, Clock, MapPin, DollarSign, Umbrella, Tag } from 'lucide-react';

interface AddActivityModalProps {
  dayIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export const AddActivityModal: React.FC<AddActivityModalProps> = ({ dayIndex, isOpen, onClose }) => {
  const { addActivity, preferences } = useTrip();

  const [title, setTitle] = useState('');
  const [timeSlot, setTimeSlot] = useState('02:00 PM - 04:00 PM');
  const [location, setLocation] = useState('');
  const [duration, setDuration] = useState('2 hrs');
  const [cost, setCost] = useState('20');
  const [category, setCategory] = useState<ActivityItem['category']>('sightseeing');
  const [isIndoor, setIsIndoor] = useState(false);
  const [isAnchorEvent, setIsAnchorEvent] = useState(false);
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addActivity(dayIndex, {
      title: title.trim(),
      timeSlot,
      location: location.trim() || 'Central District',
      duration,
      cost: parseFloat(cost) || 0,
      category,
      isIndoor,
      isAnchorEvent,
      description: description.trim() || 'User custom planned activity'
    });

    // Reset and close
    setTitle('');
    setLocation('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-sm text-white font-display">Add Custom Activity (Day {dayIndex + 1})</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-medium block mb-1">Activity Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Traditional Pottery Workshop, Jazz Club Tasting"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-medium block mb-1">Time Slot</label>
              <input
                type="text"
                placeholder="10:00 AM - 12:30 PM"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-slate-300 font-medium block mb-1">Duration</label>
              <input
                type="text"
                placeholder="2 hrs"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-medium block mb-1">Estimated Cost ({preferences.currency})</label>
              <input
                type="number"
                min="0"
                step="5"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-slate-300 font-medium block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="culture">Culture</option>
                <option value="food">Gastronomy / Food</option>
                <option value="nature">Nature / Outdoors</option>
                <option value="sightseeing">Sightseeing</option>
                <option value="workshop">Artisan Workshop</option>
                <option value="entertainment">Entertainment</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-medium block mb-1">Location / Venue</label>
            <input
              type="text"
              placeholder="e.g. Old Town Center, Historic District"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-medium block mb-1">Notes / Description</label>
            <textarea
              rows={2}
              placeholder="Brief notes, reservation reference, or meeting instructions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-white focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={isIndoor}
                onChange={(e) => setIsIndoor(e.target.checked)}
                className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
              />
              <span>Indoor Venue (Rain-Proof)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={isAnchorEvent}
                onChange={(e) => setIsAnchorEvent(e.target.checked)}
                className="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-0"
              />
              <span>Lock as Anchor Event</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
            >
              Add to Timeline
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
