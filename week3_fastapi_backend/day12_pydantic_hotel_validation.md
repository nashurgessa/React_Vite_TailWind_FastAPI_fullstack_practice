# Day 12: Pydantic Models & Hotel Data Validation

## 🎯 Objectives (4 Hours)

By the end of this 4-hour session, you should be able to:

- Understand Pydantic for data validation
- Create Pydantic models for hotel entities
- Implement data validation rules
- Use Pydantic with FastAPI endpoints
- Handle validation errors gracefully
- Create nested models for complex hotel data
- Implement custom validators for hotel business rules

---

## 🏨 Why Pydantic for Hotel Booking?

**Pydantic** provides powerful data validation using Python type annotations, ensuring data integrity for hotel booking systems.

**Pydantic provides:**
- **Type Validation** - Automatic type checking for hotel data
- **Field Validation** - Custom validation rules for booking constraints
- **Nested Models** - Complex data structures for hotel relationships
- **Automatic Documentation** - Schema generation for API docs
- **Error Messages** - Clear validation error feedback

**Perfect for Hotel Booking Because:**
- Validates guest information format
- Ensures booking date validity
- Enforces business rules (capacity, pricing)
- Prevents invalid data from reaching database
- Provides clear error messages to users

---

## 🎯 Activity 1: Basic Pydantic Models (45 minutes)

### Creating Hotel Booking Models

**🏨 Hotel Pydantic Models:**

```python
# app/schemas/hotel.py
from pydantic import BaseModel, Field, validator
from typing import List, Optional
from datetime import date

class HotelBase(BaseModel):
    """Base hotel model with common fields"""
    name: str = Field(..., min_length=2, max_length=100, description="Hotel name")
    location: str = Field(..., min_length=2, max_length=100, description="Hotel location")
    rating: float = Field(..., ge=0, le=5, description="Hotel rating (0-5 stars)")
    price: int = Field(..., gt=0, description="Price per night")
    available: bool = Field(default=True, description="Availability status")
    amenities: List[str] = Field(default_factory=list, description="List of amenities")
    description: Optional[str] = Field(None, max_length=500, description="Hotel description")
    
    @validator('name')
    def name_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError('Hotel name cannot be empty')
        return v.strip()
    
    @validator('rating')
    def rating_must_be_valid(cls, v):
        if v < 0 or v > 5:
            raise ValueError('Rating must be between 0 and 5')
        return round(v, 1)

class HotelCreate(HotelBase):
    """Model for creating a new hotel"""
    pass

class HotelUpdate(BaseModel):
    """Model for updating an existing hotel"""
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    location: Optional[str] = Field(None, min_length=2, max_length=100)
    rating: Optional[float] = Field(None, ge=0, le=5)
    price: Optional[int] = Field(None, gt=0)
    available: Optional[bool] = None
    amenities: Optional[List[str]] = None
    description: Optional[str] = Field(None, max_length=500)

class Hotel(HotelBase):
    """Complete hotel model with ID"""
    id: int
    
    class Config:
        orm_mode = True

class HotelList(BaseModel):
    """Model for hotel list response"""
    hotels: List[Hotel]
    count: int
```

**🎯 Practice:** Create Pydantic models for:
- Room information
- Guest profile
- Booking details
- Review submission

---

## 🎯 Activity 2: Room Models (30 minutes)

### Room Data Models

**🏨 Room Pydantic Models:**

```python
# app/schemas/room.py
from pydantic import BaseModel, Field, validator
from typing import List, Optional
from enum import Enum

class RoomType(str, Enum):
    """Room type enumeration"""
    SINGLE = "single"
    DOUBLE = "double"
    SUITE = "suite"
    PENTHOUSE = "penthouse"

class RoomBase(BaseModel):
    """Base room model"""
    room_number: str = Field(..., min_length=1, max_length=10, description="Room number")
    hotel_id: int = Field(..., gt=0, description="Hotel ID")
    type: RoomType = Field(..., description="Room type")
    capacity: int = Field(..., gt=0, description="Maximum guests")
    price_per_night: int = Field(..., gt=0, description="Price per night")
    available: bool = Field(default=True, description="Availability status")
    amenities: List[str] = Field(default_factory=list, description="Room amenities")
    images: Optional[List[str]] = Field(None, description="Room image URLs")
    
    @validator('room_number')
    def room_number_format(cls, v):
        if not v.isdigit():
            raise ValueError('Room number must be numeric')
        return v
    
    @validator('capacity')
    def capacity_must_match_type(cls, v, values):
        room_type = values.get('type')
        if room_type == RoomType.SINGLE and v > 1:
            raise ValueError('Single room capacity cannot exceed 1')
        if room_type == RoomType.DOUBLE and v > 2:
            raise ValueError('Double room capacity cannot exceed 2')
        return v

class RoomCreate(RoomBase):
    """Model for creating a new room"""
    pass

class RoomUpdate(BaseModel):
    """Model for updating a room"""
    price_per_night: Optional[int] = Field(None, gt=0)
    available: Optional[bool] = None
    amenities: Optional[List[str]] = None

class Room(RoomBase):
    """Complete room model with ID"""
    id: int
    
    class Config:
        orm_mode = True
```

**🎯 Practice:** Add validation for:
- Room number uniqueness
- Price range validation
- Amenity list validation
- Image URL validation

---

## 🎯 Activity 3: Booking Models (45 minutes)

### Booking Data Models

**🏨 Booking Pydantic Models:**

```python
# app/schemas/booking.py
from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import date, datetime
from enum import Enum

class BookingStatus(str, Enum):
    """Booking status enumeration"""
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CHECKED_IN = "checked_in"
    CHECKED_OUT = "checked_out"
    CANCELLED = "cancelled"

class BookingBase(BaseModel):
    """Base booking model"""
    hotel_id: int = Field(..., gt=0, description="Hotel ID")
    room_number: str = Field(..., description="Room number")
    guest_name: str = Field(..., min_length=2, max_length=100, description="Guest name")
    guest_email: str = Field(..., description="Guest email")
    guest_phone: str = Field(..., description="Guest phone number")
    check_in: date = Field(..., description="Check-in date")
    check_out: date = Field(..., description="Check-out date")
    guests: int = Field(..., gt=0, description="Number of guests")
    special_requests: Optional[str] = Field(None, max_length=500, description="Special requests")
    
    @validator('guest_email')
    def email_must_be_valid(cls, v):
        if '@' not in v or '.' not in v:
            raise ValueError('Invalid email format')
        return v.lower()
    
    @validator('guest_phone')
    def phone_must_be_valid(cls, v):
        if not v.replace('+', '').replace('-', '').replace(' ', '').isdigit():
            raise ValueError('Phone number must contain only digits, +, -, and spaces')
        if len(v.replace('+', '').replace('-', '').replace(' ', '')) < 10:
            raise ValueError('Phone number must be at least 10 digits')
        return v
    
    @validator('check_out')
    def check_out_after_check_in(cls, v, values):
        check_in = values.get('check_in')
        if check_in and v <= check_in:
            raise ValueError('Check-out date must be after check-in date')
        return v
    
    @validator('check_in')
    def check_in_not_in_past(cls, v):
        if v < date.today():
            raise ValueError('Check-in date cannot be in the past')
        return v
    
    @validator('guests')
    def guests_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError('Number of guests must be positive')
        return v

class BookingCreate(BookingBase):
    """Model for creating a new booking"""
    pass

class BookingUpdate(BaseModel):
    """Model for updating a booking"""
    status: Optional[BookingStatus] = None
    special_requests: Optional[str] = Field(None, max_length=500)

class Booking(BookingBase):
    """Complete booking model with ID and status"""
    id: int
    booking_id: str
    status: BookingStatus
    created_at: datetime
    updated_at: Optional[datetime] = None
    total_price: int
    
    class Config:
        orm_mode = True

class BookingConfirmation(BaseModel):
    """Booking confirmation response"""
    booking_id: str
    hotel_name: str
    room_number: str
    guest_name: str
    check_in: date
    check_out: date
    total_price: int
    status: BookingStatus
```

**🎯 Practice:** Add validation for:
- Minimum stay duration
- Maximum stay duration
- Advance booking requirements
- Cancellation policy validation

---

## 🎯 Activity 4: Guest Models (30 minutes)

### Guest Data Models

**🏨 Guest Pydantic Models:**

```python
# app/schemas/guest.py
from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import date

class GuestBase(BaseModel):
    """Base guest model"""
    name: str = Field(..., min_length=2, max_length=100, description="Guest name")
    email: str = Field(..., description="Guest email")
    phone: str = Field(..., description="Guest phone number")
    address: Optional[str] = Field(None, max_length=200, description="Guest address")
    city: Optional[str] = Field(None, max_length=100, description="City")
    country: Optional[str] = Field(None, max_length=100, description="Country")
    postal_code: Optional[str] = Field(None, max_length=20, description="Postal code")
    preferences: Optional[List[str]] = Field(None, description="Guest preferences")
    loyalty_points: Optional[int] = Field(0, ge=0, description="Loyalty program points")
    
    @validator('email')
    def email_must_be_valid(cls, v):
        if '@' not in v or '.' not in v:
            raise ValueError('Invalid email format')
        return v.lower()
    
    @validator('phone')
    def phone_must_be_valid(cls, v):
        if not v.replace('+', '').replace('-', '').replace(' ', '').isdigit():
            raise ValueError('Invalid phone number format')
        return v

class GuestCreate(GuestBase):
    """Model for creating a new guest"""
    pass

class GuestUpdate(BaseModel):
    """Model for updating guest information"""
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = Field(None, max_length=200)
    preferences: Optional[List[str]] = None

class Guest(GuestBase):
    """Complete guest model with ID"""
    id: int
    created_at: date
    total_bookings: int = 0
    
    class Config:
        orm_mode = True
```

**🎯 Practice:** Add validation for:
- Email uniqueness
- Phone format by country
- Address completeness
- Loyalty points range

---

## 🎯 Activity 5: Using Pydantic with FastAPI (45 minutes)

### Integrating Pydantic Models with Endpoints

**🏨 FastAPI with Pydantic:**

```python
# app/main.py
from fastapi import FastAPI, HTTPException, status
from app.schemas.hotel import HotelCreate, HotelUpdate, Hotel, HotelList
from app.schemas.booking import BookingCreate, Booking
from typing import Optional

app = FastAPI(title="Hotel Booking API")

# In-memory database (replace with real database later)
hotels_db = []
bookings_db = []

# POST hotel with Pydantic validation
@app.post("/hotels", response_model=Hotel, status_code=status.HTTP_201_CREATED)
def create_hotel(hotel: HotelCreate):
    """Create a new hotel with automatic validation"""
    # Pydantic validates the input automatically
    new_id = len(hotels_db) + 1
    hotel_dict = hotel.dict()
    hotel_dict['id'] = new_id
    
    hotels_db.append(hotel_dict)
    return Hotel(**hotel_dict)

# PUT hotel with Pydantic validation
@app.put("/hotels/{hotel_id}", response_model=Hotel)
def update_hotel(hotel_id: int, hotel_update: HotelUpdate):
    """Update hotel with partial validation"""
    hotel = next((h for h in hotels_db if h["id"] == hotel_id), None)
    
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")
    
    # Update only provided fields
    update_data = hotel_update.dict(exclude_unset=True)
    hotel.update(update_data)
    
    return Hotel(**hotel)

# POST booking with complex validation
@app.post("/bookings", response_model=Booking, status_code=status.HTTP_201_CREATED)
def create_booking(booking: BookingCreate):
    """Create booking with automatic validation"""
    # Pydantic validates dates, email, phone, etc.
    booking_dict = booking.dict()
    booking_dict['id'] = len(bookings_db) + 1
    booking_dict['booking_id'] = f"BK-{len(bookings_db) + 1}"
    booking_dict['status'] = "pending"
    booking_dict['created_at'] = datetime.now()
    
    # Calculate total price (business logic)
    nights = (booking.check_out - booking.check_in).days
    booking_dict['total_price'] = nights * 200  # Simplified pricing
    
    bookings_db.append(booking_dict)
    return Booking(**booking_dict)

# GET with response model validation
@app.get("/hotels", response_model=HotelList)
def get_hotels(
    location: Optional[str] = None,
    min_rating: Optional[float] = None,
    available_only: bool = False
):
    """Get hotels with filtering"""
    filtered = hotels_db
    
    if location:
        filtered = [h for h in filtered if location.lower() in h["location"].lower()]
    
    if min_rating:
        filtered = [h for h in filtered if h["rating"] >= min_rating]
    
    if available_only:
        filtered = [h for h in filtered if h["available"]]
    
    return HotelList(hotels=[Hotel(**h) for h in filtered], count=len(filtered))
```

**🎯 Practice:** Integrate Pydantic models for:
- Room creation and updates
- Guest registration
- Review submission
- Search parameters

---

## 🎯 Activity 6: Custom Validators (30 minutes)

### Business Rule Validation

**🏨 Custom Validators for Hotel Rules:**

```python
from pydantic import BaseModel, validator
from typing import Optional

class HotelBookingRequest(BaseModel):
    hotel_id: int
    room_number: str
    guest_name: str
    guest_email: str
    check_in: date
    check_out: date
    guests: int
    promo_code: Optional[str] = None
    
    @validator('promo_code')
    def validate_promo_code(cls, v):
        if v:
            # Check if promo code exists and is valid
            valid_codes = ["SUMMER2024", "WELCOME10", "LOYALTY20"]
            if v.upper() not in valid_codes:
                raise ValueError('Invalid promo code')
            return v.upper()
        return v
    
    @validator('guests')
    def validate_guest_capacity(cls, v, values):
        # This would typically check against room capacity
        max_capacity = 4  # Would come from room data
        if v > max_capacity:
            raise ValueError(f'Cannot exceed maximum capacity of {max_capacity} guests')
        return v
    
    @validator('check_in', 'check_out')
    def validate_booking_dates(cls, v):
        # Check if dates are within booking window
        max_advance_days = 365
        if v > date.today() + timedelta(days=max_advance_days):
            raise ValueError(f'Cannot book more than {max_advance_days} days in advance')
        return v

class RoomAvailabilityCheck(BaseModel):
    hotel_id: int
    check_in: date
    check_out: date
    
    @validator('check_out')
    def validate_minimum_stay(cls, v, values):
        check_in = values.get('check_in')
        if check_in:
            min_stay_days = 1
            if (v - check_in).days < min_stay_days:
                raise ValueError(f'Minimum stay is {min_stay_days} night(s)')
        return v
```

**🎯 Practice:** Create custom validators for:
- Check-in time restrictions
- Maximum stay duration
- Group booking requirements
- Cancellation deadline validation

---

## 🎯 Main Class Activity: Complete Pydantic Validation System (60 minutes)

**Task:** Build complete Pydantic validation system for hotel booking

**Requirements:**
- Hotel models with validation
- Room models with type constraints
- Booking models with date validation
- Guest models with contact validation
- Custom business rule validators
- Integration with FastAPI endpoints
- Error handling and messages

**Steps:**
1. Create hotel Pydantic models
2. Build room validation models
3. Implement booking validation
4. Add guest data models
5. Create custom validators
6. Integrate with FastAPI
7. Test validation rules
8. Document validation requirements

---

## 🎯 Homework: Complete Pydantic Models

### Task 1: Enhanced Validation
- Add cross-field validation
- Implement async validators
- Create validation contexts
- Add custom error messages

### Task 2: Advanced Models
- Create nested models for complex data
- Implement model inheritance
- Add model composition
- Create model serialization

### Task 3: Preparation for Next Session
**Read before next class:**
- FastAPI CRUD: https://fastapi.tiangolo.com/tutorial/crud/
- Database Operations: https://fastapi.tiangolo.com/tutorial/sql-databases/

---

## 🎯 Summary: Pydantic for Hotel Booking

**Key Takeaways:**
- **Pydantic models** ensure data integrity
- **Field validators** enforce business rules
- **Type hints** provide automatic validation
- **Custom validators** handle complex logic
- **FastAPI integration** is seamless
- **Error messages** are clear and helpful

**Next Session:** We'll implement complete CRUD operations for hotel booking data.
