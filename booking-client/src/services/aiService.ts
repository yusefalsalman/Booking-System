import axiosClient from '../api/axiosClient';
import type { AIRecommendationResponse } from '../types';

export const aiService = {
  async getRecommendation(prompt: string): Promise<AIRecommendationResponse> {
    const response = await axiosClient.post<AIRecommendationResponse>('/ai/recommend', { prompt });
    return response.data;
  },
};