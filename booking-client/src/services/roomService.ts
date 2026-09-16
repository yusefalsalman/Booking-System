import axiosClient from '../api/axiosClient';
import type{ CreateRoomRequest, Room } from '../types/index';

export const roomService = {
  async getAll(): Promise<Room[]> {
    const response = await axiosClient.get<Room[]>('/rooms');
    return response.data;
  },

  async getById(id: number): Promise<Room> {
    const response = await axiosClient.get<Room>(`/rooms/${id}`);
    return response.data;
  },

  async create(data: CreateRoomRequest): Promise<Room> {
    // Requires Admin token automatically attached by axiosClient
    const response = await axiosClient.post<Room>('/rooms', data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    // Requires Admin token
    await axiosClient.delete(`/rooms/${id}`);
  },
};