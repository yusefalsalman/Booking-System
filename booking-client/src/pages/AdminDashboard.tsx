import React, { useEffect, useState } from 'react';
import { roomService } from '../services/roomService';
import { bookingService } from '../services/bookingService';
import type { Room, Booking } from '../types';

export const AdminDashboard: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState<number>(2);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // State for Custom Delete Modal Dialog
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // State for Room Bookings Modal Dialog
  const [selectedRoomForBookings, setSelectedRoomForBookings] = useState<Room | null>(null);
  const [roomBookings, setRoomBookings] = useState<Booking[]>([]);
  const [loadingRoomBookings, setLoadingRoomBookings] = useState(false);
  const [bookingActionMessage, setBookingActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
      setMessage({ type: 'success', text: `Suite "${name}" added to live inventory!` });
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

  // Open Room Bookings Modal
  const handleViewRoomBookings = async (room: Room) => {
    setSelectedRoomForBookings(room);
    setLoadingRoomBookings(true);
    setBookingActionMessage(null);

    try {
      const data = await bookingService.getByRoomId(room.id);
      setRoomBookings(data);
    } catch {
      console.error('Failed to load bookings for room', room.id);
      setRoomBookings([]);
      setBookingActionMessage({
        type: 'error',
        text: 'Failed to load bookings for this room.',
      });
    } finally {
      setLoadingRoomBookings(false);
    }
  };

  // Cancel an individual booking from within the Room Bookings modal
  const handleCancelBooking = async (bookingId: number) => {
    try {
      await bookingService.cancel(bookingId);
      setRoomBookings((prev) => prev.filter((b) => b.id !== bookingId));
      setBookingActionMessage({
        type: 'success',
        text: `Booking #${bookingId} has been successfully cancelled.`,
      });
    } catch {
      setBookingActionMessage({
        type: 'error',
        text: `Failed to cancel booking #${bookingId}.`,
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-stone-900">
      {/* Header */}
      <div className="mb-8 sm:mb-10 text-center sm:text-left">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
          <span>Hotel Operations</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
          Suite Inventory & Management
        </h1>
        <p className="text-stone-600 text-sm mt-2 max-w-xl leading-relaxed">
          Configure guest capacity, publish new hotel rooms, and manage active accommodations.
        </p>
      </div>

      {/* Alert Banner */}
      {message && (
        <div
          className={`mb-6 sm:mb-8 p-4 rounded-2xl text-sm font-semibold flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-xs ${
            message.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border border-rose-200 text-rose-900'
          }`}
        >
          <span>{message.text}</span>
          <button
            onClick={() => setMessage(null)}
            className="text-xs uppercase opacity-75 hover:opacity-100 cursor-pointer self-end sm:self-auto font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Add New Room Card */}
      <div className="hotel-card p-6 sm:p-8 rounded-2xl sm:rounded-3xl mb-8 sm:mb-10">
        <h2 className="text-lg sm:text-xl font-bold text-stone-900 mb-5 flex items-center space-x-2">
          <span>➕</span>
          <span>Create New Suite</span>
        </h2>
        <form onSubmit={handleCreateRoom} className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              Suite Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full input-clean rounded-xl px-4 py-2.5 sm:py-3 text-sm placeholder-stone-400"
              placeholder="e.g. Garden Pavilion Suite"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              Guest Capacity
            </label>
            <input
              type="number"
              min={1}
              max={10}
              required
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-full input-clean rounded-xl px-4 py-2.5 sm:py-3 text-sm"
            />
          </div>

          <div className="md:col-span-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto btn-primary py-2.5 sm:py-3 px-8 rounded-xl transition duration-200 disabled:opacity-50 cursor-pointer text-sm font-semibold"
            >
              {loading ? 'Publishing...' : '+ Publish Suite'}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Rooms Inventory Table */}
      <div className="hotel-card p-6 sm:p-8 rounded-2xl sm:rounded-3xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 flex items-center space-x-2">
            <span>🏨</span>
            <span>Live Database Inventory</span>
          </h2>
          <span className="text-xs font-medium text-stone-600 bg-stone-100 px-3 py-1 rounded-full border border-stone-200 w-fit">
            {rooms.length} Suites Registered
          </span>
        </div>

        <div className="divide-y divide-stone-100">
          {rooms.map((room) => (
            <div
              key={room.id}
              onClick={() => handleViewRoomBookings(room)}
              className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 hover:bg-stone-50/90 p-3 rounded-2xl transition cursor-pointer group"
            >
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform">
                  🛏️
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm sm:text-base font-bold text-stone-900 group-hover:text-orange-950 transition">
                      {room.name}
                    </h4>
                    <span className="text-[10px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                      View Bookings
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mt-0.5">
                    <span>ID: #{room.id}</span>
                    <span>•</span>
                    <span className="text-stone-700 font-medium">👥 Max {room.capacity} Guests</span>
                    <span>•</span>
                    <span className="text-stone-700 font-semibold">$100/night</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => handleViewRoomBookings(room)}
                  className="flex-1 sm:flex-initial text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 px-3.5 py-2 rounded-xl transition font-medium cursor-pointer"
                >
                  📋 Bookings
                </button>
                <button
                  onClick={() => setRoomToDelete(room)}
                  className="flex-1 sm:flex-initial text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 border border-rose-200 px-3.5 py-2 rounded-xl transition duration-150 cursor-pointer font-semibold text-center"
                >
                  Delete Suite
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* ROOM BOOKINGS MODAL DIALOG */}
      {/* ============================================================ */}
      {selectedRoomForBookings && (
        <div className="fixed inset-0 bg-stone-950/45 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-stone-200 p-6 sm:p-8 rounded-2xl sm:rounded-3xl max-w-2xl w-full text-stone-900 shadow-2xl max-h-[85vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-xl shrink-0">
                  🏨
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-bold text-stone-900">{selectedRoomForBookings.name}</h3>
                    <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded border border-stone-200">
                      ID: #{selectedRoomForBookings.id}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Live Bookings • Max {selectedRoomForBookings.capacity} Guests • $100/night
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRoomForBookings(null)}
                className="text-stone-400 hover:text-stone-700 text-2xl leading-none p-1 cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Action Feedback Notification */}
            {bookingActionMessage && (
              <div
                className={`mt-4 p-3 rounded-xl text-xs font-semibold flex items-center justify-between ${
                  bookingActionMessage.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border border-rose-200 text-rose-900'
                }`}
              >
                <span>{bookingActionMessage.text}</span>
                <button
                  onClick={() => setBookingActionMessage(null)}
                  className="uppercase opacity-75 hover:opacity-100 font-bold ml-2 cursor-pointer text-[10px]"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Bookings List */}
            <div className="overflow-y-auto flex-1 my-4 pr-1 space-y-3">
              {loadingRoomBookings ? (
                <div className="py-14 flex flex-col items-center justify-center text-stone-500">
                  <div className="w-7 h-7 border-2 border-stone-200 border-t-stone-800 rounded-full animate-spin mb-3" />
                  <p className="text-xs font-medium">Fetching reservations for this suite...</p>
                </div>
              ) : roomBookings.length === 0 ? (
                <div className="py-12 text-center bg-stone-50 rounded-2xl border border-stone-100 p-6">
                  <div className="text-3xl mb-2">📅</div>
                  <h4 className="text-sm font-bold text-stone-800">No Active Reservations</h4>
                  <p className="text-xs text-stone-500 mt-1">
                    There are currently no confirmed bookings for this suite.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs text-stone-500 px-1 font-medium">
                    <span>{roomBookings.length} Active {roomBookings.length === 1 ? 'Stay' : 'Stays'}</span>
                    <span>Total Revenue: ${roomBookings.reduce((sum, b) => sum + b.totalPrice, 0)}</span>
                  </div>

                  {roomBookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-4 rounded-xl border border-stone-200 bg-white hover:border-stone-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-stone-900">Booking #{b.id}</span>
                          <span className="text-[10px] font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                            Customer ID: #{b.customerId}
                          </span>
                        </div>
                        <div className="text-xs text-stone-600 mt-1 flex items-center gap-1.5">
                          <span>📅</span>
                          <span>
                            {new Date(b.checkInDate).toLocaleDateString()} — {new Date(b.checkOutDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-orange-700 mt-1">
                          Total: ${b.totalPrice}
                        </div>
                      </div>

                      <button
                        onClick={() => handleCancelBooking(b.id)}
                        className="self-start sm:self-auto text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-lg transition font-medium cursor-pointer"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-stone-100 flex justify-end">
              <button
                onClick={() => setSelectedRoomForBookings(null)}
                className="btn-secondary px-5 py-2 rounded-xl text-sm font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* CUSTOM LUXURY DELETE CONFIRMATION MODAL DIALOG */}
      {/* ============================================================ */}
      {roomToDelete && (
        <div className="fixed inset-0 bg-stone-950/45 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-stone-200 p-6 sm:p-8 rounded-2xl sm:rounded-3xl max-w-md w-full text-stone-900 shadow-2xl">
            {/* Warning Icon Badge */}
            <div className="w-13 h-13 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-2xl text-rose-600 mx-auto mb-4">
              ⚠️
            </div>

            {/* Content */}
            <div className="text-center mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-stone-900">Delete Suite?</h3>
              <p className="text-stone-600 text-sm mt-2 leading-relaxed">
                Are you sure you want to delete{' '}
                <strong className="text-stone-900 font-bold">"{roomToDelete.name}"</strong>?
              </p>
              <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200/80 text-xs text-rose-800 font-medium">
                This will permanently remove the room from the database and cancel any linked bookings.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => setRoomToDelete(null)}
                className="flex-1 btn-secondary py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleteLoading}
                onClick={handleConfirmDelete}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl text-sm font-bold transition cursor-pointer shadow-xs disabled:opacity-50"
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