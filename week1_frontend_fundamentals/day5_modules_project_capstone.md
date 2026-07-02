# Day 5: ES Modules, Project Structure & Week 1 Capstone

## Objectives

By the end of this session, you should be able to:

- Refactor your Day 4 **frontend** into ES modules with **TypeScript**
- Keep the `hotel-booking-app/` layout: `frontend/` + `backend/` (backend unchanged today)
- Centralize `fetch()` calls in a `hotelService` module (same API as Day 4)
- Persist **favorites**, **search history**, and **booking drafts** with `localStorage`
- Run the full Week 1 capstone: UI + API + persisted data

---

## How to follow this lesson

Continue the **same repo** from Day 4 — do not create a new project folder.

| Terminal | Folder | Command |
|----------|--------|---------|
| 1 | `backend/` | `uvicorn main:app --reload` |
| 2 | `frontend/` | `npm run watch` (CSS + TypeScript) |

Open `frontend/index.html` in the browser.

---

## Week 1 recap

| Day | Skill | What you built |
|-----|-------|----------------|
| 1 | JavaScript ES6+ | Hotel data and functions |
| 2 | TypeScript | `Hotel`, `Booking` interfaces |
| 3 | DOM + Tailwind | Search UI, cards, booking modal |
| 4 | `fetch` + FastAPI preview | `frontend/` + `backend/`, GET/POST API |
| **5 (today)** | ES modules + `localStorage` | Typed, modular frontend capstone |

**Today:** Refactor `frontend/app.js` into `frontend/src/` modules.  
**Backend:** Keep Day 4 `main.py` as-is (print-only bookings). Week 3 expands it.  
**Next week:** New **React + Vite** app inside the same `hotel-booking-app/` folder.

---

## Target architecture

```
hotel-booking-app/
├── README.md                 # You write this today
├── backend/                  # Day 4 — no changes required today
│   ├── main.py
│   ├── requirements.txt
│   └── .venv/
│
└── frontend/                 # Today — refactor into TypeScript modules
    ├── index.html
    ├── input.css
    ├── styles.css            # Tailwind output
    ├── package.json
    ├── tsconfig.json
    ├── src/
    │   ├── config.ts         # API base URL
    │   ├── types/
    │   │   └── hotel.ts
    │   ├── services/
    │   │   └── hotelService.ts   # fetch GET/POST (Day 4 API)
    │   ├── utils/
    │   │   ├── storage.ts
    │   │   ├── favorites.ts
    │   │   ├── searchHistory.ts
    │   │   ├── bookingDraft.ts
    │   │   └── hotel-utils.ts
    │   ├── ui/
    │   │   ├── renderHotels.ts
    │   │   └── bookingModal.ts
    │   └── main.ts           # Entry point
    └── dist/                 # Compiled JS (after tsc)
```

---

# Part 1 — TypeScript setup in `frontend/`

## Step 1: Install TypeScript

```bash
cd frontend
npm install -D typescript
npx tsc --init
```

## Step 2: Configure `tsconfig.json`

Replace key options so compiled files land in `dist/`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "moduleResolution": "bundler",
    "strict": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}
```

## Step 3: Update `package.json` scripts

Merge with your existing Tailwind scripts:

```json
{
  "scripts": {
    "dev:css": "npx @tailwindcss/cli -i ./input.css -o ./styles.css --watch",
    "build:css": "npx @tailwindcss/cli -i ./input.css -o ./styles.css",
    "build:ts": "tsc",
    "watch:ts": "tsc --watch",
    "build": "npm run build:css && npm run build:ts",
    "watch": "npm run dev:css & npm run watch:ts"
  }
}
```

## Step 4: Point `index.html` at compiled entry

Replace `<script src="app.js">` with:

```html
<script type="module" src="./dist/main.js"></script>
```

Keep your Day 3/4 HTML layout. Add loading/error elements if missing:

```html
<p id="loadingMessage" class="text-center text-gray-500 mb-4 hidden">Loading hotels...</p>
<p id="errorMessage" class="text-center text-red-600 mb-4 hidden"></p>
```

You can delete `app.js` after the refactor (or keep as reference).

**Checkpoint:** `npm run build` runs without errors (empty `src/` will fail until Step 5).

---

# Part 2 — Split code into modules

## Step 5: Types — `src/types/hotel.ts`

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

export interface BookingDraft {
  hotelId: number;
  guestName: string;
  email: string;
  checkIn: string;
  checkOut: string;
}
```

---

## Step 6: Config — `src/config.ts`

Same URL as Day 4:

```typescript
export const config = {
  apiBase: 'http://127.0.0.1:8000',
  appName: 'Hotel Booking',
} as const;
```

---

## Step 7: API service — `src/services/hotelService.ts`

Replaces inline `fetch` from Day 4 `app.js`. **No mock data** — calls your FastAPI backend:

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

## Step 8: Utilities — `src/utils/hotel-utils.ts`

Move client-side filter logic from Day 3:

```typescript
import type { Hotel } from '../types/hotel';

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function calculateNights(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export function filterHotels(
  hotels: Hotel[],
  options: { query?: string; location?: string; maxPrice?: number }
): Hotel[] {
  return hotels.filter((hotel) => {
    if (options.query) {
      const q = options.query.toLowerCase();
      if (
        !hotel.name.toLowerCase().includes(q) &&
        !hotel.location.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    if (options.location && hotel.location !== options.location) return false;
    if (options.maxPrice !== undefined && hotel.price > options.maxPrice) {
      return false;
    }
    return true;
  });
}
```

---

## Step 9: UI — `src/ui/renderHotels.ts`

Port `createHotelCard` and `displayHotels` from Day 3/4:

```typescript
import type { Hotel } from '../types/hotel';
import { formatCurrency } from '../utils/hotel-utils';
import { getFavorites, toggleFavorite } from '../utils/favorites';

export function createHotelCard(
  hotel: Hotel,
  onBook: (id: number) => void,
  onFavoriteToggle: () => void
): HTMLElement {
  const card = document.createElement('article');
  card.className =
    'bg-white rounded-lg shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in';

  const favorites = getFavorites();
  const isFavorite = favorites.includes(hotel.id);
  const availabilityClass = hotel.available ? 'text-green-600' : 'text-red-600';
  const availabilityText = hotel.available ? 'Available' : 'Booked';

  card.innerHTML = `
    <div class="flex justify-between items-start mb-2">
      <h3 class="text-xl font-bold text-hotel-primary">${hotel.name}</h3>
      <button type="button" data-favorite="${hotel.id}" class="text-2xl" title="Toggle favorite">
        ${isFavorite ? '⭐' : '☆'}
      </button>
    </div>
    <p class="text-gray-600 mb-2">📍 ${hotel.location}</p>
    <p class="text-2xl font-bold text-hotel-secondary mb-2">${formatCurrency(hotel.price)}/night</p>
    <p class="text-hotel-gold mb-3">⭐ ${hotel.rating} stars</p>
    <div class="flex flex-wrap gap-2 mb-3">
      ${hotel.amenities
        .map((a) => `<span class="bg-gray-100 px-2 py-1 rounded text-sm">${a}</span>`)
        .join('')}
    </div>
    <p class="${availabilityClass} mb-4">${availabilityText}</p>
    ${
      hotel.available
        ? `<button type="button" data-book-hotel="${hotel.id}"
            class="w-full bg-hotel-secondary text-white py-2 rounded hover:bg-hotel-primary">
            Book Now
          </button>`
        : ''
    }
  `;

  card.querySelector('[data-favorite]')?.addEventListener('click', () => {
    toggleFavorite(hotel.id);
    onFavoriteToggle();
  });

  card.querySelector('[data-book-hotel]')?.addEventListener('click', () => {
    onBook(hotel.id);
  });

  return card;
}

export function displayHotels(
  hotels: Hotel[],
  containerId: string,
  onBook: (id: number) => void,
  onFavoriteToggle: () => void
): void {
  const list = document.getElementById(containerId);
  if (!list) return;
  list.innerHTML = '';
  hotels.forEach((hotel) =>
    list.appendChild(createHotelCard(hotel, onBook, onFavoriteToggle))
  );
}
```

---

## Step 10: Entry point — `src/main.ts`

```typescript
import { fetchHotels } from './services/hotelService';
import type { Hotel } from './types/hotel';
import { filterHotels } from './utils/hotel-utils';
import { displayHotels } from './ui/renderHotels';
import { wireBookingModal } from './ui/bookingModal';
import { addSearchTerm, renderSearchHistory } from './utils/searchHistory';

let hotels: Hotel[] = [];

function applyFilters(): void {
  const query = (document.getElementById('searchInput') as HTMLInputElement).value;
  const location = (document.getElementById('locationFilter') as HTMLSelectElement).value;
  const maxPriceRaw = (document.getElementById('maxPrice') as HTMLInputElement).value;
  const maxPrice = maxPriceRaw ? Number(maxPriceRaw) : undefined;

  const filtered = filterHotels(hotels, { query, location, maxPrice });
  displayHotels(filtered, 'hotelList', openBooking, applyFilters);
}

function openBooking(hotelId: number): void {
  wireBookingModal.open(hotelId, hotels);
}

function wireSearch(): void {
  document.getElementById('searchInput')?.addEventListener('input', () => {
    const term = (document.getElementById('searchInput') as HTMLInputElement).value;
    if (term.trim()) addSearchTerm(term);
    renderSearchHistory('searchHistory');
    applyFilters();
  });
  document.getElementById('locationFilter')?.addEventListener('change', applyFilters);
  document.getElementById('maxPrice')?.addEventListener('input', applyFilters);
}

async function init(): Promise<void> {
  const loading = document.getElementById('loadingMessage');
  const errorEl = document.getElementById('errorMessage');

  loading?.classList.remove('hidden');
  errorEl?.classList.add('hidden');

  try {
    hotels = await fetchHotels();
    wireBookingModal.init();
    wireSearch();
    renderSearchHistory('searchHistory');
    applyFilters();
  } catch (error) {
    console.error(error);
    if (errorEl) {
      errorEl.textContent =
        'Could not load hotels. Start backend: cd backend && uvicorn main:app --reload';
      errorEl.classList.remove('hidden');
    }
  } finally {
    loading?.classList.add('hidden');
  }
}

init();
```

Add a history container in `index.html` under the search card:

```html
<ul id="searchHistory" class="max-w-4xl mx-auto text-sm text-gray-500 mb-4"></ul>
```

**Checkpoint:** `npm run build` → refresh browser → hotels load from API (backend running).

---

# Part 3 — localStorage 

## Step 11: Generic storage — `src/utils/storage.ts`

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
    return item ? (JSON.parse(item) as T) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
}

export function removeFromStorage(key: string): void {
  localStorage.removeItem(key);
}
```

## Step 12: Feature helpers

**`src/utils/favorites.ts`**

```typescript
import { loadFromStorage, saveToStorage } from './storage';

const KEY = 'hotel_favorites';

export function getFavorites(): number[] {
  return loadFromStorage<number[]>(KEY, []);
}

export function toggleFavorite(hotelId: number): number[] {
  const favorites = getFavorites();
  const updated = favorites.includes(hotelId)
    ? favorites.filter((id) => id !== hotelId)
    : [...favorites, hotelId];
  saveToStorage(KEY, updated);
  return updated;
}
```

**`src/utils/searchHistory.ts`**

```typescript
import { loadFromStorage, saveToStorage } from './storage';

const KEY = 'hotel_search_history';
const MAX = 5;

export function addSearchTerm(term: string): void {
  if (!term.trim()) return;
  const history = loadFromStorage<string[]>(KEY, []);
  const updated = [term, ...history.filter((t) => t !== term)].slice(0, MAX);
  saveToStorage(KEY, updated);
}

export function getSearchHistory(): string[] {
  return loadFromStorage<string[]>(KEY, []);
}

export function renderSearchHistory(elementId: string): void {
  const el = document.getElementById(elementId);
  if (!el) return;
  const history = getSearchHistory();
  el.innerHTML = history.length
    ? `<li>Recent: ${history.join(' · ')}</li>`
    : '';
}
```

**`src/utils/bookingDraft.ts`**

```typescript
import type { BookingDraft } from '../types/hotel';
import { loadFromStorage, removeFromStorage, saveToStorage } from './storage';

const KEY = 'booking_draft';

export function saveBookingDraft(draft: BookingDraft): void {
  saveToStorage(KEY, draft);
}

export function loadBookingDraft(): BookingDraft | null {
  return loadFromStorage<BookingDraft | null>(KEY, null);
}

export function clearBookingDraft(): void {
  removeFromStorage(KEY);
}
```

---

## Step 13: Booking modal module — `src/ui/bookingModal.ts`

Extract modal logic from Day 4; save draft on input; POST via `hotelService`:

```typescript
import { submitBooking } from '../services/hotelService';
import type { Hotel } from '../types/hotel';
import {
  clearBookingDraft,
  loadBookingDraft,
  saveBookingDraft,
} from '../utils/bookingDraft';
import { calculateNights } from '../utils/hotel-utils';

let selectedHotel: Hotel | null = null;

function calculateTotal(): void {
  const checkIn = (document.getElementById('checkIn') as HTMLInputElement).value;
  const checkOut = (document.getElementById('checkOut') as HTMLInputElement).value;
  if (!checkIn || !checkOut || !selectedHotel) return;

  const nights = calculateNights(checkIn, checkOut);
  if (nights > 0) {
    (document.getElementById('totalNights') as HTMLSpanElement).textContent = String(nights);
    (document.getElementById('totalPrice') as HTMLSpanElement).textContent =
      `$${nights * selectedHotel.price}`;
  }
}

function close(): void {
  document.getElementById('bookingModal')?.classList.add('hidden');
  selectedHotel = null;
  (document.getElementById('bookingForm') as HTMLFormElement)?.reset();
  (document.getElementById('totalNights') as HTMLSpanElement).textContent = '0';
  (document.getElementById('totalPrice') as HTMLSpanElement).textContent = '$0';
}

function persistDraft(): void {
  if (!selectedHotel) return;
  saveBookingDraft({
    hotelId: selectedHotel.id,
    guestName: (document.getElementById('guestName') as HTMLInputElement).value,
    email: (document.getElementById('email') as HTMLInputElement).value,
    checkIn: (document.getElementById('checkIn') as HTMLInputElement).value,
    checkOut: (document.getElementById('checkOut') as HTMLInputElement).value,
  });
}

function restoreDraft(hotelId: number): void {
  const draft = loadBookingDraft();
  if (!draft || draft.hotelId !== hotelId) return;
  (document.getElementById('guestName') as HTMLInputElement).value = draft.guestName;
  (document.getElementById('email') as HTMLInputElement).value = draft.email;
  (document.getElementById('checkIn') as HTMLInputElement).value = draft.checkIn;
  (document.getElementById('checkOut') as HTMLInputElement).value = draft.checkOut;
  calculateTotal();
}

export const wireBookingModal = {
  init(): void {
    document.getElementById('closeModal')?.addEventListener('click', close);
    document.getElementById('checkIn')?.addEventListener('change', calculateTotal);
    document.getElementById('checkOut')?.addEventListener('change', calculateTotal);

    ['guestName', 'email', 'checkIn', 'checkOut'].forEach((id) => {
      document.getElementById(id)?.addEventListener('input', persistDraft);
    });

    document.getElementById('bookingForm')?.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!selectedHotel) return;

      const booking = {
        guestName: (document.getElementById('guestName') as HTMLInputElement).value,
        email: (document.getElementById('email') as HTMLInputElement).value,
        hotelId: selectedHotel.id,
        hotelName: selectedHotel.name,
        checkIn: (document.getElementById('checkIn') as HTMLInputElement).value,
        checkOut: (document.getElementById('checkOut') as HTMLInputElement).value,
        total: (document.getElementById('totalPrice') as HTMLSpanElement).textContent,
      };

      try {
        const result = await submitBooking(booking);
        alert(result.message);
        clearBookingDraft();
        close();
      } catch (error) {
        console.error(error);
        alert('Could not submit booking. Is the backend running?');
      }
    });
  },

  open(hotelId: number, hotels: Hotel[]): void {
    selectedHotel = hotels.find((h) => h.id === hotelId) ?? null;
    document.getElementById('bookingModal')?.classList.remove('hidden');
    restoreDraft(hotelId);
  },
};
```

**Checkpoint:** Refresh mid-booking → draft restores. Submit → Python terminal prints booking.

---

# Part 4 — Project hygiene

## Step 14: Root `README.md`

Create `hotel-booking-app/README.md`:

```markdown
# Hotel Booking App — Week 1 Capstone

## Run backend
cd backend
source .venv/bin/activate
uvicorn main:app --reload

## Run frontend
cd frontend
npm install
npm run build
# Open frontend/index.html in browser
# Dev: npm run watch
```

## Step 15: `.gitignore`

**`frontend/.gitignore`**

```
node_modules/
dist/
styles.css
.DS_Store
```

**`backend/.gitignore`**

```
.venv/
__pycache__/
.DS_Store
```

---

# Week 1 capstone checklist

- [ ] `hotel-booking-app/frontend/src/` module structure
- [ ] `fetchHotels()` and `submitBooking()` call Day 4 API (`/api/hotels`, `/api/bookings`)
- [ ] Backend running — bookings `print()` in terminal
- [ ] Favorites toggle (⭐) persists after refresh
- [ ] Search history shown under search bar
- [ ] Booking draft restores after refresh
- [ ] Root `README.md` with run instructions

---

# Homework

1. **Clear all data** button — reset favorites, history, and draft
2. **Favorite filter** — show only favorited hotels
3. JSDoc on `filterHotels` and `calculateNights`
4. Read before Week 2: https://react.dev/learn/thinking-in-react

---

# Summary: Week 1 complete

| Layer | Location | Status |
|-------|----------|--------|
| UI | `frontend/` | Tailwind + DOM + TypeScript modules |
| API client | `frontend/src/services/hotelService.ts` | `fetch` to FastAPI |
| API server | `backend/main.py` | Demo only — Week 3 goes deeper |
| Persistence | `localStorage` | Favorites, history, drafts |

**Week 1 milestone:** `hotel-booking-app/` — full-stack folder layout, working frontend + preview backend.

**Next week (Day 6):** Add `hotel-booking-app/web/` — React + Vite + TypeScript. Port types and `hotelService` from `frontend/src/`. Same `backend/` URL.

---

# Appendix: `frontend/package.json` (reference)

```json
{
  "name": "hotel-booking-frontend",
  "private": true,
  "scripts": {
    "dev:css": "npx @tailwindcss/cli -i ./input.css -o ./styles.css --watch",
    "build:css": "npx @tailwindcss/cli -i ./input.css -o ./styles.css",
    "build:ts": "tsc",
    "watch:ts": "tsc --watch",
    "build": "npm run build:css && npm run build:ts",
    "watch": "npm run dev:css & npm run watch:ts"
  },
  "devDependencies": {
    "@tailwindcss/cli": "^4.1.11",
    "tailwindcss": "^4.1.11",
    "typescript": "^5.3.3"
  }
}
```

`input.css`, `index.html`, and `backend/main.py` are unchanged from Day 4 appendix.
