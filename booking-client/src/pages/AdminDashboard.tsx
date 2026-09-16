import React, { useEffect, useState } from 'react';
import { roomService } from '../services/roomService';
import type { Room } from '../types';

export const AdminDashboard: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState<number>(2);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // State for Custom Delete Modal Dialog
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadRooms = async () => {
    try {
      const data = await roomService.getAll();
      setRooms(data);
    } catch {
      console.error('Failed to load rooms');
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRooms();
  }, []);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      await roomService.create({ name, capacity });
      setMessage({ type: 'success', text: `✨ Suite "${name}" created and published to inventory!` });
      setName('');
      setCapacity(2);
      await loadRooms();
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setMessage({
        type: 'error',
        text: axiosError.response?.data?.message || 'Failed to create room. Admin permissions required.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Custom Confirmation Dialog Action
  const handleConfirmDelete = async () => {
    if (!roomToDelete) return;
    setDeleteLoading(true);

    try {
      await roomService.delete(roomToDelete.id);
      setRooms(rooms.filter((r) => r.id !== roomToDelete.id));
      setMessage({ type: 'success', text: `Room "${roomToDelete.name}" deleted successfully.` });
      setRoomToDelete(null);
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete room.' });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-white">
      {/* Header */}
      <div className="mb-8 sm:mb-10 text-center sm:text-left">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
          <span>⚡ Admin Console</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Hotel Inventory <span className="text-gradient-amber">Management</span>
        </h1>
        <p className="text-slate-400 text-sm mt-2 max-w-xl">
          Create, configure, and monitor live suites in your SQL Server database.
        </p>
      </div>

      {/* Alert Banner */}
      {message && (
        <div
          className={`mb-6 sm:mb-8 p-4 rounded-2xl text-sm font-semibold flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-lg ${
            message.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-200'
              : 'bg-red-950/80 border border-red-500/50 text-red-200'
          }`}
        >
          <span>{message.text}</span>
          <button
            onClick={() => setMessage(null)}
            className="text-xs uppercase opacity-75 hover:opacity-100 cursor-pointer self-end sm:self-auto"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Add New Room Card */}
      <div className="glass-card p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-700/80 shadow-xl mb-8 sm:mb-10">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-5 flex items-center space-x-2">
          <span>➕</span>
          <span>Add New Suite</span>
        </h2>
        <form onSubmit={handleCreateRoom} className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Suite Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full input-modern rounded-xl px-4 py-2.5 sm:py-3 text-sm placeholder-slate-500"
              placeholder="e.g. Royal Presidential Suite"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Guest Capacity
            </label>
            <input
              type="number"
              min={1}
              max={10}
              required
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-full input-modern rounded-xl px-4 py-2.5 sm:py-3 text-sm"
            />
          </div>

          <div className="md:col-span-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-2.5 sm:py-3 px-8 rounded-xl transition duration-200 disabled:opacity-50 cursor-pointer shadow-lg shadow-amber-500/20 text-sm"
            >
              {loading ? 'Publishing...' : '+ Publish Suite'}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Rooms Inventory Table */}
      <div className="glass-card p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-700/80 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
            <span>🏨</span>
            <span>Live Database Inventory</span>
          </h2>
          <span className="text-xs font-medium text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/60 w-fit">
            {rooms.length} Suites Registered
          </span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 hover:bg-slate-800/30 px-3 rounded-xl transition"
            >
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-lg shrink-0">
                  🛏️
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white">{room.name}</h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span>ID: #{room.id}</span>
                    <span>•</span>
                    <span className="text-sky-400 font-medium">👥 Max {room.capacity} Guests</span>
                    <span>•</span>
                    <span className="text-slate-300 font-semibold">$100/night</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setRoomToDelete(room)}
                className="w-full sm:w-auto text-xs bg-red-950/40 hover:bg-red-900/80 text-red-300 hover:text-red-100 border border-red-800/40 px-3.5 py-2 rounded-xl transition duration-150 cursor-pointer font-medium text-center"
              >
                Delete Suite
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* CUSTOM LUXURY DELETE CONFIRMATION MODAL DIALOG */}
      {/* ============================================================ */}
      {roomToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 border border-red-500/40 p-6 sm:p-8 rounded-2xl sm:rounded-3xl max-w-md w-full text-white shadow-2xl shadow-red-950/50">
            {/* Warning Icon Badge */}
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-2xl text-red-400 mx-auto mb-5 shadow-inner">
              ⚠️
            </div>

            {/* Content */}
            <div className="text-center mb-6">
              <h3 className="text-xl sm:text-2xl font-black text-white">Delete Suite?</h3>
              <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                Are you sure you want to delete{' '}
                <strong className="text-white font-bold">"{roomToDelete.name}"</strong>?
              </p>
              <div className="mt-3 p-3 rounded-xl bg-red-950/40 border border-red-900/50 text-xs text-red-300">
                🚨 This will permanently remove the room from the database and cancel any linked bookings.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => setRoomToDelete(null)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleteLoading}
                onClick={handleConfirmDelete}
                className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white py-2.5 rounded-xl text-sm font-bold transition cursor-pointer shadow-lg shadow-red-600/30 disabled:opacity-50"
              >
                {deleteLoading ? 'Deleting...' : 'Yes, Delete Room'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};