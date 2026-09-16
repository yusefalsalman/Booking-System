// Matches RoomResponse in .NET
export interface Room {
  id: number;
  name: string;
  capacity: number;
}

export interface CreateRoomRequest {
  name: string;
  capacity: number;
}

export interface Booking {
  id: number;
  customerName: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  roomId: number;
}

export interface CreateBookingRequest {
  customerName: string;
  checkInDate: string;
  checkOutDate: string;
  roomId: number;
}

// Matches Auth DTOs in .NET
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  fullName: string;
  role: string;
}