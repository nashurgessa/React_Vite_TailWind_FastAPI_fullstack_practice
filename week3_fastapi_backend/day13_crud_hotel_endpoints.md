# Day 13: Hotel CRUD Operations & Endpoints

## Objectives (4 Hours)

By the end of this 4-hour session, you should be able to:

- Understand CRUD operations for hotel booking
- Implement Create, Read, Update, Delete endpoints
- Use Pydantic models for data validation
- Handle HTTP status codes appropriately
- Implement error handling for CRUD operations
- Build RESTful API for hotel management
- Test CRUD operations with API documentation

---

## Temporary In-Memory Storage

Day 13 uses an **in-memory database** (Python lists/dicts). This is intentional — it lets you focus on REST patterns without MySQL.

**Week 4 (Days 17–18):** Replace in-memory storage with SQLAlchemy + MySQL. The endpoint URLs and JSON shapes stay the same so your React app needs minimal changes.

---

## 🎯 Activity 1: Hotel CRUD Operations (60 minutes)

### Implementing Hotel CRUD Endpoints

**🏨 Hotel CRUD API:**

```python
# app/routers/hotels.py
from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from app.schemas.hotel import HotelCreate, HotelUpdate, Hotel, HotelList

router = APIRouter(prefix="/hotels", tags=["hotels"])

# In-memory database (replace with real database)
hotels_db = []

# CREATE - Add new hotel
@router.post("/", response_model=Hotel, status_code=status.HTTP_201_CREATED)
def create_hotel(hotel: HotelCreate):
    """Create a new hotel"""
    # Check if hotel with same name exists
    existing = next((h for h in hotels_db if h["name"] == hotel.name), None)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Hotel with this name already exists"
        )
    
    new_id = len(hotels_db) + 1
    hotel_dict = hotel.dict()
    hotel_dict['id'] = new_id
    
    hotels_db.append(hotel_dict)
    return Hotel(**hotel_dict)

# READ - Get all hotels
@router.get("/", response_model=HotelList)
def get_hotels(
    location: Optional[str] = None,
    min_rating: Optional[float] = None,
    max_price: Optional[int] = None,
    available_only: bool = False
):
    """Get all hotels with optional filtering"""
    filtered = hotels_db
    
    if location:
        filtered = [h for h in filtered if location.lower() in h["location"].lower()]
    
    if min_rating:
        filtered = [h for h in filtered if h["rating"] >= min_rating]
    
    if max_price:
        filtered = [h for h in filtered if h["price"] <= max_price]
    
    if available_only:
        filtered = [h for h in filtered if h["available"]]
    
    return HotelList(hotels=[Hotel(**h) for h in filtered], count=len(filtered))

# READ - Get single hotel by ID
@router.get("/{hotel_id}", response_model=Hotel)
def get_hotel(hotel_id: int):
    """Get a specific hotel by ID"""
    hotel = next((h for h in hotels_db if h["id"] == hotel_id), None)
    
    if not hotel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hotel not found"
        )
    
    return Hotel(**hotel)

# UPDATE - Update hotel
@router.put("/{hotel_id}", response_model=Hotel)
def update_hotel(hotel_id: int, hotel_update: HotelUpdate):
    """Update hotel information"""
    hotel = next((h for h in hotels_db if h["id"] == hotel_id), None)
    
    if not hotel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hotel not found"
        )
    
    # Update only provided fields
    update_data = hotel_update.dict(exclude_unset=True)
    hotel.update(update_data)
    
    return Hotel(**hotel)

# DELETE - Remove hotel
@router.delete("/{hotel_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_hotel(hotel_id: int):
    """Delete a hotel"""
    hotel = next((h for h in hotels_db if h["id"] == hotel_id), None)
    
    if not hotel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hotel not found"
        )
    
    hotels_db.remove(hotel)
    return None
```

**🎯 Practice:** Implement CRUD for:
- Room management
- Guest profiles
- Booking operations
- Review management

---

## 🎯 Activity 2: Room CRUD Operations (45 minutes)

### Building Room Management API

**🏨 Room CRUD Endpoints:**

```python
# app/routers/rooms.py
from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from app.schemas.room import RoomCreate, RoomUpdate, Room

router = APIRouter(prefix="/rooms", tags=["rooms"])

rooms_db = []

# CREATE - Add new room
@router.post("/", response_model=Room, status_code=status.HTTP_201_CREATED)
def create_room(room: RoomCreate):
    """Create a new room"""
    # Check if room number exists for this hotel
    existing = next(
        (r for r in rooms_db if r["room_number"] == room.room_number and r["hotel_id"] == room.hotel_id),
        None
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Room number already exists for this hotel"
        )
    
    new_id = len(rooms_db) + 1
    room_dict = room.dict()
    room_dict['id'] = new_id
    
    rooms_db.append(room_dict)
    return Room(**room_dict)

# READ - Get all rooms
@router.get("/", response_model=List[Room])
def get_rooms(hotel_id: Optional[int] = None, available_only: bool = False):
    """Get all rooms, optionally filtered"""
    filtered = rooms_db
    
    if hotel_id:
        filtered = [r for r in filtered if r["hotel_id"] == hotel_id]
    
    if available_only:
        filtered = [r for r in filtered if r["available"]]
    
    return [Room(**r) for r in filtered]

# READ - Get single room
@router.get("/{room_id}", response_model=Room)
def get_room(room_id: int):
    """Get a specific room by ID"""
    room = next((r for r in rooms_db if r["id"] == room_id), None)
    
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Room not found"
        )
    
    return Room(**room)

# UPDATE - Update room
@router.put("/{room_id}", response_model=Room)
def update_room(room_id: int, room_update: RoomUpdate):
    """Update room information"""
    room = next((r for r in rooms_db if r["id"] == room_id), None)
    
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Room not found"
        )
    
    update_data = room_update.dict(exclude_unset=True)
    room.update(update_data)
    
    return Room(**room)

# DELETE - Remove room
@router.delete("/{room_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_room(room_id: int):
    """Delete a room"""
    room = next((r for r in rooms_db if r["id"] == room_id), None)
    
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Room not found"
        )
    
    rooms_db.remove(room)
    return None

# PATCH - Update room availability
@router.patch("/{room_id}/availability")
def update_room_availability(room_id: int, available: bool):
    """Update room availability status"""
    room = next((r for r in rooms_db if r["id"] == room_id), None)
    
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Room not found"
        )
    
    room["available"] = available
    return {"message": "Room availability updated", "available": available}
```

**🎯 Practice:** Add room operations for:
- Bulk room creation
- Room availability by date range
- Room price updates
- Room amenity management

---

## 🎯 Activity 3: Booking CRUD Operations (60 minutes)

### Building Booking Management API

**🏨 Booking CRUD Endpoints:**

```python
# app/routers/bookings.py
from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from datetime import date
from app.schemas.booking import BookingCreate, BookingUpdate, Booking, BookingStatus

router = APIRouter(prefix="/bookings", tags=["bookings"])

bookings_db = []

# CREATE - Create new booking
@router.post("/", response_model=Booking, status_code=status.HTTP_201_CREATED)
def create_booking(booking: BookingCreate):
    """Create a new booking"""
    # Check if room is available
    room = next((r for r in rooms_db if r["room_number"] == booking.room_number), None)
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Room not found"
        )
    
    if not room["available"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Room is not available"
        )
    
    # Check for booking conflicts (simplified)
    conflicting = next(
        (b for b in bookings_db 
         if b["room_number"] == booking.room_number
         and b["status"] != BookingStatus.CANCELLED
         and not (booking.check_out <= b["check_in"] or booking.check_in >= b["check_out"])),
        None
    )
    
    if conflicting:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Room is already booked for these dates"
        )
    
    new_id = len(bookings_db) + 1
    booking_dict = booking.dict()
    booking_dict['id'] = new_id
    booking_dict['booking_id'] = f"BK-{new_id:06d}"
    booking_dict['status'] = BookingStatus.PENDING
    booking_dict['created_at'] = datetime.now()
    
    # Calculate total price
    nights = (booking.check_out - booking.check_in).days
    booking_dict['total_price'] = nights * room["price_per_night"]
    
    bookings_db.append(booking_dict)
    return Booking(**booking_dict)

# READ - Get all bookings
@router.get("/", response_model=List[Booking])
def get_bookings(
    guest_email: Optional[str] = None,
    hotel_id: Optional[int] = None,
    status: Optional[BookingStatus] = None
):
    """Get all bookings with optional filtering"""
    filtered = bookings_db
    
    if guest_email:
        filtered = [b for b in filtered if b["guest_email"] == guest_email]
    
    if hotel_id:
        filtered = [b for b in filtered if b["hotel_id"] == hotel_id]
    
    if status:
        filtered = [b for b in filtered if b["status"] == status]
    
    return [Booking(**b) for b in filtered]

# READ - Get single booking
@router.get("/{booking_id}", response_model=Booking)
def get_booking(booking_id: str):
    """Get a specific booking by booking ID"""
    booking = next((b for b in bookings_db if b["booking_id"] == booking_id), None)
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    return Booking(**booking)

# UPDATE - Update booking
@router.put("/{booking_id}", response_model=Booking)
def update_booking(booking_id: str, booking_update: BookingUpdate):
    """Update booking information"""
    booking = next((b for b in bookings_db if b["booking_id"] == booking_id), None)
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Validate status transitions
    if booking_update.status:
        current_status = booking["status"]
        new_status = booking_update.status
        
        # Define valid status transitions
        valid_transitions = {
            BookingStatus.PENDING: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
            BookingStatus.CONFIRMED: [BookingStatus.CHECKED_IN, BookingStatus.CANCELLED],
            BookingStatus.CHECKED_IN: [BookingStatus.CHECKED_OUT],
            BookingStatus.CHECKED_OUT: [],
            BookingStatus.CANCELLED: []
        }
        
        if new_status not in valid_transitions.get(current_status, []):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot transition from {current_status} to {new_status}"
            )
    
    update_data = booking_update.dict(exclude_unset=True)
    booking.update(update_data)
    booking['updated_at'] = datetime.now()
    
    return Booking(**booking)

# DELETE - Cancel booking (soft delete)
@router.delete("/{booking_id}")
def cancel_booking(booking_id: str):
    """Cancel a booking"""
    booking = next((b for b in bookings_db if b["booking_id"] == booking_id), None)
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    if booking["status"] in [BookingStatus.CHECKED_IN, BookingStatus.CHECKED_OUT]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot cancel checked-in or completed bookings"
        )
    
    booking["status"] = BookingStatus.CANCELLED
    booking["updated_at"] = datetime.now()
    
    return {"message": "Booking cancelled successfully"}
```

**🎯 Practice:** Add booking operations for:
- Booking confirmation
- Check-in/check-out
- Booking modification
- Booking history

---

## 🎯 Activity 4: Guest CRUD Operations (30 minutes)

### Guest Management API

**🏨 Guest CRUD Endpoints:**

```python
# app/routers/guests.py
from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from app.schemas.guest import GuestCreate, GuestUpdate, Guest

router = APIRouter(prefix="/guests", tags=["guests"])

guests_db = []

# CREATE - Register new guest
@router.post("/", response_model=Guest, status_code=status.HTTP_201_CREATED)
def create_guest(guest: GuestCreate):
    """Register a new guest"""
    # Check if email already exists
    existing = next((g for g in guests_db if g["email"] == guest.email), None)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Guest with this email already exists"
        )
    
    new_id = len(guests_db) + 1
    guest_dict = guest.dict()
    guest_dict['id'] = new_id
    guest_dict['created_at'] = date.today()
    guest_dict['total_bookings'] = 0
    
    guests_db.append(guest_dict)
    return Guest(**guest_dict)

# READ - Get all guests
@router.get("/", response_model=List[Guest])
def get_guests(search: Optional[str] = None):
    """Get all guests with optional search"""
    filtered = guests_db
    
    if search:
        filtered = [
            g for g in filtered 
            if search.lower() in g["name"].lower() or search.lower() in g["email"].lower()
        ]
    
    return [Guest(**g) for g in filtered]

# READ - Get single guest
@router.get("/{guest_id}", response_model=Guest)
def get_guest(guest_id: int):
    """Get a specific guest by ID"""
    guest = next((g for g in guests_db if g["id"] == guest_id), None)
    
    if not guest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Guest not found"
        )
    
    return Guest(**guest)

# UPDATE - Update guest information
@router.put("/{guest_id}", response_model=Guest)
def update_guest(guest_id: int, guest_update: GuestUpdate):
    """Update guest information"""
    guest = next((g for g in guests_db if g["id"] == guest_id), None)
    
    if not guest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Guest not found"
        )
    
    update_data = guest_update.dict(exclude_unset=True)
    guest.update(update_data)
    
    return Guest(**guest)

# DELETE - Remove guest
@router.delete("/{guest_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_guest(guest_id: int):
    """Delete a guest"""
    guest = next((g for g in guests_db if g["id"] == guest_id), None)
    
    if not guest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Guest not found"
        )
    
    # Check if guest has active bookings
    active_bookings = [
        b for b in bookings_db 
        if b["guest_email"] == guest["email"] and b["status"] != BookingStatus.CANCELLED
    ]
    
    if active_bookings:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete guest with active bookings"
        )
    
    guests_db.remove(guest)
    return None
```

**🎯 Practice:** Add guest operations for:
- Guest authentication
- Loyalty points management
- Guest preferences
- Booking history

---

## 🎯 Activity 5: Integrating Routers (15 minutes)

### Setting Up Main Application

**🏨 Main App with Routers:**

```python
# app/main.py
from fastapi import FastAPI
from app.routers import hotels, rooms, bookings, guests

app = FastAPI(title="Hotel Booking API")

# Include routers
app.include_router(hotels.router)
app.include_router(rooms.router)
app.include_router(bookings.router)
app.include_router(guests.router)

@app.get("/")
def read_root():
    return {
        "message": "Hotel Booking API",
        "version": "1.0.0",
        "endpoints": {
            "hotels": "/hotels",
            "rooms": "/rooms",
            "bookings": "/bookings",
            "guests": "/guests"
        }
    }
```

---

## 🎯 Main Class Activity: Complete CRUD API (60 minutes)

**Task:** Build complete CRUD API for hotel booking

**Requirements:**
- Hotel CRUD operations
- Room CRUD operations
- Booking CRUD operations
- Guest CRUD operations
- Proper error handling
- Status code usage
- Integration with main app
- API documentation

**Steps:**
1. Create hotel router with CRUD
2. Build room router with CRUD
3. Implement booking router with CRUD
4. Add guest router with CRUD
5. Integrate all routers
6. Add error handling
7. Test with Swagger UI
8. Document all operations

---

## 🎯 Homework: Complete CRUD Operations

### Task 1: Enhanced CRUD Features
- Add bulk operations
- Implement soft deletes
- Add audit logging
- Create data export endpoints

### Task 2: Advanced Error Handling
- Custom exception handlers
- Error response models
- Logging middleware
- Rate limiting

### Task 3: Preparation for Next Session
**Read before next class:**
- FastAPI Advanced: https://fastapi.tiangolo.com/tutorial/advanced/
- API Testing: https://fastapi.tiangolo.com/tutorial/testing/

---

## 🎯 Summary: CRUD Operations for Hotel Booking

**Key Takeaways:**
- **CRUD operations** manage hotel booking data
- **HTTP methods** map to CRUD operations
- **Status codes** indicate operation results
- **Error handling** provides clear feedback
- **Pydantic models** ensure data validity
- **Router organization** improves API structure

**Next Session:** We'll add advanced API features like search, filtering, and pagination.
