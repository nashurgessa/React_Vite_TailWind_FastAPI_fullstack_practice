# Day 20: Full Integration & Deployment

## 🎯 Objectives (4 Hours)

By the end of this 4-hour session, you should be able to:

- Integrate all components into complete system
- Test end-to-end hotel booking flow
- Deploy FastAPI backend to production
- Deploy React frontend to production
- Configure environment variables
- Set up monitoring and logging
- Document deployment process

---

## 🏨 Full Integration & Deployment

**Full integration** combines all components (React frontend, FastAPI backend, MySQL database) into a production-ready hotel booking system.

**Integration Components:**
- **Frontend**: React application with Vite
- **Backend**: FastAPI with SQLAlchemy
- **Database**: MySQL with proper schema
- **Deployment**: Production environment setup
- **Monitoring**: System health and performance
- **Documentation**: Setup and maintenance guides

---

## 🎯 Activity 1: Environment Configuration (30 minutes)

### Setting Up Environment Variables

**🏨 Environment Configuration:**

**Backend (.env):**
```env
# Database
DATABASE_URL=mysql+pymysql://user:password@localhost:3306/hotel_booking

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=False

# CORS
ALLOWED_ORIGINS=http://localhost:5173,https://your-frontend-domain.com

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Hotel Booking System
```

**Production (.env.production):**
```env
VITE_API_URL=https://your-api-domain.com
VITE_APP_NAME=Hotel Booking System
```

**🎯 Practice:** Configure environments for:
- Development
- Staging
- Production
- Testing

---

## 🎯 Activity 2: Backend Deployment (45 minutes)

### Deploying FastAPI Backend

**🏨 Backend Deployment:**

**Create requirements.txt:**
```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
pymysql==1.1.0
python-dotenv==1.0.0
pydantic==2.5.0
python-multipart==0.0.6
alembic==1.12.1
```

**Create Dockerfile for Backend:**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Create docker-compose.yml:**
```yaml
version: '3.8'

services:
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: hotel_booking
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=mysql+pymysql://root:rootpassword@db:3306/hotel_booking
    depends_on:
      - db
    volumes:
      - ./backend:/app

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend

volumes:
  mysql_data:
```

**Deploy to Cloud (Render/Heroku/Railway):**

```bash
# Install gunicorn for production
pip install gunicorn

# Run with gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

**🎯 Practice:** Deploy backend to:
- Render
- Railway
- Heroku
- AWS EC2

---

## 🎯 Activity 3: Frontend Deployment (30 minutes)

### Deploying React Frontend

**🏨 Frontend Deployment:**

**Create Dockerfile for Frontend:**
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**Create nginx.conf:**
```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Build for Production:**
```bash
npm run build
```

**Deploy to Vercel:**
```bash
npm install -g vercel
vercel
```

**Deploy to Netlify:**
```bash
npm run build
netlify deploy --prod --dir=dist
```

**🎯 Practice:** Deploy frontend to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

---

## 🎯 Activity 4: End-to-End Testing (45 minutes)

### Testing Complete System

**🏨 End-to-End Test Scenarios:**

```typescript
// tests/e2e/booking-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Hotel Booking Flow', () => {
  test('Complete booking flow', async ({ page }) => {
    // Navigate to home page
    await page.goto('http://localhost:5173');
    
    // Search for hotels
    await page.fill('input[placeholder="Search hotels..."]', 'New York');
    await page.click('button:has-text("Search")');
    
    // Wait for results
    await page.waitForSelector('.hotel-card');
    
    // Select a hotel
    await page.click('.hotel-card:first-child button:has-text("View Details")');
    
    // Wait for hotel detail page
    await page.waitForSelector('.hotel-detail');
    
    // Select room
    await page.click('.room-card:first-child button:has-text("Select Room")');
    
    // Fill booking form
    await page.fill('input[name="guest_name"]', 'John Doe');
    await page.fill('input[name="guest_email"]', 'john@example.com');
    await page.fill('input[name="guest_phone"]', '+1234567890');
    
    // Select dates
    const checkInDate = new Date();
    checkInDate.setDate(checkInDate.getDate() + 7);
    const checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkOutDate.getDate() + 3);
    
    await page.fill('input[name="check_in"]', checkInDate.toISOString().split('T')[0]);
    await page.fill('input[name="check_out"]', checkOutDate.toISOString().split('T')[0]);
    
    // Submit booking
    await page.click('button[type="submit"]');
    
    // Verify booking confirmation
    await page.waitForSelector('.booking-confirmation');
    await expect(page.locator('.booking-confirmation')).toBeVisible();
    await expect(page.locator('.booking-confirmation')).toContainText('Booking Confirmed');
  });

  test('Hotel search and filtering', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Apply filters
    await page.selectOption('select[name="location"]', 'new-york');
    await page.fill('input[name="max_price"]', '200');
    await page.click('button:has-text("Apply Filters")');
    
    // Verify filtered results
    await page.waitForSelector('.hotel-card');
    const hotelCards = await page.locator('.hotel-card').count();
    expect(hotelCards).toBeGreaterThan(0);
  });
});
```

**🎯 Practice:** Create E2E tests for:
- User registration
- Booking modification
- Cancellation flow
- Payment processing

---

## 🎯 Activity 5: Monitoring and Logging (30 minutes)

### Setting Up System Monitoring

**🏨 Monitoring Setup:**

**Backend Logging:**
```python
# app/main.py
import logging
from fastapi import FastAPI

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

app = FastAPI()

@app.get("/")
def read_root():
    logger.info("Root endpoint accessed")
    return {"message": "Hotel Booking API"}
```

**Health Check Endpoint:**
```python
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "timestamp": datetime.now().isoformat()
    }
```

**Frontend Error Tracking:**
```typescript
// src/utils/errorTracking.ts
export function trackError(error: Error, context?: any) {
  // Send to error tracking service
  console.error('Error tracked:', error, context);
  
  // In production, send to Sentry or similar service
  if (import.meta.env.PROD) {
    // Sentry.captureException(error, { extra: context });
  }
}

// Error boundary
export class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: any) {
    trackError(error, errorInfo);
  }
}
```

**🎯 Practice:** Add monitoring for:
- API response times
- Database query performance
- Error rates
- User analytics

---

## 🎯 Activity 6: Documentation (30 minutes)

### Creating System Documentation

**🏨 Documentation Structure:**

**README.md:**
```markdown
# Hotel Booking System

Complete hotel room booking service with React frontend and FastAPI backend.

## Features
- Hotel search and filtering
- Room availability checking
- Booking management
- Guest profiles
- Payment processing

## Tech Stack
- Frontend: React, TypeScript, Vite
- Backend: FastAPI, SQLAlchemy
- Database: MySQL

## Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Deployment
See DEPLOYMENT.md for detailed deployment instructions.
```

**DEPLOYMENT.md:**
```markdown
# Deployment Guide

## Prerequisites
- Docker and Docker Compose
- Cloud provider account (Render/Vercel)
- MySQL database

## Backend Deployment
1. Push code to GitHub
2. Connect to Render/Railway
3. Configure environment variables
4. Deploy

## Frontend Deployment
1. Build production bundle
2. Deploy to Vercel/Netlify
3. Configure environment variables
4. Connect to backend API

## Database Setup
1. Create MySQL instance
2. Run migration scripts
3. Populate initial data
```

**API_DOCUMENTATION.md:**
```markdown
# API Documentation

## Base URL
- Development: http://localhost:8000
- Production: https://your-api-domain.com

## Endpoints

### Hotels
- GET /hotels - Get all hotels
- GET /hotels/{id} - Get hotel by ID
- POST /hotels - Create hotel (admin)
- PUT /hotels/{id} - Update hotel (admin)
- DELETE /hotels/{id} - Delete hotel (admin)

### Bookings
- GET /bookings - Get all bookings
- POST /bookings - Create booking
- PUT /bookings/{id} - Update booking
- DELETE /bookings/{id} - Cancel booking
```

**🎯 Practice:** Create documentation for:
- API reference
- User guide
- Admin guide
- Troubleshooting

---

## 🎯 Main Class Activity: Complete System Integration (60 minutes)

**Task:** Integrate and deploy complete hotel booking system

**Requirements:**
- Environment configuration
- Backend deployment
- Frontend deployment
- End-to-end testing
- Monitoring setup
- Documentation
- Production readiness

**Steps:**
1. Configure environment variables
2. Deploy backend to cloud
3. Deploy frontend to cloud
4. Connect frontend to backend
5. Run end-to-end tests
6. Set up monitoring
7. Create documentation
8. Verify complete system

---

## 🎯 Homework: Complete Deployment

### Task 1: Production Optimization
- Add CDN for static assets
- Implement caching strategies
- Optimize database queries
- Add load balancing

### Task 2: Security Hardening
- Implement HTTPS
- Add rate limiting
- Secure environment variables
- Add authentication

### Task 3: Maintenance Planning
- Create backup procedures
- Set up automated testing
- Plan scaling strategy
- Document maintenance tasks

---

## 🎯 Course Completion Summary

### 🎉 Congratulations!

You have successfully completed the **Hotel Room Booking Service** course!

### What You've Built:

**Week 1: Front-end Fundamentals**
- JavaScript ES6+ for hotel data
- TypeScript types and interfaces
- DOM manipulation for hotel UI
- API integration and data fetching
- Vite setup and project architecture

**Week 2: React Development**
- React components for hotel booking
- State management for booking data
- React hooks for hotel operations
- Forms and booking implementation
- React Router for navigation

**Week 3: FastAPI Backend**
- FastAPI setup and hotel API
- Pydantic models for validation
- CRUD operations for hotels
- Advanced API features and search
- API testing and integration

**Week 4: Database Integration**
- MySQL setup and database design
- SQLAlchemy ORM for hotel models
- Database operations and persistence
- React-FastAPI integration
- Full system deployment

### 🏨 Your Complete Hotel Booking System Includes:

- **Frontend**: Modern React application with TypeScript
- **Backend**: FastAPI with comprehensive API
- **Database**: MySQL with proper schema
- **Features**: Search, booking, guest management
- **Deployment**: Production-ready system
- **Testing**: Comprehensive test coverage

### 🚀 Next Steps:

1. **Enhance Features**: Add more hotel booking features
2. **Scale**: Handle more users and bookings
3. **Optimize**: Improve performance and user experience
4. **Monitor**: Track system health and analytics
5. **Iterate**: Continuously improve based on feedback

### 📚 Resources for Continued Learning:

- React Documentation: https://react.dev/
- FastAPI Documentation: https://fastapi.tiangolo.com/
- SQLAlchemy Documentation: https://docs.sqlalchemy.org/
- MySQL Documentation: https://dev.mysql.com/doc/

---

## 🎯 Summary: Full Integration & Deployment

**Key Takeaways:**
- **Environment configuration** manages different deployment stages
- **Docker** simplifies deployment and scaling
- **Cloud platforms** provide hosting solutions
- **E2E testing** ensures system reliability
- **Monitoring** tracks system health
- **Documentation** enables maintenance

**Course Complete!** You now have a production-ready hotel booking system with modern full-stack development skills.
