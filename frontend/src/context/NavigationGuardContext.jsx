import { createContext, useCallback, useContext, useMemo, useRef } from 'react';

const NavigationGuardContext = createContext(null);

export function NavigationGuardProvider({ children }) {
  const guardRef = useRef(null);

  const registerNavigationGuard = useCallback((guardFn) => {
    guardRef.current = guardFn;
    return () => {
      if (guardRef.current === guardFn) {
        guardRef.current = null;
      }
    };
  }, []);

  const requestGuardedNavigation = useCallback((navigateFn) => {
    if (guardRef.current) {
      guardRef.current(navigateFn);
      return;
    }
    navigateFn();
  }, []);

  const value = useMemo(
    () => ({ registerNavigationGuard, requestGuardedNavigation }),
    [registerNavigationGuard, requestGuardedNavigation],
  );

  return (
    <NavigationGuardContext.Provider value={value}>
      {children}
    </NavigationGuardContext.Provider>
  );
}

export function useNavigationGuard() {
  return useContext(NavigationGuardContext);
}
