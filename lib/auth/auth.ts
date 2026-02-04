'use client';

import { User, UserRole } from '@/lib/types';

export interface AuthState {
  user: User | null;
  isLoading: boolean;
}

class AuthStore {
  private listeners: Set<() => void> = new Set();
  private user: User | null = null;
  private isVerifying: boolean = false;

  constructor() {
    // No storage - always verify with server
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  async verifyWithServer(): Promise<User | null> {
    if (this.isVerifying) {
      return this.user;
    }

    this.isVerifying = true;
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      });

      const result = await response.json();
      if (result.user && result.user.id && result.user.email && result.user.name && result.user.role) {
        this.user = result.user;
      } else {
        this.user = null;
      }
      this.notify();
      return this.user;
    } catch (_error) {
      this.user = null;
      this.notify();
      return null;
    } finally {
      this.isVerifying = false;
    }
  }

  getUser(): User | null {
    return this.user;
  }

  async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    if (!email || !password) {
      return { success: false, error: 'Email and password are required' };
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (result.success && result.user) {
        if (!result.user.id || !result.user.email || !result.user.name || !result.user.role) {
          return { success: false, error: 'Invalid user data received' };
        }
        this.user = result.user;
        this.notify();
        return { success: true, user: result.user };
      } else {
        return { success: false, error: result.error || 'Login failed' };
      }
    } catch (_error) {
      return { success: false, error: 'An error occurred during login' };
    }
  }

  async register(email: string, password: string, name: string, role: UserRole): Promise<{ success: boolean; user?: User; error?: string }> {
    if (!email || !password || !name || !role) {
      return { success: false, error: 'All fields are required' };
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, name, role }),
      });

      const result = await response.json();
      
      if (result.success && result.user) {
        this.user = result.user;
        this.notify();
        return { success: true, user: result.user };
      } else {
        return { success: false, error: result.error || 'Registration failed' };
      }
    } catch (error) {
      return { success: false, error: 'An error occurred during registration' };
    }
  }

  async logout() {
    try {
      // Clear cookie on server
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (_error) {
      // Continue even if logout endpoint fails
    }
    this.user = null;
    this.notify();
  }

  hasRole(role: UserRole): boolean {
    return this.user?.role === role;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    return this.user ? roles.includes(this.user.role) : false;
  }
}

export const authStore = new AuthStore();
