# Day 10: Forms, Validation & React Router

## Objectives

By the end of this 4-hour session, you should be able to:

- Build controlled booking forms with validation
- Create a multi-step booking wizard
- Set up React Router for multi-page hotel app
- Use route and query parameters
- Protect routes with `useAuth` from Day 8
- Complete the Week 2 React frontend milestone

---

## Week 2 Finale

Today you wire everything together:

| From  | Used today                                        |
| ----- | ------------------------------------------------- |
| Day 6 | Components, props                                 |
| Day 7 | `useState`, form state                          |
| Day 8 | `AuthContext`, `BookingContext`, localStorage |
| Day 9 | `useEffect`, `useHotels`, `useRef`          |

**Week 2 deliverable:** Multi-page React hotel app with search, booking, auth, and persisted cart — on mock data.

---

## Activity 1: Controlled Booking Form & Validation

```tsx
function BookingForm({ hotelId }: { hotelId: number }) {
  const { addBooking } = useBookings();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    guestName: '',
    email: '',
    checkIn: '',
    checkOut: '',
    guests: '1',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!formData.guestName.trim()) next.guestName = 'Name is required';
    if (!formData.email.includes('@')) next.email = 'Valid email required';
    if (!formData.checkIn) next.checkIn = 'Check-in required';
    if (!formData.checkOut) next.checkOut = 'Check-out required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    addBooking({
      hotelId,
      hotelName: 'Selected Hotel',
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      pricePerNight: 200,
    });
    navigate(`/confirmation/${hotelId}`);
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="guestName" value={formData.guestName} onChange={handleChange} />
      {errors.guestName && <span>{errors.guestName}</span>}
      {/* email, dates, guests... */}
      <button type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Confirm Booking'}
      </button>
    </form>
  );
}
```

---

## Activity 2: Multi-Step Booking Wizard

Use `useState` for current step (or `useReducer` as homework):

```tsx
const STEPS = ['dates', 'guest', 'review'] as const;
type Step = (typeof STEPS)[number];

function BookingWizard({ hotel }: { hotel: Hotel }) {
  const [step, setStep] = useState<Step>('dates');
  const [draft, setDraft] = useState({ checkIn: '', checkOut: '', guestName: '', email: '' });

  const next = () => setStep(STEPS[STEPS.indexOf(step) + 1]);
  const back = () => setStep(STEPS[STEPS.indexOf(step) - 1]);

  return (
    <div>
      <p>Step {STEPS.indexOf(step) + 1} of {STEPS.length}</p>
      {step === 'dates' && (
        <DateStep draft={draft} setDraft={setDraft} onNext={next} />
      )}
      {step === 'guest' && (
        <GuestStep draft={draft} setDraft={setDraft} onNext={next} onBack={back} />
      )}
      {step === 'review' && (
        <ReviewStep draft={draft} hotel={hotel} onBack={back} />
      )}
    </div>
  );
}
```

---

## Activity 3: React Router Setup

```bash
npm install react-router-dom
```

```tsx
// main.tsx
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthProvider>
      <BookingProvider>
        <App />
      </BookingProvider>
    </AuthProvider>
  </BrowserRouter>
);
```

```tsx
// App.tsx
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { HotelDetailPage } from './pages/HotelDetailPage';
import { BookingPage } from './pages/BookingPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navigation } from './components/Navigation';

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/hotel/:id" element={<HotelDetailPage />} />
        <Route path="/booking/:hotelId" element={<BookingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookingsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<p>Page not found</p>} />
      </Routes>
    </>
  );
}
```

---

## Activity 4: Route Parameters & useHotel

```tsx
import { useParams, Link } from 'react-router-dom';
import { useHotel } from '../hooks/useHotel';

function HotelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { hotel, loading } = useHotel(Number(id));

  if (loading) return <p>Loading...</p>;
  if (!hotel) return <p>Hotel not found</p>;

  return (
    <div>
      <h1>{hotel.name}</h1>
      <p>{hotel.location} — ${hotel.price}/night</p>
      <Link to={`/booking/${hotel.id}`}>
        <button>Book Now</button>
      </Link>
    </div>
  );
}
```

---

## Activity 5: Protected Routes with useAuth

Connect Day 8 `AuthContext` to routing:

```tsx
// src/components/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p>Loading...</p>;
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
```

**Redirect after login:**

```tsx
function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname ?? '/';

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  // ... login form
}
```

---

## Main Class Activity: Complete Week 2 App

**Task:** Multi-page hotel booking SPA

**Requirements:**

- Routes: `/`, `/hotel/:id`, `/booking/:hotelId`, `/my-bookings`, `/login`
- Controlled booking form with validation
- Multi-step wizard OR single form with review step
- `ProtectedRoute` on `/my-bookings`
- `Navigation` with `UserMenu` and `BookingBadge`
- `useHotels` on home page, `useHotel` on detail page
- Bookings persist via `BookingContext` + localStorage
- Navigate to confirmation after successful booking

**Steps:**

1. Install React Router and set up routes
2. Build pages using existing components and hooks
3. Add booking form with validation
4. Implement `ProtectedRoute` with `useAuth`
5. Wire navbar with auth and cart badge
6. End-to-end test: search → detail → book → my-bookings → refresh

---

## Homework: Polish Week 2 App

### Task 1: UX Improvements

- Breadcrumb navigation
- Query params for search: `/hotels?q=foshan`
- Form field focus with `useRef` on validation errors

### Task 2: Optional Advanced

- `useReducer` for multi-step wizard state
- Lazy-loaded route components
- `useMemo` for booking total price

### Task 3: Preparation for Next Session

**Read before next class:**

- FastAPI Documentation: https://fastapi.tiangolo.com/
- Python Tutorial: https://docs.python.org/3/tutorial/

---

## Summary: Week 2 Complete

**Key Takeaways:**

- **Controlled forms** keep React as the source of truth for booking data
- **Validation** improves data quality before submission
- **React Router** turns your app into a multi-page experience
- **Protected routes** use `useAuth` from context — no prop drilling
- **Week 2 milestone:** Full React SPA on mock data with global state and persistence

**Next Week:** FastAPI backend — the same API contract your React app will connect to in Week 4.