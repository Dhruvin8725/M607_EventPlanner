EventEase Planner 📅

EventEase Planner is a professional, full-stack event management system. It allows users to browse and RSVP to events while providing a secure administrative panel for organizers to manage event listings with real-time location geocoding via Google Maps.

🚀 Prerequisites

Before you begin, ensure you have the following installed on your machine:

Node.js (LTS): Download Node.js

PostgreSQL: Download PostgreSQL (Ensure pgAdmin 4 is included).

Google Maps API Key: You need a Google Cloud project with the Geocoding API and Maps JavaScript API enabled.

🛠️ Installation & Setup

1. Clone or Download

Extract the project files to your desired directory (e.g., C:\Users\Hammad\Desktop\eventease_planner).

2. Install Dependencies

Open your terminal (Command Prompt, PowerShell, or VS Code Terminal) in the project folder and run:

npm install


3. Environment Configuration (.env)

Create a file named .env in the root directory of the project. Copy and paste the following template into it, replacing the placeholders with your actual credentials:

PORT=3000

# Database Configuration
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=eventease

# Session Security
SESSION_SECRET=a_long_random_string_for_security

# External APIs
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here


🗄️ Database Setup

The project requires a PostgreSQL database. Follow these steps using the DATABASE SQL files:

Open pgAdmin 4 and connect to your local server.

Create a Database: Right-click 'Databases' > 'Create' > 'Database...'. Name it eventease.

Open Query Tool: Right-click the new eventease database and select Query Tool.

Execute Schema: Open the schema.sql file (or the first part of your DATABASE file), paste the code into the Query Tool, and click the Execute button (Play icon). This creates the tables.

Execute Seed Data: Open the seed.sql file (or the second part of your DATABASE file), paste the code into the Query Tool, and click Execute. This adds the sample users and events.

🏃 Running the Application

To start the server in development mode (using nodemon):

npm run dev


The application will be accessible at: http://localhost:3000

🔑 Access Credentials (Seed Data)

Use these accounts to test the different roles:

Administrator Account:

Email: admin@eventease.com

Password: password123

Standard User Account:

Email: user@gmail.com.com

Password: password123

(Note: To promote any registered email to admin, run UPDATE users SET role = 'admin' WHERE email = 'example@gmail.com'; in the Query Tool.)

✨ Features

User System: Secure Registration, Login, and Profile Management.

Search & Discovery: Filter upcoming events by name or location on the homepage.

Interactive Maps: View event locations with dynamic pins via Google Maps API.

RSVP Management: Personalized dashboard for users to track their joined events.

Admin Dashboard: Live site analytics and full CRUD (Create, Read, Update, Delete) for events.

Automatic Geocoding: Admins enter an address, and the backend automatically fetches coordinates via Google Geocoding API.
