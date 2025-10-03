import { useEffect, useRef } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { toast } from 'sonner';

const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
const CHECK_INTERVAL = 60 * 1000; // Check every minute
const LOGIN_TIMESTAMP_KEY = 'session_login_timestamp';

export const useSessionTimeout = () => {
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const user = auth.currentUser;

    // Only set up timeout if user is logged in
    if (!user) {
      // Clear any existing timestamp when user logs out
      localStorage.removeItem(LOGIN_TIMESTAMP_KEY);
      return;
    }

    // Initialize login timestamp if it doesn't exist
    const existingTimestamp = localStorage.getItem(LOGIN_TIMESTAMP_KEY);
    if (!existingTimestamp) {
      localStorage.setItem(LOGIN_TIMESTAMP_KEY, Date.now().toString());
    }

    const checkSessionExpiry = async () => {
      const loginTimestamp = localStorage.getItem(LOGIN_TIMESTAMP_KEY);
      
      if (!loginTimestamp) {
        // No timestamp found, create one
        localStorage.setItem(LOGIN_TIMESTAMP_KEY, Date.now().toString());
        return;
      }

      const currentTime = Date.now();
      const elapsedTime = currentTime - parseInt(loginTimestamp);

      // If 8 hours have passed, log out the user
      if (elapsedTime >= SESSION_DURATION) {
        try {
          await signOut(auth);
          localStorage.removeItem(LOGIN_TIMESTAMP_KEY);
          
          toast.error('Session Expired', {
            description: 'Your session has expired after 8 hours. Please log in again.',
            duration: 6000,
            style: {
              background: '#dc2626',
              color: 'white',
              border: '1px solid #dc2626',
            },
          });
        } catch (error) {
          console.error('Error signing out:', error);
        }
      }
    };

    // Check immediately
    checkSessionExpiry();

    // Then check every minute
    checkIntervalRef.current = setInterval(checkSessionExpiry, CHECK_INTERVAL);

    // Cleanup on unmount
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, []);

  // Function to reset session timer (optional - can be called on user activity)
  const resetSessionTimer = () => {
    if (auth.currentUser) {
      localStorage.setItem(LOGIN_TIMESTAMP_KEY, Date.now().toString());
    }
  };

  return { resetSessionTimer };
};

