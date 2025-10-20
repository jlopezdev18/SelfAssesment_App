import { useEffect, useRef } from 'react';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { toast } from 'sonner';

const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
const CHECK_INTERVAL = 60 * 1000; // Check every minute
const LOGIN_TIMESTAMP_KEY = 'session_login_timestamp';

export const useSessionTimeout = () => {
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkSessionExpiry = async () => {
      const loginTimestamp = localStorage.getItem(LOGIN_TIMESTAMP_KEY);

      if (!loginTimestamp) {
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
            description: 'Your session has expired. Please log in again.',
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

    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Clear any existing interval
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }

      if (user) {
        // User is logged in - check if we have a valid session timestamp
        const existingTimestamp = localStorage.getItem(LOGIN_TIMESTAMP_KEY);

        if (!existingTimestamp) {
          // No timestamp found - this shouldn't happen if login functions set it
          // Set it now as a fallback
          localStorage.setItem(LOGIN_TIMESTAMP_KEY, Date.now().toString());
        } else {
          // Check if session has already expired
          const elapsedTime = Date.now() - parseInt(existingTimestamp);
          if (elapsedTime >= SESSION_DURATION) {
            // Session already expired - log out immediately
            signOut(auth).then(() => {
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
            });
            return;
          }
        }

        // Check immediately
        checkSessionExpiry();

        // Then check every minute
        checkIntervalRef.current = setInterval(checkSessionExpiry, CHECK_INTERVAL);
      } else {
        // User is logged out - clear timestamp
        localStorage.removeItem(LOGIN_TIMESTAMP_KEY);
      }
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
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

