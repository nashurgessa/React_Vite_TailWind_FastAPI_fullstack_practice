# Day 17: SQLAlchemy ORM & Hotel Models

## 🎯 Objectives (4 Hours)

By the end of this 4-hour session, you should be able to:

- Understand SQLAlchemy ORM concepts
- Set up SQLAlchemy with MySQL
- Create ORM models for hotel entities
- Define relationships between models
- Use Pydantic models with SQLAlchemy
- Implement database sessions
- Create model validation and serialization

---

## 🏨 SQLAlchemy for Hotel Booking

**SQLAlchemy** provides Python ORM (Object-Relational Mapping) to interact with MySQL databases using Python objects instead of SQL queries.

**SQLAlchemy Benefits:**
- **Pythonic Interface**: Work with Python objects
- **Type Safety**: Compile-time type checking
- **Relationships**: Easy model relationships
- **Migrations**: Database schema management
- **Query Building**: Complex queries with Python

---

## 🎯 Activity 1: Setting Up SQLAlchemy (30 minutes)

### Installing and Configuring SQLAlchemy

**🏨 SQLAlchemy Setup:**

```bash
# Install SQLAlchemy and dependencies
pip install sqlalchemy pymysql python-dotenv

# Install additional dependencies
pip install alembic
```

**Create database configuration:**

```python
# app/database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# Database URL
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://root:password@localhost:3306/hotel_booking"
)

# Create engine
engine = create_engine(DATABASE_URL)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class for models
Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

**Create .env file:**
```env
DATABASE_URL=mysql+pymysql://root:your_password@localhost:3306/hotel_booking
```

---

## 🎯 Activity 2: Creating Hotel Models (60 minutes)

### SQLAlchemy ORM Models

**🏨 Hotel ORM Models:**

```python
# app/models/hotel.py
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey, JSON, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum

class RoomType(str, enum.Enum):
    SINGLE = "single"
    DOUBLE = "double"
    SUITE = "suite"
    PENTHOUSE = "penthouse"

class BookingStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CHECKED_IN = "checked_in"
    CHECKED_OUT = "checked_out"
    CANCELLED = "cancelled"

class Hotel(Base):
    """Hotel model"""
    __tablename__ = "hotels"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    location = Column(String(100), nullable=False, index=True)
    rating = Column(Float, nullable=False)
    price = Column(Float, nullable=False, index=True)
    available = Column(Boolean, default=True, index=True)
    description = Column(Text)
    image_url = Column(String(500))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    rooms = relationship("Room", back_populates="hotel", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="hotel", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="hotel", cascade="all, delete-orphan")
    amenities = relationship("HotelAmenity", back_populates="hotel", cascade="all, delete-orphan")

class Room(Base):
    """Room model"""
    __tablename__ = "rooms"
    
    id = Column(Integer, primary_key=True, index=True)
    hotel_id = Column(Integer, ForeignKey("hotels.id"), nullable=False, index=True)
    room_number = Column(String(10), nullable=False)
    type = Column(SQLEnum(RoomType), nullable=False)
    capacity = Column(Integer, nullable=False)
    price_per_night = Column(Float, nullable=False)
    available = Column(Boolean, default=True, index=True)
    amenities = Column(JSON)
    images = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    hotel = relationship("Hotel", back_populates="rooms")
    bookings = relationship("Booking", back_populates="room")

class Guest(Base):
    """Guest model"""
    __tablename__ = "guests"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    phone = Column(String(20), nullable=False)
    address = Column(String(200))
    city = Column(String(100))
    country = Column(String(100))
    postal_code = Column(String(20))
    preferences = Column(JSON)
    loyalty_points = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    bookings = relationship("Booking", back_populates="guest", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="guest", cascade="all, delete-orphan")

class Booking(Base):
    """Booking model"""
    __tablename__ = "bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(String(20), unique=True, nullable=False, index=True)
    hotel_id = Column(Integer, ForeignKey("hotels.id"), nullable=False, index=True)
    room_number = Column(String(10), nullable=False)  # Store room number, not ID
    guest_id = Column(Integer, ForeignKey("guests.id"), nullable=False, index=True)
    check_in = Column(DateTime, nullable=False, index=True)
    check_out = Column(DateTime, nullable=False, index=True)
    guests = Column(Integer, nullable=False)
    total_price = Column(Float, nullable=False)
    status = Column(SQLEnum(BookingStatus), default=BookingStatus.PENDING, index=True)
    special_requests = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    hotel = relationship("Hotel", back_populates="bookings")
    guest = relationship("Guest", back_populates="bookings")
    room = relationship("Room", back_populates="bookings")

class Review(Base):
    """Review model"""
    __tablename__ = "reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    hotel_id = Column(Integer, ForeignKey("hotels.id"), nullable=False, index=True)
    guest_id = Column(Integer, ForeignKey("guests.id"), nullable=False, index=True)
    rating = Column(Float, nullable=False)
    comment = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    hotel = relationship("Hotel", back_populates="reviews")
    guest = relationship("Guest", back_populates="reviews")

class Amenity(Base):
    """Amenity model"""
    __tablename__ = "amenities"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    description = Column(String(200))
    icon = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class HotelAmenity(Base):
    """Hotel-Amenity junction table"""
    __tablename__ = "hotel_amenities"
    
    hotel_id = Column(Integer, ForeignKey("hotels.id"), primary_key=True)
    amenity_id = Column(Integer, ForeignKey("amenities.id"), primary_key=True)
    
    # Relationships
    hotel = relationship("Hotel", back_populates="amenities")
    amenity = relationship("Amenity")
```

**🎯 Practice:** Create ORM models for:
- Payment transactions
- Booking history
- Room availability calendar
- Guest loyalty program

---

## 🎯 Activity 3: Pydantic Models with SQLAlchemy (30 minutes)

### Integrating Pydantic with ORM

**🏨 Pydantic Schemas from ORM:**

```python
# app/schemas/hotel.py
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class HotelBase(BaseModel):
    """Base hotel schema"""
    name: str = Field(..., min_length=2, max_length=100)
    location: str = Field(..., min_length=2, max_length=100)
    rating: float = Field(..., ge=0, le=5)
    price: float = Field(..., gt=0)
    available: bool = True
    description: Optional[str] = Field(None, max_length=500)
    image_url: Optional[str] = None

class HotelCreate(HotelBase):
    """Schema for creating hotel"""
    pass

class HotelUpdate(BaseModel):
    """Schema for updating hotel"""
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    location: Optional[str] = Field(None, min_length=2, max_length=100)
    rating: Optional[float] = Field(None, ge=0, le=5)
    price: Optional[float] = Field(None, gt=0)
    available: Optional[bool] = None
    description: Optional[str] = Field(None, max_length=500)
    image_url: Optional[str] = None

class Hotel(HotelBase):
    """Complete hotel schema"""
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True  # Pydantic v2: orm_mode = True

class HotelList(BaseModel):
    """Hotel list response"""
    hotels: List[Hotel]
    count: int
```

**🎯 Practice:** Create Pydantic schemas for:
- Room models
- Booking models
- Guest models
- Review models

---

## 🎯 Activity 4: Database Session Management (30 minutes)

### Using Database Sessions

**🏨 Session Management:**

```python
# app/crud/hotel.py
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.hotel import Hotel
from app.schemas.hotel import HotelCreate, HotelUpdate
from typing import List, Optional

def get_hotel(db: Session, hotel_id: int):
    """Get hotel by ID"""
    return db.query(Hotel).filter(Hotel.id == hotel_id).first()

def get_hotels(db: Session, skip: int = 0, limit: int = 100):
    """Get all hotels with pagination"""
    return db.query(Hotel).offset(skip).limit(limit).all()

def get_hotels_by_location(db: Session, location: str):
    """Get hotels by location"""
    return db.query(Hotel).filter(Hotel.location.ilike(f"%{location}%")).all()

def search_hotels(db: Session, query: str, min_rating: Optional[float] = None, max_price: Optional[float] = None):
    """Search hotels with filters"""
    query_obj = db.query(Hotel)
    
    if query:
        query_obj = query_obj.filter(
            or_(
                Hotel.name.ilike(f"%{query}%"),
                Hotel.location.ilike(f"%{query}%"),
                Hotel.description.ilike(f"%{query}%")
            )
        )
    
    if min_rating:
        query_obj = query_obj.filter(Hotel.rating >= min_rating)
    
    if max_price:
        query_obj = query_obj.filter(Hotel.price <= max_price)
    
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
```

**🎯 Practice:** Create CRUD functions for:
- Room management
- Guest operations
- Booking operations
- Review management

---

## 🎯 Activity 5: Creating Database Tables (30 minutes)

### Initializing Database

**🏨 Database Initialization:**

```python
# app/database.py
from app.models.hotel import Base, Hotel, Room, Guest, Booking, Review, Amenity, HotelAmenity

def create_tables():
    """Create all database tables"""
    Base.metadata.create_all(bind=engine)

def drop_tables():
    """Drop all database tables"""
    Base.metadata.drop_all(bind=engine)

# Run initialization
if __name__ == "__main__":
    create_tables()
    print("Database tables created successfully!")
```

**Create initialization script:**

```python
# scripts/init_db.py
from app.database import engine, Base
from app.models.hotel import Hotel, Room, Guest, Booking, Review, Amenity, HotelAmenity

def init_db():
    """Initialize database with tables and sample data"""
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Add sample data
    from app.database import SessionLocal
    db = SessionLocal()
    
    try:
        # Create sample hotel
        hotel = Hotel(
            name="Grand Palace Hotel",
            location="New York",
            rating=4.5,
            price=200.0,
            available=True,
            description="Luxury hotel in Manhattan"
        )
        db.add(hotel)
        db.commit()
        
        # Create sample room
        room = Room(
            hotel_id=hotel.id,
            room_number="101",
            type="single",
            capacity=1,
            price_per_night=100.0,
            available=True
        )
        db.add(room)
        db.commit()
        
        print("Database initialized successfully!")
        
    except Exception as e:
        db.rollback()
        print(f"Error initializing database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
```

---

## 🎯 Activity 6: Testing ORM Models (30 minutes)

### Testing SQLAlchemy Models

**🏨 ORM Model Tests:**

```python
# tests/test_models.py
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.hotel import Hotel, Room, Guest, Booking
from app.database import Base

# Test database
TEST_DATABASE_URL = "sqlite:///./test.db"
test_engine = create_engine(TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

@pytest.fixture
def db_session():
    """Create test database session"""
    Base.metadata.create_all(bind=test_engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=test_engine)

def test_create_hotel(db_session):
    """Test creating hotel"""
    hotel = Hotel(
        name="Test Hotel",
        location="Test City",
        rating=4.5,
        price=200.0
    )
    db_session.add(hotel)
    db_session.commit()
    
    assert hotel.id is not None
    assert hotel.name == "Test Hotel"

def test_hotel_room_relationship(db_session):
    """Test hotel-room relationship"""
    hotel = Hotel(name="Test Hotel", location="Test City", rating=4.5, price=200.0)
    db_session.add(hotel)
    db_session.commit()
    
    room = Room(
        hotel_id=hotel.id,
        room_number="101",
        type="single",
        capacity=1,
        price_per_night=100.0
    )
    db_session.add(room)
    db_session.commit()
    
    assert room.hotel == hotel
    assert len(hotel.rooms) == 1
```

**🎯 Practice:** Test ORM for:
- Model relationships
- CRUD operations
- Query filtering
- Data validation

---

## 🎯 Main Class Activity: Complete ORM Setup (60 minutes)

**Task:** Set up complete SQLAlchemy ORM for hotel booking

**Requirements:**
- SQLAlchemy configuration
- All ORM models created
- Relationships defined
- Pydantic schemas integrated
- CRUD functions implemented
- Database initialization
- Model testing

**Steps:**
1. Install SQLAlchemy dependencies
2. Configure database connection
3. Create all ORM models
4. Define relationships
5. Create Pydantic schemas
6. Implement CRUD functions
7. Initialize database
8. Test ORM operations

---

## 🎯 Homework: Complete ORM Setup

### Task 1: Enhanced ORM Features
- Add model validators
- Implement soft deletes
- Create model methods
- Add computed properties

### Task 2: Database Migrations
- Set up Alembic
- Create migration scripts
- Implement version control
- Add rollback procedures

### Task 3: Preparation for Next Session
**Read before next class:**
- CRUD Operations: https://docs.sqlalchemy.org/en/14/orm/session_basics.html
- Query API: https://docs.sqlalchemy.org/en/14/orm/query.html

---

## 🎯 Summary: SQLAlchemy ORM for Hotel Booking

**Key Takeaways:**
- **SQLAlchemy** provides Python ORM for MySQL
- **Models** represent database tables as Python classes
- **Relationships** connect hotel entities
- **Sessions** manage database connections
- **Pydantic integration** ensures type safety
- **CRUD functions** simplify database operations

**Next Session:** We'll implement complete database operations for hotel booking data persistence.
