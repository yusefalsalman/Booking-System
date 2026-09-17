import React, { useEffect, useState } from 'react';
import { bookingService } from '../services/bookingService';
import type { Booking } from '../types';
import { Link } from 'react-router-dom';

export const MyBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelMessage, setCancelMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Custom Modal Dialog state
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const loadBookings = async () => {
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch {
      console.error('Failed to load reservations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadBookings();
  }, []);

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;
    setCancelLoading(true);
    setCancelMessage(null);

    try {
      await bookingService.cancel(bookingToCancel.id);
      setBookings(bookings.filter((b) => b.id !== bookingToCancel.id));
      setCancelMessage({
        type: 'success',
        text: `Your reservation for "${bookingToCancel.roomName}" was successfully cancelled.`,
      });
      setBookingToCancel(null);
    } catch {
      setCancelMessage({
        type: 'error',
        text: 'Failed to cancel reservation. Please try again or contact support.',
      });
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-xs font-semibold mb-3">
          <span>📅 Guest Portal</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">My Reservations</h1>
        <p className="text-stone-500 text-sm mt-1.5">View, review, and manage your upcoming boutique stays.</p>
      </div>

      {cancelMessage && (
        <div
          className={`mb-6 p-4 rounded-2xl text-sm font-semibold flex items-center justify-between shadow-xs ${
            cancelMessage.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border border-rose-200 text-rose-900'
          }`}
        >
          <span>{cancelMessage.text}</span>
          <button
            onClick={() => setCancelMessage(null)}
            className="text-xs uppercase opacity-75 hover:opacity-100 font-bold ml-4 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-stone-500">
          <div className="w-8 h-8 border-2 border-stone-200 border-t-stone-800 rounded-full animate-spin mb-4" />
          <p className="text-sm font-medium">Loading your reservations...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 hotel-card rounded-3xl p-8 border border-stone-200">
          <div className="w-14 h-14 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-2xl mx-auto mb-4">
            🏨
          </div>
          <h3 className="text-lg font-bold text-stone-900 mb-1">No Active Reservations</h3>
          <p className="text-stone-500 text-sm max-w-sm mx-auto mb-6">
            You haven't reserved any suites yet. Discover our curated rooms and plan your next escape.
          </p>
          <Link to="/" className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold inline-block">
            Explore Suites
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="hotel-card p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-2xl shrink-0 mt-0.5">
                  🛏️
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-stone-900">{booking.roomName}</h3>
                    <span className="text-[11px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200">
                      #{booking.id}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1 flex items-center gap-1.5">
                    <span>📅</span>
                    <span>
                      {new Date(booking.checkInDate).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}{' '}
                      —{' '}
                      {new Date(booking.checkOutDate).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </p>
                  <p className="text-sm font-semibold text-stone-800 mt-2">
                    Total Paid:{' '}
                    <span className="text-orange-700 font-bold">${booking.totalPrice}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setBookingToCancel(booking)}
                className="w-full sm:w-auto text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 border border-rose-200 px-4 py-2.5 rounded-xl font-semibold transition cursor-pointer text-center"
              >
                Cancel Stay
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ============================================================ */}
      {/* CUSTOM LUXURY CANCEL CONFIRMATION MODAL DIALOG */}
      {/* ============================================================ */}
      {bookingToCancel && (
        <div className="fixed inset-0 bg-stone-950/45 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-stone-200 p-6 sm:p-8 rounded-2xl sm:rounded-3xl max-w-md w-full text-stone-900 shadow-2xl">
            {/* Warning Badge */}
            <div className="w-13 h-13 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-2xl text-rose-600 mx-auto mb-4">
              ⚠️
            </div>

            {/* Content */}
            <div className="text-center mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-stone-900">Cancel Reservation?</h3>
              <p className="text-stone-600 text-sm mt-2 leading-relaxed">
                Are you sure you want to cancel your stay in{' '}
                <strong className="text-stone-900 font-bold">"{bookingToCancel.roomName}"</strong>?
              </p>

              <div className="mt-4 p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 text-left space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-500">Dates:</span>
                  <span className="font-semibold text-stone-800">
                    {new Date(bookingToCancel.checkInDate).toLocaleDateString()} —{' '}
                    {new Date(bookingToCancel.checkOutDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Refund Amount:</span>
                  <span className="font-bold text-emerald-700">${bookingToCancel.totalPrice}</span>
                </div>
              </div>

              <p className="text-[11px] text-stone-400 mt-2">
                This room will be immediately released back into the available inventory.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                type="button"
                disabled={cancelLoading}
                onClick={() => setBookingToCancel(null)}
                className="flex-1 btn-secondary py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer disabled:opacity-50"
              >
                Keep Reservation
              </button>

              <button
                type="button"
                disabled={cancelLoading}
                onClick={handleConfirmCancel}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl text-sm font-bold transition cursor-pointer shadow-xs disabled:opacity-50"
              >
                {cancelLoading ? 'Cancelling...' : 'Yes, Cancel Stay'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};