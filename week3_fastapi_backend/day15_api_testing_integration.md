# Day 15: API Testing & Hotel Service Integration

## 🎯 Objectives (4 Hours)

By the end of this 4-hour session, you should be able to:

- Write unit tests for hotel booking APIs
- Test API endpoints with pytest
- Implement integration testing
- Use TestClient for FastAPI testing
- Test Pydantic model validation
- Mock external dependencies
- Ensure API reliability and quality

---

## 🏨 API Testing for Hotel Booking

**Testing** ensures your hotel booking API works correctly, handles errors gracefully, and maintains data integrity.

**Testing Types:**
- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test API endpoints and database interactions
- **End-to-End Tests**: Test complete user flows
- **Performance Tests**: Test API response times and load handling

---

## 🎯 Activity 1: Setting Up Testing Environment (30 minutes)

### Installing Testing Dependencies

**🏨 Testing Setup:**

```bash
# Install testing dependencies
pip install pytest pytest-asyncio httpx

# Install additional testing tools
pip install pytest-cov faker
```

**Create test structure:**
```
hotel-booking-api/
├── app/
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_hotels.py
│   ├── test_rooms.py
│   ├── test_bookings.py
│   └── test_guests.py
└── pytest.ini
```

**pytest.ini configuration:**
```ini
[pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts = -v --tb=short --strict-markers
markers =
    unit: Unit tests
    integration: Integration tests
    slow: Slow running tests
```

---

## 🎯 Activity 2: Testing Hotel Endpoints (60 minutes)

### Writing Hotel API Tests

**🏨 Hotel Endpoint Tests:**

```python
# tests/conftest.py
import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    """Create test client"""
    return TestClient(app)

@pytest.fixture
def sample_hotel():
    """Sample hotel data for testing"""
    return {
        "name": "Test Hotel",
        "location": "Test City",
        "rating": 4.5,
        "price": 200,
        "available": True,
        "amenities": ["WiFi", "Pool"],
        "description": "A test hotel"
    }
```

```python
# tests/test_hotels.py
import pytest
from fastapi import status

def test_create_hotel(client, sample_hotel):
    """Test creating a new hotel"""
    response = client.post("/hotels/", json=sample_hotel)
    
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["name"] == sample_hotel["name"]
    assert data["location"] == sample_hotel["location"]
    assert "id" in data

def test_create_hotel_duplicate_name(client, sample_hotel):
    """Test creating hotel with duplicate name"""
    # Create first hotel
    client.post("/hotels/", json=sample_hotel)
    
    # Try to create duplicate
    response = client.post("/hotels/", json=sample_hotel)
    
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "already exists" in response.json()["detail"]

def test_get_hotels(client):
    """Test getting all hotels"""
    response = client.get("/hotels/")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "hotels" in data
    assert "count" in data
    assert isinstance(data["hotels"], list)

def test_get_hotel_by_id(client, sample_hotel):
    """Test getting a specific hotel by ID"""
    # Create hotel first
    create_response = client.post("/hotels/", json=sample_hotel)
    hotel_id = create_response.json()["id"]
    
    # Get hotel by ID
    response = client.get(f"/hotels/{hotel_id}")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == hotel_id
    assert data["name"] == sample_hotel["name"]

def test_get_hotel_not_found(client):
    """Test getting non-existent hotel"""
    response = client.get("/hotels/99999")
    
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert "not found" in response.json()["detail"]

def test_update_hotel(client, sample_hotel):
    """Test updating hotel information"""
    # Create hotel first
    create_response = client.post("/hotels/", json=sample_hotel)
    hotel_id = create_response.json()["id"]
    
    # Update hotel
    update_data = {"price": 250, "rating": 4.8}
    response = client.put(f"/hotels/{hotel_id}", json=update_data)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["price"] == 250
    assert data["rating"] == 4.8

def test_delete_hotel(client, sample_hotel):
    """Test deleting a hotel"""
    # Create hotel first
    create_response = client.post("/hotels/", json=sample_hotel)
    hotel_id = create_response.json()["id"]
    
    # Delete hotel
    response = client.delete(f"/hotels/{hotel_id}")
    
    assert response.status_code == status.HTTP_204_NO_CONTENT
    
    # Verify deletion
    get_response = client.get(f"/hotels/{hotel_id}")
    assert get_response.status_code == status.HTTP_404_NOT_FOUND

def test_hotel_search(client):
    """Test hotel search functionality"""
    response = client.get("/hotels/search?q=test")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "results" in data
    assert "filters_applied" in data

def test_hotel_search_with_filters(client):
    """Test hotel search with filters"""
    response = client.get(
        "/hotels/search",
        params={
            "location": "test",
            "min_rating": 4.0,
            "max_price": 300,
            "available_only": True
        }
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["filters_applied"]["location"] == "test"
```

**🎯 Practice:** Write tests for:
- Room CRUD operations
- Booking creation and validation
- Guest registration
- Search and filtering

---

## 🎯 Activity 3: Testing Pydantic Models (30 minutes)

### Testing Data Validation

**🏨 Pydantic Model Tests:**

```python
# tests/test_schemas.py
import pytest
from pydantic import ValidationError
from app.schemas.hotel import HotelCreate, HotelUpdate

def test_hotel_create_valid():
    """Test valid hotel creation"""
    hotel_data = {
        "name": "Test Hotel",
        "location": "Test City",
        "rating": 4.5,
        "price": 200,
        "available": True,
        "amenities": ["WiFi", "Pool"]
    }
    
    hotel = HotelCreate(**hotel_data)
    assert hotel.name == "Test Hotel"
    assert hotel.rating == 4.5

def test_hotel_create_invalid_rating():
    """Test invalid rating validation"""
    hotel_data = {
        "name": "Test Hotel",
        "location": "Test City",
        "rating": 6.0,  # Invalid: > 5
        "price": 200
    }
    
    with pytest.raises(ValidationError) as exc_info:
        HotelCreate(**hotel_data)
    
    assert "rating" in str(exc_info.value)

def test_hotel_create_invalid_price():
    """Test invalid price validation"""
    hotel_data = {
        "name": "Test Hotel",
        "location": "Test City",
        "rating": 4.5,
        "price": -100  # Invalid: negative
    }
    
    with pytest.raises(ValidationError):
        HotelCreate(**hotel_data)

def test_hotel_update_partial():
    """Test partial hotel update"""
    update_data = {"price": 250}
    hotel_update = HotelUpdate(**update_data)
    
    assert hotel_update.price == 250
    assert hotel_update.name is None  # Not provided
```

**🎯 Practice:** Test validation for:
- Booking date constraints
- Guest email format
- Room capacity limits
- Phone number format

---

## 🎯 Activity 4: Integration Testing (45 minutes)

### Testing Complete Workflows

**🏨 Integration Tests:**

```python
# tests/test_integration.py
import pytest
from datetime import date, timedelta

def test_complete_booking_flow(client):
    """Test complete booking workflow"""
    # 1. Create hotel
    hotel_data = {
        "name": "Integration Test Hotel",
        "location": "Test City",
        "rating": 4.5,
        "price": 200,
        "available": True,
        "amenities": ["WiFi"]
    }
    hotel_response = client.post("/hotels/", json=hotel_data)
    hotel_id = hotel_response.json()["id"]
    
    # 2. Create room
    room_data = {
        "room_number": "101",
        "hotel_id": hotel_id,
        "type": "single",
        "capacity": 1,
        "price_per_night": 100,
        "available": True
    }
    room_response = client.post("/rooms/", json=room_data)
    room_number = room_response.json()["room_number"]
    
    # 3. Create guest
    guest_data = {
        "name": "Test Guest",
        "email": "test@example.com",
        "phone": "+1234567890"
    }
    guest_response = client.post("/guests/", json=guest_data)
    guest_email = guest_response.json()["email"]
    
    # 4. Create booking
    check_in = date.today() + timedelta(days=7)
    check_out = check_in + timedelta(days=3)
    
    booking_data = {
        "hotel_id": hotel_id,
        "room_number": room_number,
        "guest_name": "Test Guest",
        "guest_email": guest_email,
        "guest_phone": "+1234567890",
        "check_in": check_in.isoformat(),
        "check_out": check_out.isoformat(),
        "guests": 1
    }
    
    booking_response = client.post("/bookings/", json=booking_data)
    assert booking_response.status_code == status.HTTP_201_CREATED
    
    booking_id = booking_response.json()["booking_id"]
    
    # 5. Verify booking
    get_booking = client.get(f"/bookings/{booking_id}")
    assert get_booking.status_code == status.HTTP_200_OK
    assert get_booking.json()["status"] == "pending"
    
    # 6. Confirm booking
    update_response = client.put(
        f"/bookings/{booking_id}",
        json={"status": "confirmed"}
    )
    assert update_response.status_code == status.HTTP_200_OK
    assert update_response.json()["status"] == "confirmed"

def test_booking_conflict_detection(client):
    """Test booking conflict detection"""
    # Setup hotel and room
    hotel_data = {
        "name": "Conflict Test Hotel",
        "location": "Test City",
        "rating": 4.0,
        "price": 150,
        "available": True,
        "amenities": ["WiFi"]
    }
    hotel_response = client.post("/hotels/", json=hotel_data)
    hotel_id = hotel_response.json()["id"]
    
    room_data = {
        "room_number": "201",
        "hotel_id": hotel_id,
        "type": "double",
        "capacity": 2,
        "price_per_night": 150,
        "available": True
    }
    client.post("/rooms/", json=room_data)
    
    # Create first booking
    check_in = date.today() + timedelta(days=10)
    check_out = check_in + timedelta(days=5)
    
    booking_data = {
        "hotel_id": hotel_id,
        "room_number": "201",
        "guest_name": "Guest 1",
        "guest_email": "guest1@example.com",
        "guest_phone": "+1234567890",
        "check_in": check_in.isoformat(),
        "check_out": check_out.isoformat(),
        "guests": 2
    }
    client.post("/bookings/", json=booking_data)
    
    # Try to create conflicting booking
    conflicting_booking = booking_data.copy()
    conflicting_booking["guest_name"] = "Guest 2"
    conflicting_booking["guest_email"] = "guest2@example.com"
    
    conflict_response = client.post("/bookings/", json=conflicting_booking)
    assert conflict_response.status_code == status.HTTP_400_BAD_REQUEST
    assert "already booked" in conflict_response.json()["detail"]
```

**🎯 Practice:** Create integration tests for:
- Room availability checking
- Guest booking history
- Hotel search workflow
- Cancellation process

---

## 🎯 Activity 5: Mocking External Dependencies (30 minutes)

### Using Mocks in Tests

**🏨 Mocking External Services:**

```python
# tests/test_with_mocks.py
import pytest
from unittest.mock import Mock, patch
from app.services.hotel_service import HotelService

def test_hotel_service_with_mock():
    """Test hotel service with mocked data"""
    # Create mock hotel data
    mock_hotels = [
        {"id": 1, "name": "Mock Hotel", "location": "Mock City", "rating": 4.5, "price": 200}
    ]
    
    # Create service instance
    service = HotelService()
    service.hotels = mock_hotels
    
    # Test search
    results = service.search_hotels("mock", {})
    assert len(results) == 1
    assert results[0]["name"] == "Mock Hotel"

def test_external_api_with_patch(client):
    """Test API with external service patched"""
    with patch('app.services.external_api.fetch_hotel_data') as mock_fetch:
        # Configure mock
        mock_fetch.return_value = [
            {"id": 1, "name": "External Hotel", "location": "External City"}
        ]
        
        # Call endpoint that uses external API
        response = client.get("/hotels/external")
        
        # Verify mock was called
        mock_fetch.assert_called_once()
        
        # Verify response
        assert response.status_code == 200
```

**🎯 Practice:** Mock external dependencies for:
- Payment gateway
- Email service
- SMS notification
- Third-party APIs

---

## 🎯 Activity 6: Running Tests and Coverage (15 minutes)

### Test Execution and Coverage

**🏨 Running Tests:**

```bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_hotels.py

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test
pytest tests/test_hotels.py::test_create_hotel

# Run with markers
pytest -m unit
pytest -m integration

# Run with verbose output
pytest -v

# Stop on first failure
pytest -x
```

**Coverage Report:**
```bash
# Generate coverage report
pytest --cov=app --cov-report=html --cov-report=term

# View coverage in browser
open htmlcov/index.html
```

---

## 🎯 Main Class Activity: Complete Test Suite (60 minutes)

**Task:** Build comprehensive test suite for hotel booking API

**Requirements:**
- Unit tests for all endpoints
- Pydantic model validation tests
- Integration tests for workflows
- Mock external dependencies
- Test coverage > 80%
- Test documentation
- CI/CD ready

**Steps:**
1. Set up testing environment
2. Write hotel endpoint tests
3. Create room endpoint tests
4. Build booking workflow tests
5. Add Pydantic validation tests
6. Implement mocking
7. Run tests and check coverage
8. Document test cases

---

## 🎯 Homework: Complete Testing Suite

### Task 1: Enhanced Test Coverage
- Add edge case tests
- Implement performance tests
- Create load testing
- Add security tests

### Task 2: Test Documentation
- Document test cases
- Add test descriptions
- Create test data fixtures
- Write test guidelines

### Task 3: Preparation for Next Session
**Read before next class:**
- MySQL Documentation: https://dev.mysql.com/doc/
- Database Design: https://www.mysql.com/tutorial/

---

## 🎯 Summary: API Testing for Hotel Booking

**Key Takeaways:**
- **Testing** ensures API reliability
- **Unit tests** validate individual components
- **Integration tests** verify workflows
- **Pydantic tests** ensure data validation
- **Mocking** isolates dependencies
- **Coverage** measures test completeness

**Week 3 Complete!** You now have a complete FastAPI backend with CRUD operations, validation, advanced features, and comprehensive testing.

**Next Week:** We'll integrate MySQL database for persistent hotel booking data storage.
