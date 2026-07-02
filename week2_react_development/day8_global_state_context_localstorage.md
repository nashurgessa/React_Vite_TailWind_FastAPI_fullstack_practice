# Day 8: useContext, localStorage & Global State

## Objectives

By the end of this 4-hour session, you should be able to:

- Explain prop drilling and when to use `useContext`
- Create React contexts with `createContext` and `useContext`
- Persist state with `localStorage` (building on Week 1 Day 5)
- Build a reusable `useLocalStorage` custom hook
- Implement `AuthContext` and `BookingContext` for hotel booking
- Hydrate context state from `localStorage` on app load

---

## Why Global State?

Yesterday you lifted state to `App` and passed props down — prop drilling gets painful with deep component trees.

**Global state use cases in hotel booking:**

- Logged-in user (auth)
- Booking cart / pending bookings
- Favorites (synced with localStorage from Week 1)
- Theme or language preferences

**Today:** `useContext` shares state across the tree. `localStorage` keeps it after refresh.

---

## Activity 1: localStorage Helpers

Port helpers from Week 1 Day 5 — `src/utils/storage.ts`:

```typescript
export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
}

export function removeFromStorage(key: string): void {
  localStorage.removeItem(key);
}
```

**Practice:** Test in browser DevTools → Application → Local Storage.

---

## Activity 2: useLocalStorage Custom Hook

Encapsulate state + persistence in one hook:

```tsx
// src/hooks/useLocalStorage.ts
import { useState } from 'react';
import { loadFromStorage, saveToStorage } from '../utils/storage';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() =>
    loadFromStorage(key, initialValue)
  );

  const setStoredValue = (newValue: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const resolved =
        typeof newValue === 'function'
          ? (newValue as (prev: T) => T)(prev)
          : newValue;
      saveToStorage(key, resolved);
      return resolved;
    });
  };

  return [value, setStoredValue] as const;
}
```

**Usage — favorites:**

```tsx
function FavoritesButton({ hotelId }: { hotelId: number }) {
  const [favorites, setFavorites] = useLocalStorage<number[]>('hotel_favorites', []);

  const isFavorite = favorites.includes(hotelId);

  const toggle = () => {
    setFavorites(
      isFavorite
        ? favorites.filter((id) => id !== hotelId)
        : [...favorites, hotelId]
    );
  };

  return (
    <button onClick={toggle}>{isFavorite ? '❤️' : '🤍'}</button>
  );
}
```

---

## Activity 3: AuthContext with localStorage

```tsx
// src/context/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { saveToStorage, loadFromStorage, removeFromStorage } from '../utils/storage';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = loadFromStorage<User | null>('user', null);
    setUser(stored);
    setLoading(false);
  }, []);

  const login = async (email: string, _password: string) => {
    // Mock login — real API in Week 4
    const userData: User = {
      id: '1',
      name: 'Guest User',
      email,
    };
    setUser(userData);
    saveToStorage('user', userData);
    saveToStorage('authToken', 'mock-jwt-token');
  };

  const logout = () => {
    setUser(null);
    removeFromStorage('user');
    removeFromStorage('authToken');
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

**Wrap App:**

```tsx
// main.tsx
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
```

**LoginForm + UserMenu:**

```tsx
function LoginForm() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit" disabled={loading}>Login</button>
    </form>
  );
}

function UserMenu() {
  const { user, isAuthenticated, logout } = useAuth();
  if (!isAuthenticated) return <LoginForm />;
  return (
    <div>
      <span>Welcome, {user?.name}</span>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

## Activity 4: BookingContext (Shopping Cart)

```tsx
// src/context/BookingContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface BookingItem {
  hotelId: number;
  hotelName: string;
  checkIn: string;
  checkOut: string;
  pricePerNight: number;
}

interface BookingContextType {
  bookings: BookingItem[];
  addBooking: (item: BookingItem) => void;
  removeBooking: (hotelId: number) => void;
  clearBookings: () => void;
  bookingCount: number;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useLocalStorage<BookingItem[]>('hotel_bookings', []);

  const addBooking = (item: BookingItem) => {
    setBookings((prev) => {
      const exists = prev.findIndex((b) => b.hotelId === item.hotelId);
      if (exists >= 0) {
        const updated = [...prev];
        updated[exists] = item;
        return updated;
      }
      return [...prev, item];
    });
  };

  const removeBooking = (hotelId: number) => {
    setBookings((prev) => prev.filter((b) => b.hotelId !== hotelId));
  };

  const clearBookings = () => setBookings([]);

  return (
    <BookingContext.Provider
      value={{
        bookings,
        addBooking,
        removeBooking,
        clearBookings,
        bookingCount: bookings.length,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBookings() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within BookingProvider');
  }
  return context;
}
```

**Using in HotelCard:**

```tsx
function HotelCard({ hotel }: { hotel: Hotel }) {
  const { addBooking } = useBookings();

  const handleBook = () => {
    addBooking({
      hotelId: hotel.id,
      hotelName: hotel.name,
      checkIn: '2025-07-01',
      checkOut: '2025-07-03',
      pricePerNight: hotel.price,
    });
  };

  return (
    <div className="hotel-card">
      <h3>{hotel.name}</h3>
      <button onClick={handleBook}>Add to Bookings</button>
    </div>
  );
}
```

---

## Activity 5: Combining Providers

Nest providers in `main.tsx`:

```tsx
<AuthProvider>
  <BookingProvider>
    <App />
  </BookingProvider>
</AuthProvider>
```

**BookingBadge** — any component can read count without prop drilling:

```tsx
function BookingBadge() {
  const { bookingCount } = useBookings();
  return <span className="badge">{bookingCount}</span>;
}
```

---

## Main Class Activity: Global State Hotel App

**Task:** Add global auth and booking state with persistence

**Requirements:**

- `useLocalStorage` hook
- `AuthContext` with login/logout persisted
- `BookingContext` with cart persisted across refresh
- `FavoritesButton` using `useLocalStorage`
- `UserMenu` and `BookingBadge` in navbar — no prop drilling
- Refresh page — user and bookings should remain

**Steps:**

1. Create `storage.ts` and `useLocalStorage`
2. Implement `AuthProvider` and `useAuth`
3. Implement `BookingProvider` and `useBookings`
4. Wrap app with both providers
5. Add login form and booking cart UI
6. Test persistence after browser refresh

---

## Homework: Extend Global State

### Task 1: Enhanced Contexts

- Add `ThemeContext` (light/dark) with localStorage
- Persist search filters in context + localStorage
- Show booking total price in `BookingBadge`

### Task 2: Context Best Practices

- Split contexts by domain (don't put everything in one)
- Document when to use context vs local state

### Task 3: Preparation for Next Session

**Read before next class:**

- useEffect: https://react.dev/reference/react/useEffect
- Synchronizing with Effects: https://react.dev/learn/synchronizing-with-effects

---

## Summary: useContext & localStorage

**Key Takeaways:**

- **useContext** eliminates prop drilling for shared state
- **localStorage** persists data across sessions (same as Week 1 vanilla)
- **useLocalStorage** combines `useState` + persistence in one hook
- **AuthContext** manages user session globally
- **BookingContext** manages cart/bookings globally
- **Provider nesting** composes multiple global state domains

**Next Session:** `useEffect` for data fetching, `useRef` for DOM access, and custom hooks with the mock API.