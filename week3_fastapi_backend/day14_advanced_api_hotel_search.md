# Day 14: Advanced API Features & Hotel Search

## 🎯 Objectives (4 Hours)

By the end of this 4-hour session, you should be able to:

- Implement advanced search functionality for hotels
- Add pagination to API responses
- Implement sorting and ordering
- Add filtering with multiple criteria
- Use dependency injection for services
- Implement caching for performance
- Add CORS and security features

---

## 🏨 Advanced API Features for Hotel Booking

**Advanced features** enhance the hotel booking API with better performance, usability, and security.

**Key Advanced Features:**
- **Search**: Full-text search for hotels
- **Pagination**: Handle large datasets efficiently
- **Sorting**: Order results by various criteria
- **Filtering**: Complex multi-criteria filtering
- **Caching**: Improve response times
- **Security**: CORS, authentication, rate limiting

---

## 🎯 Activity 1: Advanced Hotel Search (60 minutes)

### Implementing Hotel Search Functionality

**🏨 Advanced Search Endpoint:**

```python
# app/routers/hotels.py
from fastapi import APIRouter, Query, Depends
from typing import List, Optional
from pydantic import BaseModel

router = APIRouter(prefix="/hotels", tags=["hotels"])

class SearchFilters(BaseModel):
    """Search filters model"""
    location: Optional[str] = None
    min_rating: Optional[float] = None
    max_rating: Optional[float] = None
    min_price: Optional[int] = None
    max_price: Optional[int] = None
    amenities: Optional[List[str]] = None
    available_only: bool = False

@router.get("/search")
def search_hotels(
    q: Optional[str] = Query(None, description="Search query"),
    location: Optional[str] = Query(None, description="Filter by location"),
    min_rating: Optional[float] = Query(None, ge=0, le=5, description="Minimum rating"),
    max_rating: Optional[float] = Query(None, ge=0, le=5, description="Maximum rating"),
    min_price: Optional[int] = Query(None, gt=0, description="Minimum price"),
    max_price: Optional[int] = Query(None, gt=0, description="Maximum price"),
    amenities: Optional[str] = Query(None, description="Comma-separated amenities"),
    available_only: bool = Query(False, description="Show only available hotels")
):
    """Advanced hotel search with multiple filters"""
    results = hotels_db
    
    # Text search
    if q:
        q_lower = q.lower()
        results = [
            h for h in results 
            if q_lower in h["name"].lower() or 
               q_lower in h["location"].lower() or
               q_lower in h["description"].lower() if h.get("description") else False
        ]
    
    # Location filter
    if location:
        results = [h for h in results if location.lower() in h["location"].lower()]
    
    # Rating range filter
    if min_rating:
        results = [h for h in results if h["rating"] >= min_rating]
    if max_rating:
        results = [h for h in results if h["rating"] <= max_rating]
    
    # Price range filter
    if min_price:
        results = [h for h in results if h["price"] >= min_price]
    if max_price:
        results = [h for h in results if h["price"] <= max_price]
    
    # Amenities filter
    if amenities:
        amenity_list = [a.strip().lower() for a in amenities.split(',')]
        results = [
            h for h in results 
            if all(amenity.lower() in [a.lower() for a in h["amenities"]] for amenity in amenity_list)
        ]
    
    # Availability filter
    if available_only:
        results = [h for h in results if h["available"]]
    
    return {
        "results": results,
        "count": len(results),
        "filters_applied": {
            "query": q,
            "location": location,
            "rating_range": f"{min_rating or 0}-{max_rating or 5}",
            "price_range": f"${min_price or 0}-${max_price or '∞'}",
            "amenities": amenities,
            "available_only": available_only
        }
    }

@router.get("/search/suggestions")
def search_suggestions(q: str = Query(..., min_length=2, description="Search query")):
    """Get search suggestions for autocomplete"""
    q_lower = q.lower()
    suggestions = []
    
    for hotel in hotels_db:
        # Name suggestions
        if q_lower in hotel["name"].lower():
            suggestions.append({
                "type": "hotel",
                "text": hotel["name"],
                "category": "Hotel Name"
            })
        
        # Location suggestions
        if q_lower in hotel["location"].lower():
            suggestions.append({
                "type": "location",
                "text": hotel["location"],
                "category": "Location"
            })
    
    # Remove duplicates and limit
    seen = set()
    unique_suggestions = []
    for suggestion in suggestions:
        key = (suggestion["text"], suggestion["category"])
        if key not in seen:
            seen.add(key)
            unique_suggestions.append(suggestion)
    
    return {"suggestions": unique_suggestions[:10]}
```

**🎯 Practice:** Implement search for:
- Room availability by date
- Guest booking history
- Hotel reviews
- Promotional offers

---

## 🎯 Activity 2: Pagination (45 minutes)

### Implementing Pagination

**🏨 Pagination for Hotel Lists:**

```python
from pydantic import BaseModel

class PaginationParams(BaseModel):
    """Pagination parameters"""
    page: int = Query(1, ge=1, description="Page number")
    page_size: int = Query(10, ge=1, le=100, description="Items per page")

class PaginatedResponse(BaseModel):
    """Paginated response model"""
    items: List
    total: int
    page: int
    page_size: int
    total_pages: int
    has_next: bool
    has_previous: bool

def paginate(items: List, page: int, page_size: int) -> dict:
    """Paginate a list of items"""
    total = len(items)
    total_pages = (total + page_size - 1) // page_size
    start = (page - 1) * page_size
    end = start + page_size
    
    paginated_items = items[start:end]
    
    return {
        "items": paginated_items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
        "has_next": page < total_pages,
        "has_previous": page > 1
    }

@router.get("/", response_model=PaginatedResponse)
def get_hotels_paginated(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    location: Optional[str] = None
):
    """Get hotels with pagination"""
    filtered = hotels_db
    
    if location:
        filtered = [h for h in filtered if location.lower() in h["location"].lower()]
    
    paginated_data = paginate(filtered, page, page_size)
    return paginated_data
```

**🎯 Practice:** Add pagination for:
- Room listings
- Booking history
- Guest profiles
- Review lists

---

## 🎯 Activity 3: Sorting and Ordering (30 minutes)

### Implementing Sorting

**🏨 Hotel Sorting:**

```python
from enum import Enum

class SortBy(str, Enum):
    """Sort options"""
    NAME = "name"
    PRICE = "price"
    RATING = "rating"
    LOCATION = "location"

class SortOrder(str, Enum):
    """Sort order"""
    ASC = "asc"
    DESC = "desc"

@router.get("/")
def get_hotels_sorted(
    sort_by: SortBy = Query(SortBy.NAME, description="Sort by field"),
    sort_order: SortOrder = Query(SortOrder.ASC, description="Sort order")
):
    """Get hotels with sorting"""
    sorted_hotels = hotels_db.copy()
    
    reverse = sort_order == SortOrder.DESC
    
    if sort_by == SortBy.NAME:
        sorted_hotels.sort(key=lambda x: x["name"], reverse=reverse)
    elif sort_by == SortBy.PRICE:
        sorted_hotels.sort(key=lambda x: x["price"], reverse=reverse)
    elif sort_by == SortBy.RATING:
        sorted_hotels.sort(key=lambda x: x["rating"], reverse=reverse)
    elif sort_by == SortBy.LOCATION:
        sorted_hotels.sort(key=lambda x: x["location"], reverse=reverse)
    
    return {
        "hotels": sorted_hotels,
        "sort_by": sort_by,
        "sort_order": sort_order
    }
```

**🎯 Practice:** Add sorting for:
- Room prices
- Booking dates
- Guest names
- Review ratings

---

## 🎯 Activity 4: Dependency Injection (30 minutes)

### Using Dependency Injection

**🏨 Service Layer with Dependency Injection:**

```python
# app/services/hotel_service.py
from typing import List, Optional

class HotelService:
    """Hotel business logic service"""
    
    def __init__(self):
        self.hotels = hotels_db
    
    def search_hotels(self, query: str, filters: dict) -> List[dict]:
        """Search hotels with business logic"""
        results = self.hotels
        
        # Apply search logic
        if query:
            results = [h for h in results if query.lower() in h["name"].lower()]
        
        # Apply filters
        for key, value in filters.items():
            if value is not None:
                results = [h for h in results if h.get(key) == value]
        
        return results
    
    def calculate_average_price(self, hotel_id: int) -> float:
        """Calculate average price for hotel"""
        hotel = next((h for h in self.hotels if h["id"] == hotel_id), None)
        if not hotel:
            return 0
        return hotel["price"]
    
    def get_hotel_recommendations(self, guest_preferences: dict) -> List[dict]:
        """Get hotel recommendations based on preferences"""
        # Business logic for recommendations
        return self.hotels[:5]

# In router
from fastapi import Depends

def get_hotel_service():
    """Dependency injection for hotel service"""
    return HotelService()

@router.get("/recommendations")
def get_recommendations(
    service: HotelService = Depends(get_hotel_service),
    min_rating: float = Query(4.0),
    max_price: int = Query(300)
):
    """Get hotel recommendations"""
    recommendations = service.get_hotel_recommendations({
        "min_rating": min_rating,
        "max_price": max_price
    })
    return {"recommendations": recommendations}
```

**🎯 Practice:** Create services for:
- Booking management
- Room availability
- Guest management
- Price calculation

---

## 🎯 Activity 5: Caching (30 minutes)

### Implementing Caching

**🏨 Simple Caching:**

```python
from functools import lru_cache
from datetime import datetime, timedelta
import time

class CacheManager:
    """Simple cache manager"""
    
    def __init__(self):
        self.cache = {}
        self.expiry_times = {}
    
    def get(self, key: str):
        """Get value from cache"""
        if key in self.cache:
            if datetime.now() < self.expiry_times.get(key, datetime.min):
                return self.cache[key]
            else:
                # Expired
                del self.cache[key]
                del self.expiry_times[key]
        return None
    
    def set(self, key: str, value, ttl_seconds: int = 300):
        """Set value in cache with TTL"""
        self.cache[key] = value
        self.expiry_times[key] = datetime.now() + timedelta(seconds=ttl_seconds)
    
    def clear(self):
        """Clear all cache"""
        self.cache.clear()
        self.expiry_times.clear()

cache = CacheManager()

@router.get("/hotels/cached")
def get_hotels_cached():
    """Get hotels with caching"""
    cache_key = "all_hotels"
    cached_data = cache.get(cache_key)
    
    if cached_data:
        return {"data": cached_data, "cached": True}
    
    # Cache miss - fetch data
    data = hotels_db
    cache.set(cache_key, data, ttl_seconds=300)  # 5 minutes
    
    return {"data": data, "cached": False}

@router.post("/cache/clear")
def clear_cache():
    """Clear cache"""
    cache.clear()
    return {"message": "Cache cleared"}
```

**🎯 Practice:** Add caching for:
- Hotel search results
- Room availability
- Guest profiles
- Booking statistics

---

## 🎯 Activity 6: CORS and Security (30 minutes)

### Adding CORS and Security Features

**🏨 CORS Configuration:**

```python
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Hotel Booking API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security headers middleware
@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response
```

**🎯 Practice:** Add security for:
- Rate limiting
- API key authentication
- Request validation
- Response headers

---

## 🎯 Main Class Activity: Advanced Hotel Search API (60 minutes)

**Task:** Build advanced hotel search with all features

**Requirements:**
- Advanced search with multiple filters
- Pagination for large datasets
- Sorting and ordering
- Dependency injection
- Caching for performance
- CORS configuration
- Security headers

**Steps:**
1. Implement advanced search endpoint
2. Add pagination to hotel listings
3. Implement sorting options
4. Create service layer
5. Add caching
6. Configure CORS
7. Add security middleware
8. Test all features

---

## 🎯 Homework: Complete Advanced Features

### Task 1: Enhanced Search
- Add fuzzy search
- Implement search highlighting
- Add search analytics
- Create search history

### Task 2: Performance Optimization
- Add database indexing
- Implement query optimization
- Add response compression
- Create CDN integration

### Task 3: Preparation for Next Session
**Read before next class:**
- API Testing: https://fastapi.tiangolo.com/tutorial/testing/
- Pytest Documentation: https://docs.pytest.org/

---

## 🎯 Summary: Advanced API Features

**Key Takeaways:**
- **Advanced search** improves hotel discovery
- **Pagination** handles large datasets efficiently
- **Sorting** provides flexible ordering
- **Dependency injection** improves code organization
- **Caching** enhances performance
- **CORS** enables frontend integration

**Next Session:** We'll implement comprehensive API testing and service integration.
