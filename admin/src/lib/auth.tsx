import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, setCsrf } from './api';

type State = { ready: boolean; user: string | null };
type Ctx = State & {
  login: (u: string, p: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthCtx = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({ ready: false, user: null });

  useEffect(() => {
    api.me()
      .then((r) => {
        if (r.authenticated) {
          setCsrf(r.csrf || '');
          setState({ ready: true, user: r.user });
        } else {
          setState({ ready: true, user: null });
        }
      })
      .catch(() => setState({ ready: true, user: null }));
  }, []);

  return (
    <AuthCtx.Provider
      value={{
        ...state,
        login: async (user, pass) => {
          const r = await api.login(user, pass);
          setCsrf(r.csrf || '');
          setState({ ready: true, user: r.user });
        },
        logout: async () => {
          await api.logout().catch(() => {});
          setCsrf('');
          setState({ ready: true, user: null });
        },
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth поза AuthProvider');
  return ctx;
}
