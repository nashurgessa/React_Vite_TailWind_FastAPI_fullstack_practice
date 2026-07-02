# Day 9: useEffect, useRef & Custom Hooks

## Objectives

By the end of this 4-hour session, you should be able to:

- Use `useEffect` for side effects (data fetching on mount)
- Understand dependency arrays and cleanup functions
- Use `useRef` for DOM references and mutable values
- Create custom hooks (`useHotels`, `useHotelSearch`)
- Fetch hotel data with Axios against the mock service
- Separate data logic from UI components

---

## React Hooks for Side Effects

**Yesterday:** Global state with context + localStorage.

**Today:** Automate data loading and encapsulate reusable logic in custom hooks.

| Hook          | Purpose in hotel app                          |
| ------------- | --------------------------------------------- |
| `useEffect` | Fetch hotels on page load, sync with API      |
| `useRef`    | Focus search input, scroll to booking summary |
| Custom hooks  | `useHotels()`, `useDebounce()`            |

**Note:** Week 2 uses `web/src/services/hotelService.ts` (same `fetch` URLs as Week 1). You can point at the Day 4 backend (`uvicorn` on :8000) or use static mock data in components until Day 9. Full database-backed API comes in Week 3–4.

---

## Activity 1: Mock API Setup

Install Axios:

```bash
npm install axios
```

Confirm `src/services/hotelService.ts` exports `fetchHotels`, `searchHotels` (mock with delay).

Optional Axios instance:

```typescript
// src/services/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
});
```

---

## Activity 2: useEffect for Data Fetching 

Replace Day 7's "load on button click" with automatic fetch on mount:

```tsx
import { useState, useEffect } from 'react';
import { fetchHotels } from '../services/hotelService';
import type { Hotel } from '../types/hotel';

function HotelList() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const data = await fetchHotels();
        if (!cancelled) {
          setHotels(data);
          setError(null);
        }
      } catch {
        if (!cancelled) setError('Failed to load hotels');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true; // cleanup — ignore stale responses
    };
  }, []); // empty deps = run once on mount

  if (loading) return <p>Loading hotels...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {hotels.map((h) => (
        <HotelCard key={h.id} hotel={h} />
      ))}
    </div>
  );
}
```

---

## Activity 3: useEffect with Dependencies

Re-fetch when search query changes:

```tsx
function HotelSearchResults({ query }: { query: string }) {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setHotels([]);
      return;
    }

    setLoading(true);
    searchHotels(query)
      .then(setHotels)
      .finally(() => setLoading(false));
  }, [query]); // re-run when query changes

  if (loading) return <p>Searching...</p>;
  return <HotelList hotels={hotels} />;
}
```

**Practice:** Add debounced search (homework: `useDebounce` hook).

---

## Activity 4: useRef for DOM Access

`useRef` holds a reference to a DOM element or any mutable value that doesn't trigger re-renders.

**Focus search input on page load:**

```tsx
import { useRef, useEffect } from 'react';

function HotelSearchBar() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search hotels..."
    />
  );
}
```

**Scroll to booking summary after submit:**

```tsx
function BookingPage() {
  const summaryRef = useRef<HTMLDivElement>(null);

  const handleSubmit = () => {
    summaryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <BookingForm onSubmit={handleSubmit} />
      <div ref={summaryRef}>
        <h2>Booking Summary</h2>
      </div>
    </div>
  );
}
```

**Focus first invalid field on validation error:**

```tsx
const nameRef = useRef<HTMLInputElement>(null);

const validate = () => {
  if (!guestName) {
    nameRef.current?.focus();
    return false;
  }
  return true;
};

return <input ref={nameRef} ... />;
```

---

## Activity 5: Custom Hooks 

### useHotels

```tsx
// src/hooks/useHotels.ts
import { useState, useEffect } from 'react';
import { fetchHotels } from '../services/hotelService';
import type { Hotel } from '../types/hotel';

export function useHotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHotels()
      .then(setHotels)
      .catch(() => setError('Failed to load hotels'))
      .finally(() => setLoading(false));
  }, []);

  return { hotels, loading, error, refetch: () => fetchHotels().then(setHotels) };
}
```

### useHotel (single hotel by ID)

```tsx
export function useHotel(hotelId: number) {
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotels().then((all) => {
      setHotel(all.find((h) => h.id === hotelId) ?? null);
      setLoading(false);
    });
  }, [hotelId]);

  return { hotel, loading };
}
```

**Using hooks in components:**

```tsx
function HomePage() {
  const { hotels, loading, error } = useHotels();
  const { bookingCount } = useBookings();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Hotels ({bookingCount} in cart)</h1>
      <HotelList hotels={hotels} />
    </div>
  );
}
```

---

## Activity 6: useMemo & useCallback

Brief intro — full optimization is homework:

```tsx
const totalPrice = useMemo(
  () => nights * hotel.price,
  [nights, hotel.price]
);

const handleBook = useCallback(() => {
  addBooking({ ... });
}, [addBooking]);
```

Use when profiling shows unnecessary re-renders — not required for every component.

---

## Main Class Activity: Data-Driven Hotel List

**Task:** Replace manual loading with hooks and effects

**Requirements:**

- `useHotels` custom hook
- `HotelList` auto-loads on mount via `useEffect`
- `HotelSearchBar` with `useRef` focus
- Search results update when query changes (dependency array)
- Integrate with `BookingContext` from Day 8
- No external backend — mock service only

**Steps:**

1. Create `useHotels` and `useHotel` hooks
2. Refactor `HotelList` to use `useHotels`
3. Add search with `useEffect` + `[query]` dependency
4. Add `useRef` focus on search input
5. Test loading, error, and empty states
6. Verify cart still works from Day 8

---

## Homework: Advanced Hooks

### Task 1: More Custom Hooks

- `useDebounce(value, delay)` for search input
- `useLocalStorage` — if not done on Day 8
- `useWindowSize` for responsive layout

### Task 2: Performance (Optional)

- `useMemo` for price calculation in booking summary
- `useCallback` for stable event handlers passed to children

### Task 3: Preparation for Next Session

**Read before next class:**

- React Router: https://reactrouter.com/
- React Forms: https://react.dev/reference/react-dom/components/input

---

## Summary: useEffect, useRef & Custom Hooks

**Key Takeaways:**

- **useEffect** runs side effects after render (fetch, subscribe, sync)
- **Dependency array** controls when the effect re-runs
- **Cleanup** prevents bugs from stale async responses
- **useRef** accesses DOM elements without re-renders
- **Custom hooks** extract reusable data logic from UI
- **Mock service** keeps frontend independent until Week 4

**Next Session:** Forms, validation, multi-step booking wizard, and React Router with protected routes.