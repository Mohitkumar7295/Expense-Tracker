@echo off
echo ========================================================
echo Starting Student Expense Tracker (Backend + Frontend)
echo ========================================================
echo.

start "Expense Tracker - Spring Boot Backend (Port 8080)" cmd /k "cd /d %~dp0expense-tracker-backend && mvn spring-boot:run"
start "Expense Tracker - Next.js Frontend (Port 3000)" cmd /k "cd /d %~dp0expense-tracker-frontend && npm run dev"

echo.
echo Both servers are launching in separate windows!
echo - Backend API:  http://localhost:8080
echo - Frontend Web: http://localhost:3000
echo.
pause
