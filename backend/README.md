# Student Room Rental Backend

Backend API for a student room rental application built with Node.js and Express.

## Features

- RESTful API endpoints for room management
- MySQL database integration
- CORS enabled for frontend integration
- Error handling middleware
- Environment variable configuration

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=rooms_db
   PORT=3000
   ```

4. Create the database and tables:
   - Open MySQL command line or workbench
   - Run the SQL commands from `db/schema.sql`

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Rooms

- `GET /api/rooms` - Get all rooms with their images and utilities
- `GET /api/rooms/:id` - Get a specific room by ID
- `POST /api/rooms` - Create a new room
- `DELETE /api/rooms/:id` - Delete a room

## Example Room Object

```json
{
  "title": "Cozy Studio Near Campus",
  "description": "Modern studio apartment with all utilities included",
  "price": 500.00,
  "location": "123 University Ave",
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  "utilities": ["WiFi", "Kitchen", "Washer"]
}
```

## Error Handling

The API uses a centralized error handling middleware that returns appropriate HTTP status codes and error messages in JSON format.

## Security

- SQL injection prevention using parameterized queries
- CORS enabled for frontend integration
- Environment variables for sensitive data 