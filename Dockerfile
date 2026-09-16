# ==========================================
# Stage 1: Base Runtime Environment
# ==========================================
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# Security Best Practice: Use non-root user (built into .NET 8+)
USER $APP_UID

# ==========================================
# Stage 2: Build Environment (SDK)
# ==========================================
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Step 1: Copy only .csproj first to leverage Docker layer caching for restored packages
COPY ["Booking.Api.csproj", "./"]
RUN dotnet restore "Booking.Api.csproj"

# Step 2: Copy remaining source code and build
COPY . .
RUN dotnet build "Booking.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

# ==========================================
# Stage 3: Publish Environment
# ==========================================
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "Booking.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# ==========================================
# Stage 4: Final Production Image
# ==========================================
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Booking.Api.dll"]