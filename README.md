# Car Rent Agency Platform

A modern, full-stack car rental management system designed for agencies and customers. This platform provides a seamless 3-pane dashboard experience with real-time map integration, persistent favorites, and a robust booking engine.

## Key Features

- **Dashboard Experience**: A clean, modern 3-pane UI for browsing vehicles with integrated map location views and quick action controls.
- **Dynamic Filtering**: Browse and filter the fleet based on seating capacity (2, 4, 5, 7 seats) and price ranges.
- **Smart Favorites**: Persistent "heart" features that allow users to save vehicles to a dedicated favorites page using local storage.
- **Dual Portal System**:
  - **Customers**: Can browse, save favorites, and book vehicles for specific dates and durations.
  - **Agencies**: Comprehensive management dashboard to add/edit vehicles, monitor fleet availability, and track customer booking logs.
- **High-Performance Visuals**: Premium home experience featuring high-resolution video backgrounds and elevated Inter typography.
- **JWT Authentication**: Secure login and registration flows with distinct permission tiers for agencies and riders.

## Technical Architecture

This platform is built using a modern decoupled architecture for scalability and performance.

- **Frontend**: Next.js (React) with Tailwind CSS for high-fidelity responsive design.
- **State Management**: Built-in React hooks and persistent client-side storage for user preferences.
- **Database**: MySQL/MariaDB for structured data persistence (Users, Cars, Bookings).
- **Icons & UI**: Lucide React for consistent, high-end iconography.

## Setup & Deployment

### 1. Configure Environment
Create a `.env` file in the root directory. You will need a MySQL instance and the connection details:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=carrent
KAFKA_URL=your_kafka_url
```

### 2. Database Setup
Initialize your database by executing the provided `DATABASE_SCHEMA.sql` script. This handles the creation of tables for `users`, `cars`, `bookings`, and `sessions`.

### 3. Installation
```bash
npm install
```

### 4. Development & Build
```bash
# Run locally
npm run dev

# Build for production
npm run build
```

The application will be accessible at `http://localhost:3000`.
