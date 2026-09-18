import React, { useEffect, useState } from 'react';
import { roomService } from '../services/roomService';
import { bookingService } from '../services/bookingService';
import type { Room } from '../types';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

// Curated high-aesthetic architecture & interior photos
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
    if (!checkInDate || !checkOutDate || !selectedRoom) return null;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const rate = selectedRoom.pricePerNight ?? selectedRoom.pricePerNight ?? 100;
    return diffDays > 0 ? diffDays * rate : null;
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom || !user) return;

    setBookingMessage(null);

    try {
      const result = await bookingService.create({
        roomId: selectedRoom.id,
        checkInDate,
        checkOutDate,
      });

      setBookingMessage({
        type: 'success',
        text: `Suite reserved successfully! Total price: $${result.totalPrice}`,
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      {/* Editorial Hero Section */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-stone-100 border border-stone-200/80 text-stone-700 text-xs font-semibold tracking-wide mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>
          <span>Boutique Suites & Curated Stays</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
          Spaces designed for rest, comfort & connection.
        </h1>
        <p className="mt-4 text-stone-600 text-base sm:text-lg leading-relaxed">
          Discover handpicked accommodations tailored for timeless comfort, seamless service, and peaceful getaways.
        </p>
      </div>

      {/* Notifications */}
      {bookingMessage && (
        <div
          className={`mb-8 p-4 rounded-xl text-sm font-semibold flex items-center justify-between shadow-xs ${
            bookingMessage.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border border-rose-200 text-rose-900'
          }`}
        >
          <span>{bookingMessage.text}</span>
          <button
            onClick={() => setBookingMessage(null)}
            className="text-xs uppercase opacity-75 hover:opacity-100 ml-4 cursor-pointer font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Rooms Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-stone-500">
          <div className="w-8 h-8 border-2 border-stone-200 border-t-stone-800 rounded-full animate-spin mb-4" />
          <p className="text-sm font-medium">Loading available suites...</p>
        </div>
      ) : (
        <div id="available-rooms" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {rooms.map((room, index) => {
            const photoUrl = ROOM_IMAGES[index % ROOM_IMAGES.length];
            return (
              <div
                key={room.id}
                className="hotel-card rounded-2xl overflow-hidden flex flex-col group"
              >
                {/* Photo Preview */}
                <div className="h-56 w-full relative overflow-hidden bg-stone-100">
                  <img
                    src={photoUrl}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-stone-900 border border-stone-200 shadow-xs">
                    ${room.pricePerNight || 100} <span className="text-stone-500 font-normal">/ night</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-amber-600 text-xs font-bold tracking-wider flex items-center gap-1">
                        <span>★</span> 5.0 Rating
                      </span>
                      <span className="badge-neutral text-xs font-medium px-2.5 py-0.5 rounded-full">
                        👥 Up to {room.capacity} Guests
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-stone-900 mb-2 group-hover:text-orange-950 transition">
                      {room.name}
                    </h3>
                    <p className="text-stone-500 text-xs leading-relaxed mb-4">
                      Complimentary high-speed Wi-Fi, organic breakfast bar, air conditioning, and a private ensuite bath.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-100">
                    {isAuthenticated ? (
                      <button
                        onClick={() => {
                          setSelectedRoom(room);
                          setBookingMessage(null);
                        }}
                        className="w-full btn-primary py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
                      >
                        Reserve Suite
                      </button>
                    ) : (
                      <Link
                        to="/login"
                        className="w-full block text-center bg-stone-100 hover:bg-stone-200 text-stone-800 text-sm font-semibold py-2.5 rounded-xl border border-stone-200 transition"
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
        <div className="fixed inset-0 bg-stone-950/45 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-stone-200 p-7 sm:p-8 rounded-2xl max-w-md w-full text-stone-900 shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-stone-100">
              <div>
                <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">
                  Reserve Accommodation • ${selectedRoom.pricePerNight || 100} / night
                </span>
                <h3 className="text-2xl font-black text-stone-900">{selectedRoom.name}</h3>
              </div>
              <button
                onClick={() => setSelectedRoom(null)}
                className="text-stone-400 hover:text-stone-700 text-2xl leading-none cursor-pointer p-1"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Check-In Date
                </label>
                <input
                  type="date"
                  required
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full input-clean rounded-xl px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Check-Out Date
                </label>
                <input
                  type="date"
                  required
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="w-full input-clean rounded-xl px-4 py-2.5 text-sm"
                />
              </div>

              {calculateTotal() !== null && (
                <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl flex justify-between items-center text-sm">
                  <span className="text-stone-600">Estimated Total:</span>
                  <strong className="text-stone-900 text-base font-bold">${calculateTotal()}</strong>
                </div>
              )}

              <div className="flex space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedRoom(null)}
                  className="flex-1 btn-secondary py-2.5 rounded-xl text-sm font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
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