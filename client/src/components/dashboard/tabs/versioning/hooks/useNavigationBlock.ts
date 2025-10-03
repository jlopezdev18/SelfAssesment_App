import { useEffect, useCallback } from 'react';

export const useNavigationBlock = (isBlocked: boolean, message?: string) => {
  const defaultMessage = 'Upload in progress. Are you sure you want to leave? Your progress will be lost.';

  // Bloquear navegación del navegador (beforeunload)
  useEffect(() => {
    if (!isBlocked) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = message || defaultMessage;
      return message || defaultMessage;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isBlocked, message, defaultMessage]);

  // Función para confirmar navegación
  const confirmNavigation = useCallback(() => {
    if (isBlocked) {
      return window.confirm(message || defaultMessage);
    }
    return true;
  }, [isBlocked, message, defaultMessage]);

  return { confirmNavigation };
};
