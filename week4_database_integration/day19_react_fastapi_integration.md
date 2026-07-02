# Day 19: React-FastAPI Integration

## Objectives (4 Hours)

By the end of this 4-hour session, you should be able to:

- Connect your Week 2 React app to the FastAPI backend
- Swap mock `hotelService` URLs for real API endpoints
- Send auth tokens from `AuthContext` / localStorage with requests
- Handle API responses and errors in existing hooks
- Configure and debug CORS
- Complete the end-to-end hotel booking flow

---

## Integration Focus (Not a Repeat of Week 2)

You already built on the frontend:

| Already done (Week 2) | Today you change |
|----------------------|------------------|
| `useHotels`, `useHotel` hooks | Point hooks at FastAPI instead of mock |
| `AuthContext` + localStorage token | Send `Authorization` header to API |
| `BookingContext` | POST bookings to `/bookings` |
| Axios client | Update `baseURL` to `http://localhost:8000` |

**Do not re-teach** `useState`, `useContext`, or `useEffect` — wire existing code to the backend.

---

## 🎯 Activity 1: Setting Up Axios API Client (30 minutes)

### Configuring API Client

**🏨 Axios Configuration:**

```bash
# Install Axios
npm install axios
```

```typescript
// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add authentication token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

**🎯 Practice:** Configure API client for:
- Development and production environments
- Request logging
- Response transformation
- Retry logic

---

## 🎯 Activity 2: Hotel API Service (45 minutes)

### Creating Hotel API Service

**🏨 Hotel API Service:**

```typescript
// src/services/hotelService.ts
import apiClient from './api';
import { Hotel, HotelFilters } from '../types/hotel';

export const hotelService = {
  // Get all hotels
  async getHotels(filters?: HotelFilters): Promise<Hotel[]> {
    const params = new URLSearchParams();
    
    if (filters?.location) params.append('location', filters.location);
    if (filters?.minRating) params.append('min_rating', filters.minRating.toString());
    if (filters?.maxPrice) params.append('max_price', filters.maxPrice.toString());
    if (filters?.availableOnly) params.append('available_only', 'true');
    
    const response = await apiClient.get(`/hotels/?${params}`);
    return response.data.hotels;
  },

  // Get hotel by ID
  async getHotelById(id: number): Promise<Hotel> {
    const response = await apiClient.get(`/hotels/${id}`);
    return response.data;
  },

  // Search hotels
  async searchHotels(query: string, filters?: HotelFilters): Promise<Hotel[]> {
    const params = new URLSearchParams({ q: query });
    
    if (filters?.minRating) params.append('min_rating', filters.minRating.toString());
    if (filters?.maxPrice) params.append('max_price', filters.maxPrice.toString());
    
    const response = await apiClient.get(`/hotels/search?${params}`);
    return response.data.results;
  },

  // Get search suggestions
  async getSearchSuggestions(query: string): Promise<string[]> {
    const response = await apiClient.get(`/hotels/search/suggestions?q=${query}`);
    return response.data.suggestions.map((s: any) => s.text);
  },

  // Create hotel (admin)
  async createHotel(hotel: Partial<Hotel>): Promise<Hotel> {
    const response = await apiClient.post('/hotels/', hotel);
    return response.data;
  },

  // Update hotel (admin)
  async updateHotel(id: number, hotel: Partial<Hotel>): Promise<Hotel> {
    const response = await apiClient.put(`/hotels/${id}`, hotel);
    return response.data;
  },

  // Delete hotel (admin)
  async deleteHotel(id: number): Promise<void> {
    await apiClient.delete(`/hotels/${id}`);
  }
};
```

**🎯 Practice:** Create API services for:
- Room management
- Booking operations
- Guest profiles
- Reviews

---

## 🎯 Activity 3: Booking API Service (45 minutes)

### Booking API Integration

**🏨 Booking API Service:**

```typescript
// src/services/bookingService.ts
import apiClient from './api';
import { Booking, BookingCreate } from '../types/booking';

export const bookingService = {
  // Get all bookings
  async getBookings(guestEmail?: string): Promise<Booking[]> {
    const params = guestEmail ? { guest_email: guestEmail } : {};
    const response = await apiClient.get('/bookings/', { params });
    return response.data;
  },

  // Get booking by ID
  async getBookingById(bookingId: string): Promise<Booking> {
    const response = await apiClient.get(`/bookings/${bookingId}`);
    return response.data;
  },

  // Create booking
  async createBooking(booking: BookingCreate): Promise<Booking> {
    const response = await apiClient.post('/bookings/', booking);
    return response.data;
  },

  // Update booking status
  async updateBookingStatus(bookingId: string, status: string): Promise<Booking> {
    const response = await apiClient.put(`/bookings/${bookingId}`, { status });
    return response.data;
  },

  // Cancel booking
  async cancelBooking(bookingId: string): Promise<void> {
    await apiClient.delete(`/bookings/${bookingId}`);
  },

  // Get booking statistics
  async getBookingStatistics(hotelId: number): Promise<any> {
    const response = await apiClient.get(`/bookings/statistics/${hotelId}`);
    return response.data;
  }
};
```

**🎯 Practice:** Extend booking service with:
- Booking modification
- Check-in/check-out
- Payment processing
- Booking history

---

## 🎯 Activity 4: React Hooks for API Integration (60 minutes)

### Custom Hooks for API Calls

**🏨 Custom API Hooks:**

```typescript
// src/hooks/useHotels.ts
import { useState, useEffect } from 'react';
import { hotelService } from '../services/hotelService';
import { Hotel, HotelFilters } from '../types/hotel';

export function useHotels(filters?: HotelFilters) {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHotels() {
      try {
        setLoading(true);
        const data = await hotelService.getHotels(filters);
        setHotels(data);
        setError(null);
      } catch (err) {
        setError('Failed to load hotels');
        console.error('Error fetching hotels:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchHotels();
  }, [JSON.stringify(filters)]);

  return { hotels, loading, error, refetch: () => fetchHotels() };
}

export function useHotel(id: number) {
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHotel() {
      try {
        setLoading(true);
        const data = await hotelService.getHotelById(id);
        setHotel(data);
        setError(null);
      } catch (err) {
        setError('Failed to load hotel');
        console.error('Error fetching hotel:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchHotel();
  }, [id]);

  return { hotel, loading, error };
}
```

```typescript
// src/hooks/useBookings.ts
import { useState, useEffect } from 'react';
import { bookingService } from '../services/bookingService';
import { Booking, BookingCreate } from '../types/booking';

export function useBookings(guestEmail?: string) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoading(true);
        const data = await bookingService.getBookings(guestEmail);
        setBookings(data);
        setError(null);
      } catch (err) {
        setError('Failed to load bookings');
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [guestEmail]);

  return { bookings, loading, error };
}

export function useBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBooking = async (booking: BookingCreate): Promise<Booking | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await bookingService.createBooking(booking);
      return result;
    } catch (err) {
      setError('Failed to create booking');
      console.error('Error creating booking:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await bookingService.cancelBooking(bookingId);
      return true;
    } catch (err) {
      setError('Failed to cancel booking');
      console.error('Error cancelling booking:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createBooking, cancelBooking, loading, error };
}
```

**🎯 Practice:** Create hooks for:
- Room availability
- Guest authentication
- Search functionality
- Form submission

---

## 🎯 Activity 5: Hotel List Component with API (30 minutes)

### Integrating API with Components

**🏨 Hotel List with API:**

```typescript
// src/components/HotelList.tsx
import { useHotels } from '../hooks/useHotels';
import { HotelCard } from './HotelCard';
import { HotelFilters } from '../types/hotel';

interface HotelListProps {
  filters?: HotelFilters;
}

export function HotelList({ filters }: HotelListProps) {
  const { hotels, loading, error } = useHotels(filters);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading hotels...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (hotels.length === 0) {
    return (
      <div className="empty-state">
        <p>No hotels found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="hotel-list">
      <h2>Available Hotels ({hotels.length})</h2>
      <div className="hotels-grid">
        {hotels.map(hotel => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
      </div>
    </div>
  );
}
```

**🎯 Practice:** Integrate API with:
- Hotel detail page
- Booking form
- Room selection
- Search results

---

## 🎯 Activity 6: Booking Form with API Integration (60 minutes)

### Complete Booking Flow

**🏨 Booking Form Integration:**

```typescript
// src/components/BookingForm.tsx
import { useState } from 'react';
import { useBooking } from '../hooks/useBooking';
import { BookingCreate } from '../types/booking';

interface BookingFormProps {
  hotelId: number;
  roomNumber: string;
  pricePerNight: number;
  onSuccess: (bookingId: string) => void;
}

export function BookingForm({ hotelId, roomNumber, pricePerNight, onSuccess }: BookingFormProps) {
  const { createBooking, loading, error } = useBooking();
  const [formData, setFormData] = useState<BookingCreate>({
    hotel_id: hotelId,
    room_number: roomNumber,
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    check_in: '',
    check_out: '',
    guests: 1,
    special_requests: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.guest_name.trim()) {
      newErrors.guest_name = 'Guest name is required';
    }
    
    if (!formData.guest_email.trim()) {
      newErrors.guest_email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.guest_email)) {
      newErrors.guest_email = 'Invalid email format';
    }
    
    if (!formData.check_in) {
      newErrors.check_in = 'Check-in date is required';
    }
    
    if (!formData.check_out) {
      newErrors.check_out = 'Check-out date is required';
    }
    
    if (formData.check_in && formData.check_out) {
      const checkInDate = new Date(formData.check_in);
      const checkOutDate = new Date(formData.check_out);
      
      if (checkOutDate <= checkInDate) {
        newErrors.check_out = 'Check-out must be after check-in';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const booking = await createBooking(formData);
    
    if (booking) {
      onSuccess(booking.booking_id);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      <h2>Book Your Stay</h2>
      
      <div className="form-group">
        <label>Guest Name *</label>
        <input
          type="text"
          name="guest_name"
          value={formData.guest_name}
          onChange={handleChange}
          className={errors.guest_name ? 'error' : ''}
        />
        {errors.guest_name && <span className="error-message">{errors.guest_name}</span>}
      </div>
      
      <div className="form-group">
        <label>Email *</label>
        <input
          type="email"
          name="guest_email"
          value={formData.guest_email}
          onChange={handleChange}
          className={errors.guest_email ? 'error' : ''}
        />
        {errors.guest_email && <span className="error-message">{errors.guest_email}</span>}
      </div>
      
      <div className="form-group">
        <label>Phone *</label>
        <input
          type="tel"
          name="guest_phone"
          value={formData.guest_phone}
          onChange={handleChange}
          className={errors.guest_phone ? 'error' : ''}
        />
        {errors.guest_phone && <span className="error-message">{errors.guest_phone}</span>}
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>Check-in *</label>
          <input
            type="date"
            name="check_in"
            value={formData.check_in}
            onChange={handleChange}
            className={errors.check_in ? 'error' : ''}
          />
          {errors.check_in && <span className="error-message">{errors.check_in}</span>}
        </div>
        
        <div className="form-group">
          <label>Check-out *</label>
          <input
            type="date"
            name="check_out"
            value={formData.check_out}
            onChange={handleChange}
            className={errors.check_out ? 'error' : ''}
          />
          {errors.check_out && <span className="error-message">{errors.check_out}</span>}
        </div>
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
        <label>Special Requests</label>
        <textarea
          name="special_requests"
          value={formData.special_requests}
          onChange={handleChange}
          rows={4}
          placeholder="Any special requests or preferences..."
        />
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Confirm Booking'}
      </button>
    </form>
  );
}
```

**🎯 Practice:** Integrate API with:
- Guest registration
- Room availability check
- Price calculation
- Booking confirmation

---

## 🎯 Main Class Activity: Complete Frontend-Backend Integration (60 minutes)

**Task:** Integrate React frontend with FastAPI backend

**Requirements:**
- Axios API client configuration
- Hotel API service
- Booking API service
- Custom React hooks
- Component integration
- Error handling
- Loading states

**Steps:**
1. Configure Axios API client
2. Create hotel API service
3. Build booking API service
4. Implement custom hooks
5. Integrate with components
6. Add error handling
7. Test complete flow
8. Handle edge cases

---

## 🎯 Homework: Complete Integration

### Task 1: Enhanced Integration
- Add authentication
- Implement refresh tokens
- Add request caching
- Create offline support

### Task 2: Error Handling
- Add retry logic
- Implement error boundaries
- Create error logging
- Add user feedback

### Task 3: Preparation for Next Session
**Read before next class:**
- Deployment: https://fastapi.tiangolo.com/deployment/
- Vercel/Netlify: https://vercel.com/docs

---

## 🎯 Summary: React-FastAPI Integration

**Key Takeaways:**
- **Axios** handles HTTP requests to FastAPI
- **API services** organize backend communication
- **Custom hooks** encapsulate API logic
- **Error handling** provides user feedback
- **Loading states** improve UX
- **CORS** enables cross-origin requests

**Next Session:** We'll deploy the complete hotel booking system to production.
