# Day 11: FastAPI Setup & Hotel API Basics

## Objectives (4 Hours)

By the end of this 4-hour session, you should be able to:

- Understand FastAPI framework for hotel booking APIs
- Set up FastAPI project for hotel booking backend
- Create basic API endpoints for hotel operations
- Understand path operations and HTTP methods
- Implement request handling and responses
- Use automatic API documentation
- Test hotel booking APIs

---

## Connecting to Your React Frontend

Your repo layout (from Week 1):

```
hotel-booking-app/
├── backend/     # Day 4 preview — you expand this in Week 3
├── frontend/    # Week 1 vanilla capstone
└── web/         # Week 2 React app
```

**Week 3 goal:** Replace the print-only Day 4 `backend/main.py` with a proper API (validation, CRUD, tests). Week 4 (Day 19) connects `web/` to the database-backed API.

**API contract** — keep aligned with `web/src/types/hotel.ts`:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/hotels` | GET | List all hotels |
| `/api/hotels/{id}` | GET | Single hotel detail |
| `/api/bookings` | POST | Create booking |

Response JSON must match your TypeScript interfaces so Day 19 integration is straightforward.

---

## 🏨 Why FastAPI for Hotel Booking?

**FastAPI** is a modern, fast web framework for building APIs with Python, perfect for hotel booking systems.

**FastAPI provides:**
- **High Performance** - Fast API responses for hotel searches
- **Type Hints** - Automatic data validation for booking data
- **Automatic Documentation** - Interactive API docs
- **Modern Python** - Async support for concurrent hotel operations
- **Easy Testing** - Built-in testing capabilities

**Perfect for Hotel Booking Because:**
- Fast hotel search responses
- Type-safe booking data
- Automatic API documentation
- Async operations for availability checking
- Easy integration with frontend

---

## 🚀 Step 1: Setting Up FastAPI Project (30 minutes)

### Creating FastAPI Project Structure

**🏨 Hotel Booking API Setup:**

```bash
# Expand existing backend from Day 4 (do not start from scratch)
cd hotel-booking-app/backend
source .venv/bin/activate   # or create .venv if missing
pip install fastapi uvicorn pydantic
```

**Project Structure:**
```
hotel-booking-api/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── models/
│   ├── schemas/
│   ├── routers/
│   └── database.py
├── venv/
├── requirements.txt
└── README.md
```

---

## 🎯 Activity 1: Basic FastAPI Application (45 minutes)

### Creating Your First FastAPI App

**🏨 Basic Hotel API:**

```python
# app/main.py
from fastapi import FastAPI

app = FastAPI(
    title="Hotel Booking API",
    description="API for hotel room booking system",
    version="1.0.0"
)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to Hotel Booking API",
        "version": "1.0.0",
        "endpoints": {
            "hotels": "/hotels",
            "rooms": "/rooms",
            "bookings": "/bookings"
        }
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

**Run the API:**
```bash
# Development server with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Or using Python
python -m uvicorn app.main:app --reload
```

**Access API Documentation:**
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

## 🎯 Activity 2: Path Operations for Hotels (45 minutes)

### Creating Hotel Endpoints

**🏨 Hotel API Endpoints:**

```python
# app/main.py
from fastapi import FastAPI, HTTPException
from typing import List, Optional

app = FastAPI(title="Hotel Booking API")

# Mock hotel data
hotels_db = [
    {
        "id": 1,
        "name": "Grand Palace Hotel",
        "location": "New York",
        "rating": 4.5,
        "price": 200,
        "available": True,
        "amenities": ["WiFi", "Pool", "Spa"]
    },
    {
        "id": 2,
        "name": "Seaside Resort",
        "location": "Miami",
        "rating": 4.0,
        "price": 150,
        "available": True,
        "amenities": ["WiFi", "Beach", "Restaurant"]
    },
    {
        "id": 3,
        "name": "Mountain Lodge",
        "location": "Denver",
        "rating": 4.8,
        "price": 180,
        "available": False,
        "amenities": ["WiFi", "Fireplace", "Hiking"]
    }
]

# GET all hotels
@app.get("/hotels")
def get_hotels(
    location: Optional[str] = None,
    min_rating: Optional[float] = None,
    max_price: Optional[int] = None
):
    """Get all hotels with optional filtering"""
    filtered_hotels = hotels_db
    
    if location:
        filtered_hotels = [h for h in filtered_hotels if h["location"].lower() == location.lower()]
    
    if min_rating:
        filtered_hotels = [h for h in filtered_hotels if h["rating"] >= min_rating]
    
    if max_price:
        filtered_hotels = [h for h in filtered_hotels if h["price"] <= max_price]
    
    return {"hotels": filtered_hotels, "count": len(filtered_hotels)}

# GET single hotel by ID
@app.get("/hotels/{hotel_id}")
def get_hotel(hotel_id: int):
    """Get a specific hotel by ID"""
    hotel = next((h for h in hotels_db if h["id"] == hotel_id), None)
    
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")
    
    return hotel

# GET available hotels only
@app.get("/hotels/available")
def get_available_hotels():
    """Get only available hotels"""
    available = [h for h in hotels_db if h["available"]]
    return {"hotels": available, "count": len(available)}

# POST new hotel
@app.post("/hotels")
def create_hotel(hotel: dict):
    """Create a new hotel"""
    new_id = max(h["id"] for h in hotels_db) + 1
    hotel["id"] = new_id
    hotels_db.append(hotel)
    return {"message": "Hotel created successfully", "hotel": hotel}

# PUT update hotel
@app.put("/hotels/{hotel_id}")
def update_hotel(hotel_id: int, hotel_data: dict):
    """Update an existing hotel"""
    hotel = next((h for h in hotels_db if h["id"] == hotel_id), None)
    
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")
    
    hotel.update(hotel_data)
    return {"message": "Hotel updated successfully", "hotel": hotel}

# DELETE hotel
@app.delete("/hotels/{hotel_id}")
def delete_hotel(hotel_id: int):
    """Delete a hotel"""
    hotel = next((h for h in hotels_db if h["id"] == hotel_id), None)
    
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")
    
    hotels_db.remove(hotel)
    return {"message": "Hotel deleted successfully"}
```

**🎯 Practice:** Create endpoints for:
- Hotel search by name
- Hotel amenities filtering
- Hotel rating sorting
- Hotel availability toggle

---

## 🎯 Activity 3: Request Body and Query Parameters (30 minutes)

### Handling Request Data

**🏨 Request Parameters Example:**

```python
from fastapi import FastAPI, Query, Body
from typing import Optional

app = FastAPI()

# Query parameters
@app.get("/hotels/search")
def search_hotels(
    location: Optional[str] = Query(None, description="Filter by location"),
    min_price: Optional[int] = Query(None, description="Minimum price"),
    max_price: Optional[int] = Query(None, description="Maximum price"),
    min_rating: Optional[float] = Query(None, ge=0, le=5, description="Minimum rating"),
    available_only: bool = Query(False, description="Show only available hotels")
):
    """Search hotels with multiple filters"""
    results = hotels_db
    
    if location:
        results = [h for h in results if location.lower() in h["location"].lower()]
    
    if min_price:
        results = [h for h in results if h["price"] >= min_price]
    
    if max_price:
        results = [h for h in results if h["price"] <= max_price]
    
    if min_rating:
        results = [h for h in results if h["rating"] >= min_rating]
    
    if available_only:
        results = [h for h in results if h["available"]]
    
    return {"results": results, "count": len(results)}

# Request body
@app.post("/hotels")
def create_hotel(
    name: str = Body(..., description="Hotel name"),
    location: str = Body(..., description="Hotel location"),
    rating: float = Body(..., ge=0, le=5, description="Hotel rating"),
    price: int = Body(..., gt=0, description="Price per night"),
    amenities: list = Body(default=[], description="List of amenities")
):
    """Create a new hotel with request body validation"""
    new_hotel = {
        "id": len(hotels_db) + 1,
        "name": name,
        "location": location,
        "rating": rating,
        "price": price,
        "available": True,
        "amenities": amenities
    }
    
    hotels_db.append(new_hotel)
    return {"message": "Hotel created", "hotel": new_hotel}

# Mixed parameters
@app.post("/hotels/{hotel_id}/bookings")
def create_booking(
    hotel_id: int,
    guest_name: str = Body(...),
    check_in: str = Body(...),
    check_out: str = Body(...),
    guests: int = Body(..., gt=0)
):
    """Create a booking for a specific hotel"""
    hotel = next((h for h in hotels_db if h["id"] == hotel_id), None)
    
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")
    
    if not hotel["available"]:
        raise HTTPException(status_code=400, detail="Hotel is not available")
    
    booking = {
        "booking_id": f"BK-{len(hotels_db) + 1}",
        "hotel_id": hotel_id,
        "guest_name": guest_name,
        "check_in": check_in,
        "check_out": check_out,
        "guests": guests,
        "status": "confirmed"
    }
    
    return {"message": "Booking created", "booking": booking}
```

**🎯 Practice:** Implement parameters for:
- Date range filtering
- Guest capacity filtering
- Price range validation
- Amenity requirements

---

## 🎯 Activity 4: Response Models and Status Codes (30 minutes)

### Structured API Responses

**🏨 Response Models Example:**

```python
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List

app = FastAPI()

# Response models
class HotelResponse(BaseModel):
    id: int
    name: str
    location: str
    rating: float
    price: int
    available: bool
    amenities: List[str]

class HotelListResponse(BaseModel):
    hotels: List[HotelResponse]
    count: int

class ErrorResponse(BaseModel):
    error: str
    detail: str

# GET with response model
@app.get("/hotels", response_model=HotelListResponse, status_code=status.HTTP_200_OK)
def get_hotels():
    """Get all hotels with structured response"""
    return HotelListResponse(
        hotels=hotels_db,
        count=len(hotels_db)
    )

# POST with different response codes
@app.post("/hotels", response_model=HotelResponse, status_code=status.HTTP_201_CREATED)
def create_hotel(hotel_data: dict):
    """Create hotel with 201 status"""
    new_hotel = {
        "id": len(hotels_db) + 1,
        **hotel_data,
        "available": True
    }
    hotels_db.append(new_hotel)
    return new_hotel

# Custom error responses
@app.get("/hotels/{hotel_id}")
def get_hotel(hotel_id: int):
    """Get hotel with custom error handling"""
    hotel = next((h for h in hotels_db if h["id"] == hotel_id), None)
    
    if not hotel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hotel not found",
            headers={"X-Error": "Hotel not found"}
        )
    
    return hotel
```

**🎯 Practice:** Create response models for:
- Room information
- Booking confirmation
- Guest profile
- Error responses

---

## 🎯 Activity 5: Hotel Room Endpoints (45 minutes)

### Building Room Management API

**🏨 Room API Endpoints:**

```python
# Mock room data
rooms_db = [
    {"room_number": "101", "hotel_id": 1, "type": "single", "capacity": 1, "price": 100, "available": True},
    {"room_number": "102", "hotel_id": 1, "type": "double", "capacity": 2, "price": 150, "available": True},
    {"room_number": "201", "hotel_id": 2, "type": "suite", "capacity": 4, "price": 250, "available": True},
    {"room_number": "301", "hotel_id": 3, "type": "single", "capacity": 1, "price": 120, "available": False}
]

# GET all rooms
@app.get("/rooms")
def get_rooms(hotel_id: Optional[int] = None):
    """Get all rooms, optionally filtered by hotel"""
    if hotel_id:
        rooms = [r for r in rooms_db if r["hotel_id"] == hotel_id]
    else:
        rooms = rooms_db
    
    return {"rooms": rooms, "count": len(rooms)}

# GET available rooms
@app.get("/rooms/available")
def get_available_rooms(hotel_id: Optional[int] = None):
    """Get available rooms"""
    rooms = [r for r in rooms_db if r["available"]]
    
    if hotel_id:
        rooms = [r for r in rooms if r["hotel_id"] == hotel_id]
    
    return {"rooms": rooms, "count": len(rooms)}

# GET rooms by type
@app.get("/rooms/type/{room_type}")
def get_rooms_by_type(room_type: str):
    """Get rooms by type (single, double, suite)"""
    rooms = [r for r in rooms_db if r["type"] == room_type.lower()]
    
    if not rooms:
        raise HTTPException(status_code=404, detail=f"No {room_type} rooms found")
    
    return {"rooms": rooms, "count": len(rooms)}

# POST new room
@app.post("/rooms")
def create_room(room_data: dict):
    """Create a new room"""
    new_room = {
        "room_number": room_data["room_number"],
        "hotel_id": room_data["hotel_id"],
        "type": room_data["type"],
        "capacity": room_data["capacity"],
        "price": room_data["price"],
        "available": True
    }
    
    rooms_db.append(new_room)
    return {"message": "Room created", "room": new_room}

# PUT update room availability
@app.put("/rooms/{room_number}/availability")
def update_room_availability(room_number: str, available: bool):
    """Update room availability"""
    room = next((r for r in rooms_db if r["room_number"] == room_number), None)
    
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    room["available"] = available
    return {"message": "Room availability updated", "room": room}
```

**🎯 Practice:** Add room endpoints for:
- Room price updates
- Room capacity changes
- Room amenity management
- Room image handling

---

## 🎯 Main Class Activity: Complete Hotel API (60 minutes)

**Task:** Build complete hotel booking API with FastAPI

**Requirements:**
- Hotel CRUD operations
- Room management endpoints
- Search and filtering
- Proper HTTP methods
- Error handling
- Response models
- API documentation

**Steps:**
1. Set up FastAPI project structure
2. Create hotel endpoints
3. Add room management
4. Implement search and filtering
5. Add error handling
6. Create response models
7. Test with Swagger UI
8. Document API endpoints

---

## 🎯 Homework: Complete FastAPI Setup

### Task 1: Enhanced API Features
- Add CORS support
- Implement rate limiting
- Add logging middleware
- Create API versioning

### Task 2: API Documentation
- Add detailed endpoint descriptions
- Include example requests/responses
- Add authentication documentation
- Create API usage examples

### Task 3: Preparation for Next Session
**Read before next class:**
- Pydantic Documentation: https://docs.pydantic.dev/
- Data Validation: https://fastapi.tiangolo.com/tutorial/body/

---

## 🎯 Summary: FastAPI Setup for Hotel Booking

**Key Takeaways:**
- **FastAPI** provides fast, modern API development
- **Path operations** define hotel booking endpoints
- **Request parameters** handle filtering and search
- **Response models** structure API responses
- **Automatic documentation** with Swagger UI
- **Type hints** enable automatic validation

**Next Session:** We'll use Pydantic models for robust data validation in hotel booking APIs.
