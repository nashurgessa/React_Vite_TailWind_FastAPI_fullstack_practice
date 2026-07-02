# Day 18: Database Operations & Hotel Data Persistence

## 🎯 Objectives (4 Hours)

By the end of this 4-hour session, you should be able to:

- Implement complete CRUD operations with SQLAlchemy
- Use database sessions for transaction management
- Handle complex queries with joins
- Implement data validation at database level
- Use relationships for data retrieval
- Handle errors and rollbacks
- Optimize database queries

---

## 🏨 Database Operations for Hotel Booking

**Database operations** enable persistent storage and retrieval of hotel booking data through SQLAlchemy ORM.

**Key Operations:**
- **Create**: Insert new hotels, rooms, bookings
- **Read**: Query and retrieve hotel data
- **Update**: Modify existing hotel records
- **Delete**: Remove hotel data with cascading
- **Transaction**: Ensure data consistency
- **Query**: Complex data retrieval with joins

---

## 🎯 Activity 1: Hotel CRUD Operations (60 minutes)

### Implementing Hotel CRUD with Database

**🏨 Hotel CRUD with Database:**

```python
# app/crud/hotel.py
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from app.models.hotel import Hotel
from app.schemas.hotel import HotelCreate, HotelUpdate
from typing import List, Optional

def get_hotel(db: Session, hotel_id: int):
    """Get hotel by ID"""
    return db.query(Hotel).filter(Hotel.id == hotel_id).first()

def get_hotels(db: Session, skip: int = 0, limit: int = 100):
    """Get all hotels with pagination"""
    return db.query(Hotel).offset(skip).limit(limit).all()

def get_hotel_by_booking_id(db: Session, booking_id: str):
    """Get hotel by booking ID"""
    from app.models.hotel import Booking
    booking = db.query(Booking).filter(Booking.booking_id == booking_id).first()
    if booking:
        return booking.hotel
    return None

def search_hotels(
    db: Session,
    query: Optional[str] = None,
    location: Optional[str] = None,
    min_rating: Optional[float] = None,
    max_rating: Optional[float] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    available_only: bool = False
):
    """Search hotels with multiple filters"""
    query_obj = db.query(Hotel)
    
    if query:
        query_obj = query_obj.filter(
            or_(
                Hotel.name.ilike(f"%{query}%"),
                Hotel.location.ilike(f"%{query}%"),
                Hotel.description.ilike(f"%{query}%")
            )
        )
    
    if location:
        query_obj = query_obj.filter(Hotel.location.ilike(f"%{location}%"))
    
    if min_rating:
        query_obj = query_obj.filter(Hotel.rating >= min_rating)
    
    if max_rating:
        query_obj = query_obj.filter(Hotel.rating <= max_rating)
    
    if min_price:
        query_obj = query_obj.filter(Hotel.price >= min_price)
    
    if max_price:
        query_obj = query_obj.filter(Hotel.price <= max_price)
    
    if available_only:
        query_obj = query_obj.filter(Hotel.available == True)
    
    return query_obj.all()

def create_hotel(db: Session, hotel: HotelCreate):
    """Create new hotel"""
    db_hotel = Hotel(**hotel.dict())
    db.add(db_hotel)
    db.commit()
    db.refresh(db_hotel)
    return db_hotel

def update_hotel(db: Session, hotel_id: int, hotel_update: HotelUpdate):
    """Update hotel"""
    db_hotel = get_hotel(db, hotel_id)
    if not db_hotel:
        return None
    
    update_data = hotel_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_hotel, field, value)
    
    db.commit()
    db.refresh(db_hotel)
    return db_hotel

def delete_hotel(db: Session, hotel_id: int):
    """Delete hotel"""
    db_hotel = get_hotel(db, hotel_id)
    if not db_hotel:
        return None
    
    db.delete(db_hotel)
    db.commit()
    return db_hotel

def get_hotel_statistics(db: Session, hotel_id: int):
    """Get hotel statistics"""
    hotel = get_hotel(db, hotel_id)
    if not hotel:
        return None
    
    from app.models.hotel import Booking, Room
    
    total_rooms = db.query(Room).filter(Room.hotel_id == hotel_id).count()
    available_rooms = db.query(Room).filter(
        and_(Room.hotel_id == hotel_id, Room.available == True)
    ).count()
    
    total_bookings = db.query(Booking).filter(Booking.hotel_id == hotel_id).count()
    confirmed_bookings = db.query(Booking).filter(
        and_(Booking.hotel_id == hotel_id, Booking.status == "confirmed")
    ).count()
    
    total_revenue = db.query(Booking).filter(
        and_(Booking.hotel_id == hotel_id, Booking.status != "cancelled")
    ).with_entities(Booking.total_price).all()
    
    revenue_sum = sum(revenue[0] for revenue in total_revenue) if total_revenue else 0
    
    return {
        "hotel_id": hotel_id,
        "total_rooms": total_rooms,
        "available_rooms": available_rooms,
        "total_bookings": total_bookings,
        "confirmed_bookings": confirmed_bookings,
        "total_revenue": revenue_sum
    }
```

**🎯 Practice:** Implement CRUD for:
- Room availability management
- Guest profile operations
- Booking lifecycle management
- Review moderation

---

## 🎯 Activity 2: Room CRUD Operations (45 minutes)

### Room Database Operations

**🏨 Room CRUD with Database:**

```python
# app/crud/room.py
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from app.models.hotel import Room, Hotel
from app.schemas.room import RoomCreate, RoomUpdate
from typing import List, Optional

def get_room(db: Session, room_id: int):
    """Get room by ID"""
    return db.query(Room).filter(Room.id == room_id).first()

def get_rooms_by_hotel(db: Session, hotel_id: int):
    """Get all rooms for a hotel"""
    return db.query(Room).filter(Room.hotel_id == hotel_id).all()

def get_available_rooms(db: Session, hotel_id: Optional[int] = None, check_in=None, check_out=None):
    """Get available rooms with date filtering"""
    query = db.query(Room).filter(Room.available == True)
    
    if hotel_id:
        query = query.filter(Room.hotel_id == hotel_id)
    
    # Filter by date range (check for existing bookings)
    if check_in and check_out:
        from app.models.hotel import Booking
        # Get rooms that don't have bookings in the date range
        booked_rooms = db.query(Booking.room_number).filter(
            and_(
                Booking.status != "cancelled",
                Booking.check_in < check_out,
                Booking.check_out > check_in
            )
        ).distinct().all()
        
        booked_room_numbers = [r[0] for r in booked_rooms]
        if booked_room_numbers:
            query = query.filter(~Room.room_number.in_(booked_room_numbers))
    
    return query.all()

def create_room(db: Session, room: RoomCreate):
    """Create new room"""
    db_room = Room(**room.dict())
    db.add(db_room)
    db.commit()
    db.refresh(db_room)
    return db_room

def update_room_availability(db: Session, room_id: int, available: bool):
    """Update room availability"""
    db_room = get_room(db, room_id)
    if not db_room:
        return None
    
    db_room.available = available
    db.commit()
    db.refresh(db_room)
    return db_room

def update_room_price(db: Session, room_id: int, new_price: float):
    """Update room price"""
    db_room = get_room(db, room_id)
    if not db_room:
        return None
    
    db_room.price_per_night = new_price
    db.commit()
    db.refresh(db_room)
    return db_room
```

**🎯 Practice:** Add room operations for:
- Bulk room creation
- Room amenity management
- Room image handling
- Room capacity updates

---

## 🎯 Activity 3: Booking CRUD Operations (60 minutes)

### Booking Database Operations

**🏨 Booking CRUD with Database:**

```python
# app/crud/booking.py
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from datetime import datetime, timedelta
from app.models.hotel import Booking, Room, Hotel, Guest
from app.schemas.booking import BookingCreate, BookingUpdate
from typing import List, Optional

def get_booking(db: Session, booking_id: str):
    """Get booking by booking ID"""
    return db.query(Booking).filter(Booking.booking_id == booking_id).first()

def get_bookings_by_guest(db: Session, guest_id: int):
    """Get all bookings for a guest"""
    return db.query(Booking).filter(Booking.guest_id == guest_id).all()

def get_bookings_by_hotel(db: Session, hotel_id: int):
    """Get all bookings for a hotel"""
    return db.query(Booking).filter(Booking.hotel_id == hotel_id).all()

def get_active_bookings(db: Session, hotel_id: int):
    """Get active (non-cancelled) bookings for a hotel"""
    return db.query(Booking).filter(
        and_(
            Booking.hotel_id == hotel_id,
            Booking.status != "cancelled"
        )
    ).all()

def check_room_availability(db: Session, hotel_id: int, room_number: str, check_in: datetime, check_out: datetime):
    """Check if room is available for given dates"""
    conflicting_bookings = db.query(Booking).filter(
        and_(
            Booking.hotel_id == hotel_id,
            Booking.room_number == room_number,
            Booking.status != "cancelled",
            Booking.check_in < check_out,
            Booking.check_out > check_in
        )
    ).first()
    
    return conflicting_bookings is None

def create_booking(db: Session, booking: BookingCreate):
    """Create new booking with transaction"""
    try:
        # Check room availability
        room = db.query(Room).filter(
            and_(
                Room.hotel_id == booking.hotel_id,
                Room.room_number == booking.room_number,
                Room.available == True
            )
        ).first()
        
        if not room:
            raise ValueError("Room not found or not available")
        
        # Check date availability
        if not check_room_availability(
            db, booking.hotel_id, booking.room_number, booking.check_in, booking.check_out
        ):
            raise ValueError("Room is not available for these dates")
        
        # Calculate total price
        nights = (booking.check_out - booking.check_in).days
        total_price = nights * room.price_per_night
        
        # Generate booking ID
        booking_id = f"BK-{datetime.now().strftime('%Y%m%d')}-{len(db.query(Booking).all()) + 1:04d}"
        
        # Create booking
        db_booking = Booking(
            booking_id=booking_id,
            hotel_id=booking.hotel_id,
            room_number=booking.room_number,
            guest_id=booking.guest_id,
            check_in=booking.check_in,
            check_out=booking.check_out,
            guests=booking.guests,
            total_price=total_price,
            status="pending",
            special_requests=booking.special_requests
        )
        
        db.add(db_booking)
        db.commit()
        db.refresh(db_booking)
        
        return db_booking
        
    except Exception as e:
        db.rollback()
        raise e

def update_booking_status(db: Session, booking_id: str, status: str):
    """Update booking status"""
    db_booking = get_booking(db, booking_id)
    if not db_booking:
        return None
    
    # Validate status transitions
    valid_transitions = {
        "pending": ["confirmed", "cancelled"],
        "confirmed": ["checked_in", "cancelled"],
        "checked_in": ["checked_out"],
        "checked_out": [],
        "cancelled": []
    }
    
    if status not in valid_transitions.get(db_booking.status, []):
        raise ValueError(f"Cannot transition from {db_booking.status} to {status}")
    
    db_booking.status = status
    db.commit()
    db.refresh(db_booking)
    return db_booking

def cancel_booking(db: Session, booking_id: str):
    """Cancel a booking"""
    return update_booking_status(db, booking_id, "cancelled")

def get_booking_statistics(db: Session, hotel_id: int, start_date: datetime, end_date: datetime):
    """Get booking statistics for a date range"""
    bookings = db.query(Booking).filter(
        and_(
            Booking.hotel_id == hotel_id,
            Booking.check_in >= start_date,
            Booking.check_out <= end_date
        )
    ).all()
    
    total_bookings = len(bookings)
    confirmed_bookings = len([b for b in bookings if b.status == "confirmed"])
    cancelled_bookings = len([b for b in bookings if b.status == "cancelled"])
    
    total_revenue = sum(b.total_price for b in bookings if b.status != "cancelled")
    
    return {
        "total_bookings": total_bookings,
        "confirmed_bookings": confirmed_bookings,
        "cancelled_bookings": cancelled_bookings,
        "total_revenue": total_revenue,
        "occupancy_rate": confirmed_bookings / total_bookings if total_bookings > 0 else 0
    }
```

**🎯 Practice:** Add booking operations for:
- Booking modification
- Check-in/check-out processing
- Guest change handling
- Payment processing

---

## 🎯 Activity 4: Transaction Management (30 minutes)

### Database Transactions

**🏨 Transaction Management:**

```python
# app/crud/base.py
from sqlalchemy.orm import Session
from typing import Generic, TypeVar, Type, Any, Optional

ModelType = TypeVar("ModelType", bound=object)

class CRUDBase(Generic[ModelType]):
    """Base CRUD class with transaction support"""
    
    def __init__(self, model: Type[ModelType]):
        self.model = model
    
    def get(self, db: Session, id: Any):
        """Get single record by ID"""
        return db.query(self.model).filter(self.model.id == id).first()
    
    def get_multi(self, db: Session, skip: int = 0, limit: int = 100):
        """Get multiple records with pagination"""
        return db.query(self.model).offset(skip).limit(limit).all()
    
    def create(self, db: Session, obj_in: dict):
        """Create new record"""
        db_obj = self.model(**obj_in)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def update(self, db: Session, db_obj: ModelType, obj_in: dict):
        """Update record"""
        for field, value in obj_in.items():
            setattr(db_obj, field, value)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def delete(self, db: Session, id: Any):
        """Delete record"""
        obj = self.get(db, id)
        if obj:
            db.delete(obj)
            db.commit()
        return obj

# Transaction example
def create_booking_with_room_update(db: Session, booking_data: dict):
    """Create booking and update room availability in transaction"""
    try:
        # Start transaction
        db.begin()
        
        # Create booking
        booking = Booking(**booking_data)
        db.add(booking)
        
        # Update room availability
        room = db.query(Room).filter(
            Room.room_number == booking_data["room_number"]
        ).first()
        
        if room:
            room.available = False
        
        # Commit transaction
        db.commit()
        
        return booking
        
    except Exception as e:
        # Rollback on error
        db.rollback()
        raise e
```

**🎯 Practice:** Implement transactions for:
- Guest registration with profile
- Hotel creation with rooms
- Booking with payment
- Multi-step operations

---

## 🎯 Activity 5: Complex Queries with Joins (45 minutes)

### Advanced Database Queries

**🏨 Complex Queries:**

```python
# app/crud/query.py
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
from app.models.hotel import Hotel, Room, Booking, Guest, Review

def get_hotels_with_room_count(db: Session):
    """Get hotels with available room count"""
    result = db.query(
        Hotel,
        func.count(Room.id).label("available_rooms")
    ).outerjoin(
        Room, and_(Room.hotel_id == Hotel.id, Room.available == True)
    ).group_by(Hotel.id).all()
    
    return result

def get_hotel_with_reviews(db: Session, hotel_id: int):
    """Get hotel with average rating and reviews"""
    hotel = db.query(Hotel).filter(Hotel.id == hotel_id).first()
    
    if not hotel:
        return None
    
    avg_rating = db.query(func.avg(Review.rating)).filter(
        Review.hotel_id == hotel_id
    ).scalar() or 0
    
    reviews = db.query(Review).filter(Review.hotel_id == hotel_id).all()
    
    return {
        "hotel": hotel,
        "average_rating": round(avg_rating, 1),
        "review_count": len(reviews),
        "reviews": reviews
    }

def get_guest_booking_history(db: Session, guest_id: int):
    """Get guest booking history with hotel details"""
    result = db.query(
        Booking,
        Hotel,
        Room
    ).join(Hotel, Booking.hotel_id == Hotel.id).join(
        Room, Booking.room_number == Room.room_number
    ).filter(Booking.guest_id == guest_id).order_by(
        Booking.created_at.desc()
    ).all()
    
    return result

def get_hotel_revenue_report(db: Session, hotel_id: int, start_date, end_date):
    """Generate revenue report for hotel"""
    result = db.query(
        func.date(Booking.check_in).label("date"),
        func.count(Booking.id).label("bookings"),
        func.sum(Booking.total_price).label("revenue")
    ).filter(
        and_(
            Booking.hotel_id == hotel_id,
            Booking.check_in >= start_date,
            Booking.check_out <= end_date,
            Booking.status != "cancelled"
        )
    ).group_by(func.date(Booking.check_in)).all()
    
    return result

def search_hotels_with_availability(db: Session, query: str, check_in: datetime, check_out: datetime):
    """Search hotels with real-time availability"""
    hotels = db.query(Hotel).filter(
        or_(
            Hotel.name.ilike(f"%{query}%"),
            Hotel.location.ilike(f"%{query}%")
        )
    ).all()
    
    available_hotels = []
    
    for hotel in hotels:
        # Check if any rooms are available
        available_rooms = db.query(Room).filter(
            and_(
                Room.hotel_id == hotel.id,
                Room.available == True
            )
        ).all()
        
        # Check availability for dates
        has_available_room = False
        for room in available_rooms:
            if check_room_availability(db, hotel.id, room.room_number, check_in, check_out):
                has_available_room = True
                break
        
        if has_available_room:
            available_hotels.append(hotel)
    
    return available_hotels
```

**🎯 Practice:** Create queries for:
- Hotel performance metrics
- Guest loyalty analysis
- Room utilization rates
- Revenue by location

---

## 🎯 Activity 6: Error Handling and Rollbacks (30 minutes)

### Database Error Handling

**🏨 Error Handling:**

```python
# app/crud/exceptions.py
class HotelBookingException(Exception):
    """Base exception for hotel booking"""
    pass

class HotelNotFoundException(HotelBookingException):
    """Hotel not found exception"""
    pass

class RoomNotAvailableException(HotelBookingException):
    """Room not available exception"""
    pass

class BookingConflictException(HotelBookingException):
    """Booking conflict exception"""
    pass

class GuestNotFoundException(HotelBookingException):
    """Guest not found exception"""
    pass

# Usage in CRUD functions
def create_booking_safe(db: Session, booking_data: dict):
    """Create booking with comprehensive error handling"""
    try:
        # Validate guest exists
        guest = db.query(Guest).filter(Guest.id == booking_data["guest_id"]).first()
        if not guest:
            raise GuestNotFoundException(f"Guest with ID {booking_data['guest_id']} not found")
        
        # Validate hotel exists
        hotel = db.query(Hotel).filter(Hotel.id == booking_data["hotel_id"]).first()
        if not hotel:
            raise HotelNotFoundException(f"Hotel with ID {booking_data['hotel_id']} not found")
        
        # Validate room exists and is available
        room = db.query(Room).filter(
            and_(
                Room.hotel_id == booking_data["hotel_id"],
                Room.room_number == booking_data["room_number"],
                Room.available == True
            )
        ).first()
        
        if not room:
            raise RoomNotAvailableException(f"Room {booking_data['room_number']} not available")
        
        # Check for booking conflicts
        if not check_room_availability(
            db, booking_data["hotel_id"], booking_data["room_number"],
            booking_data["check_in"], booking_data["check_out"]
        ):
            raise BookingConflictException("Room is already booked for these dates")
        
        # Create booking
        booking = create_booking(db, booking_data)
        return booking
        
    except HotelBookingException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HotelBookingException(f"Failed to create booking: {str(e)}")
```

**🎯 Practice:** Add error handling for:
- Database connection errors
- Constraint violations
- Timeout handling
- Data integrity errors

---

## 🎯 Main Class Activity: Complete Database Operations (60 minutes)

**Task:** Implement complete database operations for hotel booking

**Requirements:**
- Complete CRUD for all entities
- Transaction management
- Complex queries with joins
- Error handling and rollbacks
- Data validation
- Performance optimization

**Steps:**
1. Implement hotel CRUD operations
2. Build room database operations
3. Create booking database functions
4. Add transaction management
5. Implement complex queries
6. Add error handling
7. Test all operations
8. Optimize slow queries

---

## 🎯 Homework: Complete Database Operations

### Task 1: Enhanced Operations
- Add bulk operations
- Implement data export
- Create data import
- Add database backups

### Task 2: Performance Optimization
- Add query caching
- Implement connection pooling
- Optimize indexes
- Add query monitoring

### Task 3: Preparation for Next Session
**Read before next class:**
- React Integration: https://fastapi.tiangolo.com/tutorial/frontend/
- CORS Setup: https://fastapi.tiangolo.com/tutorial/cors/

---

## 🎯 Summary: Database Operations for Hotel Booking

**Key Takeaways:**
- **CRUD operations** manage hotel data persistence
- **Transactions** ensure data consistency
- **Joins** enable complex data retrieval
- **Error handling** prevents data corruption
- **Validation** maintains data integrity
- **Optimization** improves query performance

**Next Session:** We'll integrate the React frontend with the FastAPI backend for a complete hotel booking system.
