@echo off
echo Starting NovaVote Stack...

REM Check if .env exists
if not exist .env (
    echo Creating .env from template...
    copy .env.example .env
    echo WARNING: Please edit .env with secure passwords before production!
)

echo Building Docker images...
docker compose build

echo Starting services...
docker compose up -d

echo Waiting for database to be ready...
timeout /t 10 /nobreak >nul

echo Running database migrations...
docker compose exec -T api alembic upgrade head

echo.
echo Stack is ready!
echo.
echo Services:
echo   Frontend: http://localhost:3005
echo   Backend:  http://localhost:8000
echo   API Docs: http://localhost:8000/docs
echo.
echo To view logs: docker compose logs -f
echo To stop:      docker compose down
