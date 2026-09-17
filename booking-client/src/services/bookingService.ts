import axiosClient from '../api/axiosClient';
import type { Booking, CreateBookingRequest } from '../types';

export const bookingService = {
  async getAll(): Promise<Booking[]> {
    const response = await axiosClient.get<Booking[]>('/bookings');
    return response.data;
  },

  async getByRoomId(roomId: number): Promise<Booking[]> {
    const response = await axiosClient.get<Booking[]>(`/bookings/room/${roomId}`);
    return response.data;
  },

  async create(data: CreateBookingRequest): Promise<Booking> {
    // Requires logged-in token
    const response = await axiosClient.post<Booking>('/bookings', data);
    return response.data;
  },

  async cancel(id: number): Promise<void> {
    await axiosClient.delete(`/bookings/${id}`);
  },
  
async getMyBookings(): Promise<Booking[]> {
  const response = await axiosClient.get<Booking[]>('/bookings/my-bookings');
  return response.data;
},
};