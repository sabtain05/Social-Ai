import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else if (error.response?.status === 403) {
      toast.error('Permission denied');
    } else if (error.response?.status === 404) {
      toast.error('Resource not found');
    } else if (error.response?.status === 500) {
      toast.error('Server error');
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// User API
export const userAPI = {
  getProfile: (username: string) => api.get(`/users/${username}`),
  updateProfile: (data: any) => api.put('/users/profile', data),
  updateProfilePicture: (formData: FormData) =>
    api.post('/users/profile-picture', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  searchUsers: (query: string) => api.get(`/users/search?q=${query}`),
  getFollowers: (userId: string) => api.get(`/users/${userId}/followers`),
  getFollowing: (userId: string) => api.get(`/users/${userId}/following`),
  getFriends: (userId: string) => api.get(`/users/${userId}/friends`),
};

// Post API
export const postAPI = {
  create: (data: any) => api.post('/posts', data),
  getFeed: (page: number = 1, limit: number = 10) => api.get(`/posts/feed?page=${page}&limit=${limit}`),
  getUserPosts: (userId: string, page: number = 1, limit: number = 10) =>
    api.get(`/posts/user/${userId}?page=${page}&limit=${limit}`),
  delete: (postId: string) => api.delete(`/posts/${postId}`),
};

// Like API
export const likeAPI = {
  toggle: (postId: string) => api.post(`/likes/${postId}/toggle`),
};

// Comment API
export const commentAPI = {
  create: (postId: string, content: string) => api.post(`/posts/${postId}/comments`, { content }),
  getComments: (postId: string) => api.get(`/posts/${postId}/comments`),
  delete: (postId: string, commentId: string) => api.delete(`/posts/${postId}/comments/${commentId}`),
};

// Follow API
export const followAPI = {
  follow: (userId: string) => api.post(`/follow/${userId}/follow`),
  unfollow: (userId: string) => api.delete(`/follow/${userId}/unfollow`),
};

// Friend Request API
export const friendRequestAPI = {
  send: (receiverId: string) => api.post(`/friend-requests/send/${receiverId}`),
  accept: (requestId: string) => api.post(`/friend-requests/${requestId}/accept`),
  reject: (requestId: string) => api.post(`/friend-requests/${requestId}/reject`),
  getPending: () => api.get('/friend-requests/pending'),
  getStatus: (userId: string) => api.get(`/friend-requests/status/${userId}`),
};

// AI API
export const aiAPI = {
  improve: (content: string) => api.post('/ai/improve', { content }),
};

// Share API
export const shareAPI = {
  track: (postId: string, platform: string) => api.post(`/shares/${postId}/track`, { platform }),
};

// Notification API
export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (notificationId: string) => api.put(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
};

// Institution API
export const institutionAPI = {
  search: (query: string, type?: string) => api.get(`/institutions/search?q=${query}${type ? `&type=${type}` : ''}`),
};

// Reels API
export const reelsAPI = {
  getFeed: (params?: { cursor?: string | null; limit?: number }) =>
    api.get('/reels/feed', { params }),
  getUserReels: (userId?: string) =>
    api.get(userId ? `/reels/user/${userId}` : '/reels/user/me'),  // Updated
  getReel: (reelId: string) => api.get(`/reels/${reelId}`),
  create: (formData: FormData) => api.post('/reels', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  like: (reelId: string) => api.post(`/reels/${reelId}/like`),
  getComments: (reelId: string) => api.get(`/reels/${reelId}/comments`),
  addComment: (reelId: string, content: string) => api.post(`/reels/${reelId}/comments`, { content }),
  deleteComment: (reelId: string, commentId: string) => api.delete(`/reels/${reelId}/comments/${commentId}`),
};

export default api;