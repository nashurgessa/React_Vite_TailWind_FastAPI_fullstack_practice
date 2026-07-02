# Day 7: useState & Local State for Hotel Booking

## Objectives 

By the end of this 4-hour session, you should be able to:

- Use the `useState` hook for hotel data management
- Manage form state for booking forms
- Handle hotel search and filter state
- Understand lifting state up and prop drilling
- Implement conditional rendering based on state
- Manage loading and error states (without `useEffect` yet)
- Build state-driven hotel booking interfaces

---

## State Management for Hotel Booking

**React State** allows components to remember and respond to user interactions.

**Today's focus — local component state:**

- Hotel search queries and filters
- Selected hotel and room
- Booking form data
- Loading and error flags (set manually for now)

**Tomorrow (Day 8):** Global state with `useContext` and `localStorage` persistence.

---

## Activity 1: Understanding useState Hook

### useState for Hotel Data

**Hotel State Examples:**

```tsx
import { useState } from 'react';

function HotelSearch() {
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for filtered hotels
  const [filteredHotels, setFilteredHotels] = useState([]);
  
  // State for loading
  const [loading, setLoading] = useState(false);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setLoading(true);
    // Filter hotels logic
    setTimeout(() => {
      setFilteredHotels(/* filtered data */);
      setLoading(false);
    }, 500);
  };
  
  return (
    <div>
      <input 
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search hotels..."
      />
      {loading ? <p>Loading...</p> : <HotelList hotels={filteredHotels} />}
    </div>
  );
}
```

**Practice:** Create state for:

- Hotel price filter
- Location selection
- Rating filter
- Availability toggle

---

## Activity 2: Form State Management

### Managing Hotel Booking Form State

**Booking Form State Example:**

```tsx
function BookingForm() {
  // Form state
  const [formData, setFormData] = useState({
    guestName: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: '1',
    roomType: 'single',
    specialRequests: ''
  });
  
  // Form validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Submission state
  const [submitting, setSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
  
    if (!formData.guestName.trim()) {
      newErrors.guestName = 'Guest name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }
    if (!formData.checkIn) {
      newErrors.checkIn = 'Check-in date is required';
    }
    if (!formData.checkOut) {
      newErrors.checkOut = 'Check-out date is required';
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    setSubmitting(true);
  
    try {
      // Submit booking logic
      await submitBooking(formData);
      alert('Booking submitted successfully!');
      // Reset form
      setFormData({
        guestName: '',
        email: '',
        phone: '',
        checkIn: '',
        checkOut: '',
        guests: '1',
        roomType: 'single',
        specialRequests: ''
      });
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Guest Name</label>
        <input
          type="text"
          name="guestName"
          value={formData.guestName}
          onChange={handleChange}
          className={errors.guestName ? 'error' : ''}
        />
        {errors.guestName && <span className="error-message">{errors.guestName}</span>}
      </div>
    
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>
    
      <div className="form-group">
        <label>Check-in Date</label>
        <input
          type="date"
          name="checkIn"
          value={formData.checkIn}
          onChange={handleChange}
          className={errors.checkIn ? 'error' : ''}
        />
        {errors.checkIn && <span className="error-message">{errors.checkIn}</span>}
      </div>
    
      <div className="form-group">
        <label>Check-out Date</label>
        <input
          type="date"
          name="checkOut"
          value={formData.checkOut}
          onChange={handleChange}
          className={errors.checkOut ? 'error' : ''}
        />
        {errors.checkOut && <span className="error-message">{errors.checkOut}</span>}
      </div>
    
      <div className="form-group">
        <label>Number of Guests</label>
        <select
          name="guests"
          value={formData.guests}
          onChange={handleChange}
        >
          <option value="1">1 Guest</option>
          <option value="2">2 Guests</option>
          <option value="3">3 Guests</option>
          <option value="4">4 Guests</option>
        </select>
      </div>
    
      <div className="form-group">
        <label>Room Type</label>
        <select
          name="roomType"
          value={formData.roomType}
          onChange={handleChange}
        >
          <option value="single">Single - $100/night</option>
          <option value="double">Double - $150/night</option>
          <option value="suite">Suite - $250/night</option>
        </select>
      </div>
    
      <div className="form-group">
        <label>Special Requests</label>
        <textarea
          name="specialRequests"
          value={formData.specialRequests}
          onChange={handleChange}
          placeholder="Any special requests..."
        />
      </div>
    
      <button type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Confirm Booking'}
      </button>
    </form>
  );
}
```

**Practice:** Add form state for:

- Guest phone number
- Payment method selection
- Promo code input
- Terms acceptance checkbox

---

## Activity 3: Hotel Search & Filter State

### Managing Search and Filter State

Filter hotels in a handler when criteria change — no `useEffect` yet (that comes on Day 9).

```tsx
import { useState } from 'react';
import type { Hotel } from '../types/hotel';
import { mockHotels } from '../services/hotelService';

function HotelSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [maxPrice, setMaxPrice] = useState(500);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>(mockHotels);
  const [showFilters, setShowFilters] = useState(false);

  const applyFilters = () => {
    let result = [...mockHotels];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.location.toLowerCase().includes(q)
      );
    }
    if (onlyAvailable) {
      result = result.filter((h) => h.available);
    }
    result = result.filter((h) => h.price <= maxPrice);

    setFilteredHotels(result);
  };

  return (
    <div className="hotel-search">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search hotels..."
      />
      <button onClick={applyFilters}>Search</button>
      <button onClick={() => setShowFilters(!showFilters)}>
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>

      {showFilters && (
        <div className="filters">
          <label>
            Max Price: ${maxPrice}
            <input
              type="range"
              min="0"
              max="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
            />
            Only Available
          </label>
        </div>
      )}

      <p>Found {filteredHotels.length} hotels</p>
      <HotelList hotels={filteredHotels} />
    </div>
  );
}
```

**Practice:** Add filter state for min rating and location dropdown.

---

## Activity 4: Loading and Error States

### Managing Loading and Error Without useEffect

Load data when the user clicks a button — we'll automate this with `useEffect` on Day 9.

```tsx
import { useState } from 'react';
import { fetchHotels } from '../services/hotelService';
import type { Hotel } from '../types/hotel';

function HotelList() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHotels = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchHotels();
      setHotels(data);
    } catch {
      setError('Failed to load hotels. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Loading hotels...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={loadHotels}>Retry</button>
      </div>
    );
  }

  if (hotels.length === 0) {
    return (
      <div className="empty-state">
        <p>No hotels loaded yet.</p>
        <button onClick={loadHotels}>Load Hotels</button>
      </div>
    );
  }

  return (
    <div className="hotel-list">
      {hotels.map((hotel) => (
        <HotelCard key={hotel.id} hotel={hotel} />
      ))}
    </div>
  );
}
```

---

## Activity 5: Lifting State Up & Prop Drilling

### The Problem

When multiple components need the same state, you can lift state to their closest common parent and pass it down via props. This works — until you pass props through many layers (**prop drilling**).

**Example — selected hotel shared across components:**

```tsx
import { useState } from 'react';
import type { Hotel } from '../types/hotel';

function App() {
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  return (
    <div>
      <SearchPanel
        selectedHotel={selectedHotel}
        onSelectHotel={setSelectedHotel}
      />
      <BookingSummary selectedHotel={selectedHotel} />
    </div>
  );
}

function SearchPanel({
  selectedHotel,
  onSelectHotel,
}: {
  selectedHotel: Hotel | null;
  onSelectHotel: (hotel: Hotel) => void;
}) {
  return (
    <div>
      <HotelList onSelect={onSelectHotel} />
      <SelectionBreadcrumb hotel={selectedHotel} />
    </div>
  );
}

function HotelList({ onSelect }: { onSelect: (hotel: Hotel) => void }) {
  // Props passed down — works for 2–3 levels
  return (
    <div>
      {mockHotels.map((hotel) => (
        <button key={hotel.id} onClick={() => onSelect(hotel)}>
          {hotel.name}
        </button>
      ))}
    </div>
  );
}

function SelectionBreadcrumb({ hotel }: { hotel: Hotel | null }) {
  if (!hotel) return <p>No hotel selected</p>;
  return <p>Selected: {hotel.name}</p>;
}

function BookingSummary({ selectedHotel }: { selectedHotel: Hotel | null }) {
  if (!selectedHotel) return null;
  return (
    <div className="booking-summary">
      <h3>Booking Summary</h3>
      <p>{selectedHotel.name} — ${selectedHotel.price}/night</p>
    </div>
  );
}
```

### Prop drilling pain

Imagine: `App` → `Layout` → `Sidebar` → `UserMenu` → `BookingBadge` all need booking count. Passing props through every layer is tedious.

**Tomorrow (Day 8):** We solve this with `useContext` + `localStorage`.

**Practice:** Add `selectedRoom` state lifted to `App` and passed to `BookingSummary` and `RoomList`.

---

## Activity 6: Conditional Rendering with State

```tsx
function HotelCard({ hotel }: { hotel: { name: string; available: boolean; rating: number; price: number; amenities: string[] } }) {
  const [showDetails, setShowDetails] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="hotel-card">
      <h3>{hotel.name}</h3>
      <button onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? 'Hide Details' : 'Show Details'}
      </button>

      {showDetails && (
        <div className="hotel-details">
          <p>Rating: {hotel.rating} stars</p>
          <p>Price: ${hotel.price}/night</p>
          <p>Amenities: {hotel.amenities.join(', ')}</p>
        </div>
      )}

      {hotel.available ? (
        <button className="book-button">Book Now</button>
      ) : (
        <button disabled>Sold Out</button>
      )}

      <button onClick={() => setIsFavorite(!isFavorite)}>
        {isFavorite ? '❤️' : '🤍'}
      </button>
    </div>
  );
}
```

---

## Main Class Activity: State-Driven Hotel Search

**Task:** Build a searchable hotel list with local state

**Requirements:**

- Search and filter with `useState`
- Booking form with controlled inputs
- Load hotels on button click with loading/error states
- Lift `selectedHotel` to `App` — experience prop drilling
- Conditional rendering for empty, loading, and error states

**Steps:**

1. Implement `HotelSearch` with filter state
2. Build controlled `BookingForm`
3. Add load-on-click with loading/error UI
4. Lift selected hotel state to `App`
5. Pass props through 2–3 component levels
6. Note where prop drilling feels awkward (prepare for Day 8)

---

## Homework: Local State Practice

### Task 1: Enhanced Local State

- Add price range filter (min and max)
- Reset all filters button
- Show live count of matching hotels

### Task 2: Lifting State

- Lift favorites list to `App` (array of hotel IDs in `useState`)
- Pass to `HotelCard` and a `FavoritesPanel` — notice prop drilling

### Task 3: Preparation for Next Session

**Read before next class:**

- Passing Data Deeply with Context: https://react.dev/learn/passing-data-deeply-with-context
- useContext: https://react.dev/reference/react/useContext

---

## Summary: useState & Local State

**Key Takeaways:**

- **useState** manages component-local hotel data
- **Lifting state** shares data between sibling components via parent
- **Prop drilling** passes props through many layers — awkward at scale
- **Conditional rendering** responds to state changes
- **Loading/error** can be handled with state flags before `useEffect`

**Next Session:** `useContext`, `localStorage`, and `useLocalStorage` — global booking and auth state without prop drilling.