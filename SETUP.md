# CarRent - Car Rental Platform Setup Guide

## Overview
CarRent is a full-stack car rental platform with separate user flows for customers and rental agencies. The frontend is built with Next.js/React, and the backend is ready for integration with your local MySQL database.

## Features

### Customer Features
- Register and login to customer account
- Browse available rental cars with details (model, seating, daily rate)
- Select rental dates and duration
- Book cars with instant confirmation
- View all past and current bookings
- See booking details including total cost

### Agency Features
- Register and login to agency account
- Add new rental vehicles to inventory
- Edit vehicle details (model, number, seating, price)
- Delete vehicles
- View all customer bookings for their vehicles
- Manage inventory and availability

## Project Structure

```
/app
  /api/auth          - Authentication endpoints
  /api/cars          - Car management endpoints
  /api/bookings      - Booking management endpoints
  /agency            - Agency-specific pages
  /customer          - Customer-specific pages
  /booking           - Booking confirmation page
  page.tsx           - Home page with available cars listing
  layout.tsx         - Root layout

/components
  login-form.tsx     - Login form component
  register-form.tsx  - Registration form component
  cars-listing.tsx   - Cars browsing component
  agency-cars-manager.tsx - Agency car management
  agency-bookings.tsx - Agency bookings view
  customer-bookings.tsx - Customer bookings view
  navbar.tsx         - Navigation component

/lib
  auth-context.tsx   - Authentication context provider

DATABASE_SCHEMA.sql  - MySQL schema (ready to use)
```

## Database Setup

### Step 1: Create MySQL Database
Run the following SQL to set up your database:

```bash
mysql -u root -p < DATABASE_SCHEMA.sql
```

Or if you have a MySQL client:
```sql
SOURCE /path/to/DATABASE_SCHEMA.sql;
```

### Step 2: Database Schema Overview

The system uses 4 main tables:

1. **users** - Stores customer and agency accounts
2. **cars** - Stores vehicle inventory (belongs to agencies)
3. **bookings** - Stores rental bookings (connects customers and cars)
4. **sessions** - Stores authentication sessions

See `DATABASE_SCHEMA.sql` for full schema details.

## Backend Integration - What You Need to Do

The API endpoints are ready but need database connection. Complete these steps:

### 1. Database Connection Setup
In your Next.js API routes, add database connection code:

```typescript
// Example - install mysql2/promise or similar
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'carrent',
  waitForConnections: true,
  connectionLimit: 10,
});
```

### 2. Authentication Implementation
In `/app/api/auth/` routes:

- **register**: Hash password with bcrypt, insert user, create session
- **login**: Verify password, create session, set HTTP-only cookie
- **logout**: Clear session and cookie
- **me**: Verify session token and return user data

### 3. Car Management Implementation
In `/app/api/cars/` routes:

- **GET /api/cars**: Return all available cars
- **POST /api/cars**: Insert new car (verify agency ownership)
- **PUT /api/cars/[id]**: Update car details (verify ownership)
- **DELETE /api/cars/[id]**: Delete car (verify ownership)

### 4. Booking Implementation
In `/app/api/bookings/` routes:

- **GET /api/bookings**: Return user's bookings (based on user type)
- **POST /api/bookings**: Create booking, check availability, calculate price

### 5. Authentication Context
The `useAuth()` hook in `/lib/auth-context.tsx` handles:
- Login/Register/Logout
- User state management
- Session persistence

## Development Workflow

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Test the UI** - All pages work without database (using mock data)

3. **Implement each API endpoint** - Replace mock responses with database queries

4. **Test thoroughly** - Register accounts, create cars, make bookings

## API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login and get session
- `POST /api/auth/logout` - Logout and clear session
- `GET /api/auth/me` - Get current user data

### Cars
- `GET /api/cars` - List all available cars
- `POST /api/cars` - Add new car (agency only)
- `PUT /api/cars/[id]` - Update car (agency only)
- `DELETE /api/cars/[id]` - Delete car (agency only)

### Bookings
- `GET /api/bookings` - Get user's bookings
- `POST /api/bookings` - Create booking (customer only)

## Security Considerations

1. **Password Hashing**: Use bcrypt to hash passwords before storing
2. **Session Management**: Use secure HTTP-only cookies
3. **Authorization**: Verify user type and ownership before operations
4. **Input Validation**: Validate all form inputs and API data
5. **SQL Injection**: Use parameterized queries
6. **CORS**: Configure CORS for your API endpoints

## Testing Users (After DB Setup)

Use the sample data in `DATABASE_SCHEMA.sql`:

**Customer Account:**
- Email: customer@example.com
- Type: Customer

**Agency Account:**
- Email: agency@example.com
- Type: Agency

*Note: Change these passwords after initial setup!*

## Customization

### Colors and Theme
- Primary: Blue (#4361ee)
- Accent: Gold (#f2a900)
- Update in `/app/globals.css`

### Database Configuration
- Modify database connection in your API routes
- Update table names if needed
- Add additional fields as required

### UI Components
- Built with shadcn/ui + Tailwind CSS
- Fully responsive (mobile, tablet, desktop)
- Easy to customize with Tailwind classes

## Next Steps

1. Set up MySQL database locally
2. Install dependencies: `npm install`
3. Implement database connection in API routes
4. Test each endpoint with Postman or similar
5. Deploy when ready!

## Troubleshooting

**Q: API returns "Not authenticated"?**
A: Implement session verification in `/api/auth/me` route

**Q: Can't create bookings?**
A: Verify user is logged in as customer and implement booking logic

**Q: Database connection errors?**
A: Check MySQL is running and credentials are correct

## Support

For questions or issues, review the comments in each API route file for implementation guidance.
