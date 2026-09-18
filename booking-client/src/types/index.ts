// Matches RoomResponse in .NET
export interface Room {
  id: number;
  name: string;
  capacity: number;
  pricePerNight: number;
}

export interface CreateRoomRequest {
  name: string;
  capacity: number;
  pricePerNight: number;
}

export interface Booking {
  id: number;
  customerId: number;
  roomId: number;
  roomName: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
}

export interface CreateBookingRequest {
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
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

export interface AIRecommendationRequest {
  prompt: string;
}

export interface AIRecommendationResponse {
  recommendedRoomId: number | null;
  roomName: string;
  explanation: string;
  pricePerNight: number;
}