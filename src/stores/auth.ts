import { defineStore } from 'pinia';
import { supabase } from 'boot/supabase';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
  } | null;
}

const STORAGE_KEY = 'mtx_auth_v1';

function loadState(): AuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AuthState;
  } catch (Error: unknown) {
    console.error(Error, 'Error loading auth state from localStorage.');
  }
  return { isAuthenticated: false, user: null };
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => loadState(),
  getters: {
    isAdmin: () => true,
    userEmail: (state) => state.user?.email || null,
  },
  actions: {
    async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          this.isAuthenticated = true;
          this.user = {
            id: data.user.id,
            email: data.user.email || '',
          };
          this.persist();
          return { success: true };
        }

        return { success: false, error: 'Error desconocido' };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error de conexión';
        return { success: false, error: message };
      }
    },

    async logout() {
      await supabase.auth.signOut();
      this.isAuthenticated = false;
      this.user = null;
      this.persist();
    },

    async initializeAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        this.isAuthenticated = true;
        this.user = {
          id: session.user.id,
          email: session.user.email || '',
        };
        this.persist();
      }

      supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          this.isAuthenticated = true;
          this.user = {
            id: session.user.id,
            email: session.user.email || '',
          };
        } else {
          this.isAuthenticated = false;
          this.user = null;
        }
        this.persist();
      });
    },

    persist() {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            isAuthenticated: this.isAuthenticated,
            user: this.user,
          }),
        );
      } catch (Error: unknown) {
        console.error(Error, 'Error saving auth state to localStorage.');
      }
    },
  },
});
