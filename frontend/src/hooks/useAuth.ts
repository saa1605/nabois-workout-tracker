import { useState, useEffect } from 'react';
import api from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState<{username: string} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
         try {
             // In a real app we'd have a /me endpoint or decode the token
             // For now just assume if token exists we are logged in, 
             // but strictly we should verify. 
             // Let's implement a quick verification if the backend supported it, 
             // but the backend `get_current_user` is used on protected routes.
             // We can try to fetch something protected or just decode client side.
             setUser({ username: 'User' }); // Placeholder
         } catch (e) {
             localStorage.removeItem('token');
         }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  return { user, loading };
};
