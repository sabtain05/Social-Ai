export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  profile_picture: string;
  bio?: string;
  gender?: string;
  relationship_status?: string;
  high_school?: string;
  college?: string;
  hobbies?: string[];
  is_private?: boolean;
  created_at: string;
}

export interface Post {
  id: string;
  content: string;
  user_id: string;
  privacy: 'public' | 'friends';
  image_url?: string | null;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
  user?: User;
  is_liked?: boolean;
}

export interface Comment {
  id: string;
  content: string;
  post_id: string;
  user_id: string;
  created_at: string;
  user?: User;
}

export interface Reel {
  id: string;
  video_url: string;
  description: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  views_count: number;
  is_liked: boolean;
  created_at: string;
  user_id: string;
  username: string;
  full_name: string;
  profile_picture: string;
  duration: number;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'like' | 'comment' | 'follow' | 'friend_request' | 'friend_accept';
  reference_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  reference_data?: any;
}

export interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  sender?: User;
  receiver?: User;
}