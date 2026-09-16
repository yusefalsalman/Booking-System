Master Index & Project Roadmap

Module 1: Foundations & Web API Setup [DONE]
Project setup & configuration (Program.cs, appsettings.json)
Dependency Injection configuration
Swagger UI setup & routing
Initial SQL Server LocalDB connection

Module 2: EF Core CRUD with Async/Await [DONE]
Register BookingDbContext in DI
Async operations (ToListAsync(), FindAsync(), SaveChangesAsync())
Full CRUD in RoomsController
Understanding SQL Server IDENTITY auto-generated IDs

Module 3: Request/Response DTOs & Validation [DONE]
Data Annotations on incoming requests ([Required], [Range], [StringLength])
Automatic validation handled by [ApiController]
RoomResponse DTO to shield raw database entities

Module 4: Code-First & EF Core Migrations [DONE]
CLI tooling (dotnet-ef)
Generated first migration (InitialCreate)
Database created and updated from code (dotnet ef database update)

Module 5: Domain Modeling & Database Relationships [DONE]
Built the Booking entity (Id, CustomerName, CheckInDate, CheckOutDate, TotalPrice, RoomId)
Configured the One-to-Many relationship (One Room
→
→ Many Bookings)
Applied migration with Foreign Key constraints (FK_Bookings_Rooms_RoomId)
Understood Eager Loading with .Include()

Module 6: Architecture & Business Logic (Service Layer) [DONE]
6.1: Why "Fat Controllers" are an anti-pattern.
6.2: Design the Service Interfaces (IRoomService, IBookingService).
6.3: Implement the business rules (e.g., cannot book checkout date before checkin date, cannot double-book a room).
6.4: Register services in DI (builder.Services.AddScoped<...>).
6.5: Global Exception Handling Middleware (clean JSON error responses for unexpected crashes).

Module 7: Authentication & Authorization (JWT) [DONE]
7.1: ASP.NET Core Identity (Users, Passwords, Roles).
7.2: JSON Web Tokens (JWT) generation and validation.
7.3: Protect endpoints with [Authorize] and role-based policies.

Module 8: Full-Stack Integration (React + .NET) [DONE]
8.1: Enable CORS (Cross-Origin Resource Sharing) in .NET.
8.2: Connect your React application to consume the API.
8.3: Manage JWT tokens and protected routes in the frontend.

Frontend Folder Structure:

src/
├── api/
│ └── axiosClient.ts <-- Axios instance with auto Bearer Token interceptor
├── services/
│ ├── authService.ts <-- login(), register(), logout()
│ ├── roomService.ts <-- getRooms(), createRoom(), deleteRoom()
│ └── bookingService.ts <-- getBookings(), createBooking()
├── context/
│ └── AuthContext.tsx <-- Global user state (token, role, login, logout)
├── components/
│ ├── Navbar.tsx
│ └── ProtectedRoute.tsx <-- Restricts Admin pages to users with Role === "Admin"
├── pages/
│ ├── HomePage.tsx <-- Browse available rooms & book
│ ├── LoginPage.tsx
│ ├── RegisterPage.tsx
│ └── AdminDashboard.tsx <-- Add/manage rooms (Admin only)
