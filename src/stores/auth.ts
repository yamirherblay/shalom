import { defineStore } from 'pinia'

interface AuthState {
  isAuthenticated: boolean
  username: string | null
}

const STORAGE_KEY = 'mtx_auth_v1'

function loadState(): AuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as AuthState
  }catch(Error: unknown) {
    console.error( Error, 'Error saving auth state to localStorage. Please clear your browser cache and try again.')
  }
  return { isAuthenticated: false, username: null }
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => loadState(),
  actions: {
    login(username: string, password: string): boolean {
      // Hardcoded credentials as requested
      const valid = username === 'mercadoTexas' && password === 'Sabrina123**'
      if (valid) {
        this.isAuthenticated = true
        this.username = username
        this.persist()
      }
      return valid
    },
    logout() {
      this.isAuthenticated = false
      this.username = null
      this.persist()
    },
    persist() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          isAuthenticated: this.isAuthenticated,
          username: this.username,
        }))
      } catch(Error: unknown) {
      console.error( Error, 'Error saving auth state to localStorage. Please clear your browser cache and try again.')
      }
    }
  }
})
