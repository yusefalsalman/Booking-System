import React, { useEffect, useState } from 'react';
import { roomService } from '../services/roomService';
import { bookingService } from '../services/bookingService';
import type { Room } from '../types';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

// Curated luxury hotel photos for visual flair
const ROOM_IMAGES = [
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80',
];

export const HomePage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [bookingMessage, setBookingMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { isAuthenticated, user } = useAuth();

  const fetchRooms = async () => {
    try {
      const data = await roomService.getAll();
      setRooms(data);
    } catch {
      console.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRooms();
  }, []);

  const calculateTotal = () => {
    if (!checkInDate || !checkOutDate) return null;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays * 100 : null;
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom || !user) return;

    setBookingMessage(null);

    try {
      const result = await bookingService.create({
        customerName: user.fullName,
        roomId: selectedRoom.id,
        checkInDate,
        checkOutDate,
      });

      setBookingMessage({
        type: 'success',
        text: `🎉 Room reserved successfully! Total price: $${result.totalPrice}`,
      });
      setSelectedRoom(null);
      setCheckInDate('');
      setCheckOutDate('');
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setBookingMessage({
        type: 'error',
        text: axiosError.response?.data?.message || 'Failed to book room.',
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-4">
          <span>✨</span>
          <span>Boutique Suites & Exceptional Stays</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Find Your Next <span className="text-gradient">Luxury Escape</span>
        </h1>
        <p className="mt-4 text-slate-400 text-base sm:text-lg">
          Explore curated rooms designed for comfort, luxury, and seamless reservations.
        </p>
      </div>

      {/* Notifications */}
      {bookingMessage && (
        <div
          className={`mb-8 p-4 rounded-xl text-sm font-semibold flex items-center justify-between shadow-lg ${
            bookingMessage.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-200'
              : 'bg-red-950/80 border border-red-500/50 text-red-200'
          }`}
        >
          <span>{bookingMessage.text}</span>
          <button
            onClick={() => setBookingMessage(null)}
            className="text-xs uppercase opacity-75 hover:opacity-100 ml-4 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Rooms Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="w-10 h-10 border-4 border-sky-500/30 border-t-sky-400 rounded-full animate-spin mb-4" />
          <p className="text-sm">Fetching available suites...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room, index) => {
            const photoUrl = ROOM_IMAGES[index % ROOM_IMAGES.length];
            return (
              <div
                key={room.id}
                className="glass-card rounded-2xl overflow-hidden flex flex-col group"
              >
                {/* Photo Preview */}
                <div className="h-52 w-full relative overflow-hidden bg-slate-800">
                  <img
                    src={photoUrl}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-slate-700/50 shadow-md">
                    $100 <span className="text-slate-400 font-normal">/ night</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-amber-400 text-xs font-semibold tracking-wider">
                        ★★★★★ 5.0
                      </span>
                      <span className="badge-capacity text-xs font-medium px-2.5 py-0.5 rounded-full">
                        👥 Up to {room.capacity} Guests
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-sky-400 transition">
                      {room.name}
                    </h3>
                    <p className="text-slate-400 text-xs mb-4">
                      Complimentary high-speed Wi-Fi, air conditioning, daily room service, and private ensuite bath.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80">
                    {isAuthenticated ? (
                      <button
                        onClick={() => {
                          setSelectedRoom(room);
                          setBookingMessage(null);
                        }}
                        className="w-full btn-gradient py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
                      >
                        Reserve Suite
                      </button>
                    ) : (
                      <Link
                        to="/login"
                        className="w-full block text-center bg-slate-800 hover:bg-slate-700/90 text-slate-200 text-sm font-semibold py-2.5 rounded-xl border border-slate-700/60 transition"
                      >
                        Sign in to Book
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Booking Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 border border-slate-700/80 p-8 rounded-2xl max-w-md w-full text-white shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">
                  Reservation
                </span>
                <h3 className="text-2xl font-black text-white">{selectedRoom.name}</h3>
              </div>
              <button
                onClick={() => setSelectedRoom(null)}
                className="text-slate-400 hover:text-white text-xl leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Check-In Date
                </label>
                <input
                  type="date"
                  required
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full input-modern rounded-xl px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Check-Out Date
                </label>
                <input
                  type="date"
                  required
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="w-full input-modern rounded-xl px-4 py-2.5 text-sm"
                />
              </div>

              {calculateTotal() !== null && (
                <div className="p-3 bg-sky-950/40 border border-sky-800/40 rounded-xl flex justify-between items-center text-sm">
                  <span className="text-slate-300">Estimated Total:</span>
                  <strong className="text-sky-400 text-base">${calculateTotal()}</strong>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedRoom(null)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-gradient py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
                >
                  Confirm Stay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};