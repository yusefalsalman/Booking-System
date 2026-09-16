# LuxeStay — Hotel Booking Web App

A full-stack hotel booking web application where customers can browse and reserve rooms, and admins can manage hotel inventory.

---

## 🌟 Features

- **User Authentication**: Secure signup and login with JWT tokens and BCrypt password hashing.
- **Role-Based Access**:
  - **Customers**: Browse rooms, check availability, and book stays with instant price calculation.
  - **Admins**: Access a dedicated Admin Console to publish and delete hotel suites.
- **Smart Reservation Logic**: Automatically validates dates and prevents double-booking on overlapping dates.
- **Responsive Luxury UI**: Modern dark-mode interface styled with Tailwind CSS, glassmorphism, custom confirmation dialogs, and mobile navigation.

---

## 🛠️ Tech Stack

- **Backend**: ASP.NET Core (.NET 10) Web API, C#
- **Database & ORM**: Microsoft SQL Server, Entity Framework Core (Code-First)
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **API Communication**: Axios with automatic Bearer Token interceptor
- **Documentation**: Swagger / OpenAPI with Bearer Authorization support

---

## 🚀 Getting Started

### 1. Run the Backend (API)

```powershell
# Navigate to the API folder
cd Booking.Api

# Update database schema
dotnet ef database update

# Run the API server (runs on http://localhost:5079)
dotnet run
```

- Swagger documentation available at: `http://localhost:5079`

### 2. Run the Frontend (Client)

```powershell
# Navigate to the client folder
cd booking-client

# Install dependencies
npm install

# Start the Vite development server (runs on http://localhost:5173)
npm run dev
```

---

## 👤 Author

**Yousef Salman**

- Student in Artificial Intelligence, Tafila Technical University (TTU)
- Full-Stack .NET & React Developer
