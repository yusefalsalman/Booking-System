using System.Text;
using Booking.Api.Data;
using Booking.Api.Middlewares; // Import the namespace for the GlobalExceptionMiddleware class
using Booking.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore; // use SQL Server provider for Entity Framework Core
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;

// create the WebApplicationBuilder instance, which is used to configure the application and its services
var builder = WebApplication.CreateBuilder(args);


// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("BookingDb")
    ?? throw new InvalidOperationException("Connection string 'BookingDb' not found.");


/*------------------------------ Builder services ------------------------------*/

// Configure the DbContext to use SQL Server with the specified connection string
builder.Services.AddDbContext<BookingDbContext>(options => options.UseNpgsql(connectionString));

// Add controllers to the service collection, enabling the application to handle HTTP requests and route them to the appropriate controller actions
builder.Services.AddControllers();

//  Swagger Configuration
// Makes API endpoints discoverable by Swagger
builder.Services.AddEndpointsApiExplorer();

// Generates the Swagger document
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Description = "Enter your JWT token directly here."
    });

    options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
    {
        [new OpenApiSecuritySchemeReference("Bearer", document)] = []
    });
});

// Add CORS policy to allow requests from any origin, method, and header. This is useful for enabling cross-origin requests from different domains or ports.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "https://yousefbookingsystem.netlify.app"
              )
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Add the IRoomService interface and its implementation RoomService to the service collection, allowing for dependency injection of the service into controllers or other services
builder.Services.AddScoped<IRoomService, RoomService>();
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddScoped<IAuthService, AuthService>();
/* ------------------------------ === Builder services === ------------------------------*/

// Configure JWT authentication
var jwtSettings = builder.Configuration.GetSection("Jwt");
var secretKey = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        ClockSkew = TimeSpan.FromMinutes(30), // Allow a 30-minute clock skew for token expiration validation1
        IssuerSigningKey = new SymmetricSecurityKey(secretKey)
    };
});


// Build the WebApplication instance, which represents the configured application and is used to handle incoming HTTP requests
// Build the WebApplication instance
WebApplication app = builder.Build();

// Enables Swagger only while developing locally
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Booking API V1");
        c.RoutePrefix = string.Empty;
    });
}

app.UseRouting();

app.UseCors("AllowFrontend");

app.UseMiddleware<GlobalExceptionMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();