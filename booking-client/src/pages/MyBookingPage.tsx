import React, { useEffect, useState } from 'react';
import { bookingService } from '../services/bookingService';
import type { Booking } from '../types';
import { Link } from 'react-router-dom';

export const MyBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelMessage, setCancelMessage] = useState<string | null>(null);

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

  const handleCancel = async (id: number) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    try {
      await bookingService.cancel(id);
      setBookings(bookings.filter((b) => b.id !== id));
      setCancelMessage('Reservation cancelled successfully.');
    } catch {
      alert('Failed to cancel reservation.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-extrabold text-stone-900 mb-2">My Reservations</h1>
      <p className="text-stone-500 text-sm mb-8">View and manage your upcoming hotel stays.</p>

      {cancelMessage && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-sm font-medium">
          {cancelMessage}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-stone-500">Loading reservations...</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 hotel-card rounded-2xl p-8">
          <p className="text-stone-600 mb-4">You have no active reservations.</p>
          <Link to="/" className="btn-primary px-5 py-2.5 rounded-xl text-sm inline-block">
            Explore Suites
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="hotel-card p-6 rounded-2xl flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-stone-900">{booking.roomName}</h3>
                <p className="text-xs text-stone-500 mt-1">
                  📅 {new Date(booking.checkInDate).toLocaleDateString()} — {new Date(booking.checkOutDate).toLocaleDateString()}
                </p>
                <p className="text-sm font-semibold text-stone-800 mt-2">
                  Total: <span className="text-orange-700">${booking.totalPrice}</span>
                </p>
              </div>
              <button
                onClick={() => handleCancel(booking.id)}
                className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-4 py-2 rounded-xl font-medium cursor-pointer"
              >
                Cancel Stay
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};