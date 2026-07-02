# Day 6: Vite Setup & React Basics

## Objectives

By the end of this 4-hour session, you should be able to:

- Create a **Vite + React + TypeScript** app in `hotel-booking-app/web/`
- Explain how React **components** replace Day 3 DOM functions like `createHotelCard`
- Write **JSX** with Tailwind classes (same utilities as Week 1)
- Pass data with **props** and handle events with **`onClick` / `onSubmit`**
- Compose `SearchBar`, `HotelList`, and `HotelCard` into a home page

> **No hooks today.** We use **static props** from `App.tsx`. `useState` starts on **Day 7**. Live API `fetch` returns on **Day 9** with `useEffect`.

---

## How to follow this lesson

| Terminal     | Folder       | Command                       | URL                   |
| ------------ | ------------ | ----------------------------- | --------------------- |
| 1 (optional) | `backend/` | `uvicorn main:app --reload` | :8000                 |
| 2            | `web/`     | `npm run dev`               | http://localhost:5173 |

**Rule:** After each step → **save** → check the browser (Vite hot-reloads automatically).

Backend is **optional today** — we pass static hotel data as props. Same data shape as your FastAPI `GET /api/hotels`.

---

## Week 2 overview

| Day                 | Topic                                  |
| ------------------- | -------------------------------------- |
| **6 (today)** | Vite, components, JSX, props, events   |
| 7                   | `useState`, lifting state            |
| 8                   | `useContext`, `localStorage`       |
| 9                   | `useEffect`, custom hooks, `fetch` |
| 10                  | Forms, validation, React Router        |

---

## Bridge from Week 1 (vanilla → React)

| Week 1 (`frontend/`)                     | Week 2 (`web/`)                |
| ------------------------------------------ | -------------------------------- |
| `createHotelCard(hotel)`                 | `<HotelCard hotel={hotel} />`  |
| `displayHotels(list)`                    | `<HotelList hotels={list} />`  |
| `document.getElementById('searchInput')` | `<SearchBar onSearch={...} />` |
| `class="text-xl"`                        | `className="text-xl"`          |
| `addEventListener('click', ...)`         | `<button onClick={...}>`       |

You are rebuilding the **same hotel UI** with a better structure — not learning a different app.

---

## Repo layout (full course)

```
hotel-booking-app/
├── backend/      # FastAPI (Day 4) — optional today
├── frontend/     # Week 1 vanilla capstone (reference)
└── web/          # Week 2 React — you build this today
```

---

# Part 1 — Vite + React setup (25 min)

## Step 1: Create the Vite app

```bash
cd hotel-booking-app
npm create vite@latest web -- --template react-ts
cd web
npm install
```

## Step 2: Start the dev server

```bash
npm run dev
```

Open http://localhost:5173

**You should see:** Vite + React welcome page with hot reload.

---

## Step 3: Create folder structure

```bash
mkdir -p src/components src/types src/data src/services src/config
```

---

## Step 4: Clean up default files

Delete `src/assets/react.svg` and `public/vite.svg` (optional).

Replace `src/App.tsx`:

```tsx
function App() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Hotel Booking System</h1>
      <p className="text-gray-600">Week 2 — React components</p>
    </div>
  );
}

export default App;
```

Replace `src/App.css` with an empty file or delete it and remove the import from `App.tsx`.

**Checkpoint:** Custom title appears; no Vite logo clutter.

---

## Step 5: `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: true },
});
```

---

## Step 6: Port Week 1 types and config

**`src/types/hotel.ts`** — copy from `frontend/src/types/hotel.ts`:

```typescript
export interface Hotel {
  id: number;
  name: string;
  location: string;
  rating: number;
  price: number;
  available: boolean;
  amenities: string[];
}

export interface BookingPayload {
  guestName: string;
  email: string;
  hotelId: number;
  hotelName: string;
  checkIn: string;
  checkOut: string;
  total: string;
}
```

**`src/config.ts`:**

```typescript
export const config = {
  apiBase: 'http://127.0.0.1:8000',
} as const;
```

Copy `src/services/hotelService.ts` from Week 1 for later — **do not call it from components today**.

**Checkpoint:** Project compiles; types ready for components.

---

# Part 2 — Static data & first component

## Step 7: Mock hotel data (same as backend)

**`src/data/mockHotels.ts`**

```typescript
import type { Hotel } from '../types/hotel';

export const MOCK_HOTELS: Hotel[] = [
  {
    id: 1,
    name: 'Grand Palace Hotel',
    location: 'Foshan',
    rating: 4.5,
    price: 200,
    available: true,
    amenities: ['WiFi', 'Pool', 'Spa'],
  },
  {
    id: 2,
    name: 'Seaside Resort',
    location: 'Guangzhou',
    rating: 4.0,
    price: 150,
    available: true,
    amenities: ['WiFi', 'Beach', 'Pool'],
  },
  {
    id: 3,
    name: 'Mountain Lodge',
    location: 'Shenzhen',
    rating: 4.8,
    price: 180,
    available: false,
    amenities: ['WiFi', 'Fireplace', 'Hiking'],
  },
];
```

---

## Step 8: Your first component — `AmenityBadge`

**`src/components/AmenityBadge.tsx`**

```tsx
interface AmenityBadgeProps {
  label: string;
}

export function AmenityBadge({ label }: AmenityBadgeProps) {
  return (
    <span className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-700">
      {label}
    </span>
  );
}
```

**What is a component?** A function that returns JSX (HTML-like syntax in TypeScript).

---

## Step 9: `HotelCard` with props

**`src/components/HotelCard.tsx`**

```tsx
import type { Hotel } from '../types/hotel';
import { AmenityBadge } from './AmenityBadge';

interface HotelCardProps {
  hotel: Hotel;
  onBook?: (hotelId: number) => void;
}

export function HotelCard({ hotel, onBook }: HotelCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
      <h3 className="text-xl font-bold text-hotel-primary mb-2">{hotel.name}</h3>
      <p className="text-gray-600 mb-2">📍 {hotel.location}</p>
      <p className="text-2xl font-bold text-hotel-secondary mb-2">
        ${hotel.price}/night
      </p>
      <p className="text-hotel-gold mb-3">⭐ {hotel.rating} stars</p>

      <div className="flex flex-wrap gap-2 mb-3">
        {hotel.amenities.map((amenity) => (
          <AmenityBadge key={amenity} label={amenity} />
        ))}
      </div>

      <p className={hotel.available ? 'text-green-600 mb-4' : 'text-red-600 mb-4'}>
        {hotel.available ? 'Available' : 'Booked'}
      </p>

      {hotel.available && (
        <button
          type="button"
          className="w-full bg-hotel-secondary text-white py-2 rounded hover:bg-hotel-primary transition-colors"
          onClick={() => onBook?.(hotel.id)}
        >
          Book Now
        </button>
      )}
    </article>
  );
}
```

> **`key` in lists:** React needs a unique `key` when mapping arrays. Use stable ids (`amenity` string is OK here).

---

## Step 10: Render one card in `App.tsx`

```tsx
import { HotelCard } from './components/HotelCard';
import { MOCK_HOTELS } from './data/mockHotels';

function App() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Hotel Booking System</h1>
      <HotelCard hotel={MOCK_HOTELS[0]} />
    </div>
  );
}

export default App;
```

**Checkpoint:** One styled hotel card on screen.

---

# Part 3 — Lists and composition

## Step 11: `HotelList` component

**`src/components/HotelList.tsx`**

```tsx
import type { Hotel } from '../types/hotel';
import { HotelCard } from './HotelCard';

interface HotelListProps {
  hotels: Hotel[];
  onBook?: (hotelId: number) => void;
}

export function HotelList({ hotels, onBook }: HotelListProps) {
  if (hotels.length === 0) {
    return <p className="text-center text-gray-500">No hotels found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {hotels.map((hotel) => (
        <HotelCard key={hotel.id} hotel={hotel} onBook={onBook} />
      ))}
    </div>
  );
}
```

This replaces Week 1’s `displayHotels()` + `forEach`.

---

## Step 12: Show all hotels

```tsx
import { HotelList } from './components/HotelList';
import { MOCK_HOTELS } from './data/mockHotels';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <h1 className="text-4xl font-bold text-center text-hotel-primary mb-8">
        Hotel Booking System
      </h1>
      <HotelList hotels={MOCK_HOTELS} />
    </div>
  );
}

export default App;
```

**Checkpoint:** Three cards in a responsive grid.

---

# Part 4 — Events without state

## Step 13: Handle "Book Now" in the parent

The **parent** (`App`) owns the handler; the **child** (`HotelCard`) calls it via props — same idea as Day 5 passing `onBook` to `createHotelCard`.

```tsx
function App() {
  const handleBook = (hotelId: number) => {
    const hotel = MOCK_HOTELS.find((h) => h.id === hotelId);
    console.log('Book clicked:', hotel);
    alert(`Booking ${hotel?.name} — state & modal come on Day 7!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <h1 className="text-4xl font-bold text-center text-hotel-primary mb-8">
        Hotel Booking System
      </h1>
      <HotelList hotels={MOCK_HOTELS} onBook={handleBook} />
    </div>
  );
}
```

**Checkpoint:** Click "Book Now" → alert. No `useState` yet.

---

## Step 14: `SearchBar` with callback prop

**`src/components/SearchBar.tsx`**

```tsx
interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
      <input
        type="text"
        placeholder="Search hotels..."
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-hotel-secondary"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}
```

Wire in `App.tsx`:

```tsx
const handleSearch = (query: string) => {
  console.log('Search query:', query);
};

// Inside return, above HotelList:
<SearchBar onSearch={handleSearch} />
```

**Checkpoint:** Typing logs to DevTools Console. Filtering waits until Day 7 (`useState`).

---

# Part 5 — Tailwind v4 in Vite 

Week 1 used the Tailwind CLI. In React we use the **Vite plugin** (official Tailwind v4 approach).

## Step 15: Install Tailwind

```bash
npm install tailwindcss @tailwindcss/vite
```

## Step 16: Configure Vite + theme

**`vite.config.ts`**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5173, open: true },
});
```

**`src/index.css`** — replace contents:

```css
@import "tailwindcss";

@theme {
  --color-hotel-primary: #2c3e50;
  --color-hotel-secondary: #3498db;
  --color-hotel-gold: #f39c12;
}
```

Ensure `src/main.tsx` imports CSS:

```tsx
import './index.css';
```

**Checkpoint:** Hotel colors (`text-hotel-primary`, etc.) match Week 1 styling.

---

# Part 6 — Final layout

## Step 17: Compose the home page

**`src/App.tsx`** — final version for today:

```tsx
import { HotelList } from './components/HotelList';
import { SearchBar } from './components/SearchBar';
import { MOCK_HOTELS } from './data/mockHotels';

function App() {
  const handleSearch = (query: string) => {
    console.log('Search:', query);
  };

  const handleBook = (hotelId: number) => {
    const hotel = MOCK_HOTELS.find((h) => h.id === hotelId);
    alert(`Book ${hotel?.name}? — full flow on Day 7+`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <h1 className="text-4xl font-bold text-center text-hotel-primary mb-8">
        Hotel Booking System
      </h1>
      <SearchBar onSearch={handleSearch} />
      <div className="max-w-4xl mx-auto">
        <HotelList hotels={MOCK_HOTELS} onBook={handleBook} />
      </div>
    </div>
  );
}

export default App;
```

---

## Step 18: Class demo checklist

- [ ] `npm run dev` — app on :5173
- [ ] Three hotel cards with Tailwind styling
- [ ] Search input logs to console
- [ ] Book button shows alert
- [ ] Edit a component → page hot-reloads
- [ ] Component tree: `App` → `SearchBar` + `HotelList` → `HotelCard` → `AmenityBadge`

---

# JSX quick reference

```tsx
// Variables in JSX
<p>{hotel.price}</p>

// Conditional
{hotel.available && <button>Book</button>}
{hotel.available ? 'Yes' : 'No'}

// Lists — always use key
{hotels.map((h) => <HotelCard key={h.id} hotel={h} />)}

// Events — pass function reference, call with () =>
<button onClick={() => onBook(hotel.id)}>Book</button>

// className not class
<div className="text-xl font-bold" />
```

---

# Troubleshooting

| Problem                   | Fix                                                                             |
| ------------------------- | ------------------------------------------------------------------------------- |
| Port 5173 in use          | Change port in`vite.config.ts` or kill other Vite process                     |
| Tailwind classes ignored  | Check`@tailwindcss/vite` in plugins; `import './index.css'` in `main.tsx` |
| `HotelCard` not found   | Check file name + export; import path case-sensitive on Linux                   |
| Blank page                | Open DevTools Console for red errors                                            |
| `npm create vite` fails | Run from`hotel-booking-app/`, not `web/`                                    |

---

# Homework

Pick **2–3**:

1. Add `RatingStars` component (render ⭐ from `rating` prop)
2. Add `PriceTag` component (`$200/night` formatting)
3. Add location `<select>` to `SearchBar` (log value only — filter on Day 7)
4. Read: https://react.dev/learn/state-a-components-memory

---

# Summary

| Step   | You learned                             |
| ------ | --------------------------------------- |
| 1–6   | Vite + React + TS in`web/`            |
| 7–12  | Props, JSX, list rendering, composition |
| 13–14 | Events via callback props (no hooks)    |
| 15–16 | Tailwind v4 +`@tailwindcss/vite`      |
| 17–18 | Full home page layout                   |

**Next (Day 7):** `useState` for search filter, selected hotel, and booking form — your `console.log` handlers become real UI updates.

---

# Appendix: Complete `web/` project

## Run

```bash
cd hotel-booking-app/web
npm install
npm run dev
```

## `package.json` (key parts)

```json
{
  "name": "hotel-booking-web",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.1.11",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.4",
    "tailwindcss": "^4.1.11",
    "typescript": "~5.7.2",
    "vite": "^6.0.0"
  }
}
```

---

## `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5173, open: true },
});
```

---

## `src/main.tsx`

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

---

## `src/index.css`

```css
@import "tailwindcss";

@theme {
  --color-hotel-primary: #2c3e50;
  --color-hotel-secondary: #3498db;
  --color-hotel-gold: #f39c12;
}
```

---

## `src/config.ts`

```typescript
export const config = {
  apiBase: 'http://127.0.0.1:8000',
} as const;
```

---

## `src/types/hotel.ts`

```typescript
export interface Hotel {
  id: number;
  name: string;
  location: string;
  rating: number;
  price: number;
  available: boolean;
  amenities: string[];
}

export interface BookingPayload {
  guestName: string;
  email: string;
  hotelId: number;
  hotelName: string;
  checkIn: string;
  checkOut: string;
  total: string;
}
```

---

## `src/data/mockHotels.ts`

```typescript
import type { Hotel } from '../types/hotel';

export const MOCK_HOTELS: Hotel[] = [
  {
    id: 1,
    name: 'Grand Palace Hotel',
    location: 'Foshan',
    rating: 4.5,
    price: 200,
    available: true,
    amenities: ['WiFi', 'Pool', 'Spa'],
  },
  {
    id: 2,
    name: 'Seaside Resort',
    location: 'Guangzhou',
    rating: 4.0,
    price: 150,
    available: true,
    amenities: ['WiFi', 'Beach', 'Pool'],
  },
  {
    id: 3,
    name: 'Mountain Lodge',
    location: 'Shenzhen',
    rating: 4.8,
    price: 180,
    available: false,
    amenities: ['WiFi', 'Fireplace', 'Hiking'],
  },
];
```

---

## `src/services/hotelService.ts` (for Day 9 — not used today)

```typescript
import { config } from '../config';
import type { Hotel, BookingPayload } from '../types/hotel';

export async function fetchHotels(): Promise<Hotel[]> {
  const response = await fetch(`${config.apiBase}/api/hotels`);
  if (!response.ok) throw new Error('Failed to load hotels');
  return response.json();
}

export async function submitBooking(
  booking: BookingPayload
): Promise<{ status: string; message: string }> {
  const response = await fetch(`${config.apiBase}/api/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking),
  });
  if (!response.ok) throw new Error('Booking failed');
  return response.json();
}
```

---

## `src/components/AmenityBadge.tsx`

```tsx
interface AmenityBadgeProps {
  label: string;
}

export function AmenityBadge({ label }: AmenityBadgeProps) {
  return (
    <span className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-700">
      {label}
    </span>
  );
}
```

---

## `src/components/HotelCard.tsx`

```tsx
import type { Hotel } from '../types/hotel';
import { AmenityBadge } from './AmenityBadge';

interface HotelCardProps {
  hotel: Hotel;
  onBook?: (hotelId: number) => void;
}

export function HotelCard({ hotel, onBook }: HotelCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <h3 className="text-xl font-bold text-hotel-primary mb-2">{hotel.name}</h3>
      <p className="text-gray-600 mb-2">📍 {hotel.location}</p>
      <p className="text-2xl font-bold text-hotel-secondary mb-2">
        ${hotel.price}/night
      </p>
      <p className="text-hotel-gold mb-3">⭐ {hotel.rating} stars</p>

      <div className="flex flex-wrap gap-2 mb-3">
        {hotel.amenities.map((amenity) => (
          <AmenityBadge key={amenity} label={amenity} />
        ))}
      </div>

      <p className={hotel.available ? 'text-green-600 mb-4' : 'text-red-600 mb-4'}>
        {hotel.available ? 'Available' : 'Booked'}
      </p>

      {hotel.available && (
        <button
          type="button"
          className="w-full bg-hotel-secondary text-white py-2 rounded hover:bg-hotel-primary hover:scale-105 active:scale-95 transition-all duration-300"
          onClick={() => onBook?.(hotel.id)}
        >
          Book Now
        </button>
      )}
    </article>
  );
}
```

---

## `src/components/HotelList.tsx`

```tsx
import type { Hotel } from '../types/hotel';
import { HotelCard } from './HotelCard';

interface HotelListProps {
  hotels: Hotel[];
  onBook?: (hotelId: number) => void;
}

export function HotelList({ hotels, onBook }: HotelListProps) {
  if (hotels.length === 0) {
    return <p className="text-center text-gray-500 col-span-full">No hotels found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {hotels.map((hotel) => (
        <HotelCard key={hotel.id} hotel={hotel} onBook={onBook} />
      ))}
    </div>
  );
}
```

---

## `src/components/SearchBar.tsx`

```tsx
interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
      <input
        type="text"
        placeholder="Search hotels..."
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-hotel-secondary"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}
```

---

## `src/App.tsx`

```tsx
import { HotelList } from './components/HotelList';
import { SearchBar } from './components/SearchBar';
import { MOCK_HOTELS } from './data/mockHotels';

function App() {
  const handleSearch = (query: string) => {
    console.log('Search:', query);
  };

  const handleBook = (hotelId: number) => {
    const hotel = MOCK_HOTELS.find((h) => h.id === hotelId);
    alert(`Book ${hotel?.name}? — full booking flow on Day 7+`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <h1 className="text-4xl font-bold text-center text-hotel-primary mb-8">
        Hotel Booking System
      </h1>
      <SearchBar onSearch={handleSearch} />
      <div className="max-w-4xl mx-auto">
        <HotelList hotels={MOCK_HOTELS} onBook={handleBook} />
      </div>
    </div>
  );
}

export default App;
```

---

## Component tree (today)

```
App
├── SearchBar          onSearch → console.log
└── HotelList          hotels={MOCK_HOTELS}
    └── HotelCard × 3  onBook → alert
        └── AmenityBadge × n
```

**Lab reference:** `lab_new/steps/step06_vite_react_basics/`