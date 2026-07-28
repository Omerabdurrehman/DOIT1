# Deployment Guide

## Backend on Render
1. Create a new Web Service in Render.
2. Connect this repository.
3. Set the root directory to backend.
4. Use the following build/start commands:
   - Build: pip install -r requirements.txt
   - Start: gunicorn config.wsgi:application
5. Add environment variables:
   - SECRET_KEY: a strong random value
   - DEBUG: False
   - ALLOWED_HOSTS: *
   - CORS_ALLOWED_ORIGINS: https://your-frontend-url.com
   - CSRF_TRUSTED_ORIGINS: https://your-frontend-url.com
6. Deploy.

## Frontend on Render or Vercel
1. Create a new Static Site.
2. Set the root directory to frontend.
3. Build command: npm install && npm run build
4. Publish directory: dist
5. Add environment variable:
   - VITE_API_BASE_URL: https://your-backend-url.onrender.com/api
6. Deploy.

## Important
- The backend uses SQLite locally and is ready for Render with the current configuration.
- For a production deployment, replace the local SQLite database with a managed PostgreSQL database if you want persistent production data.
- The app is currently a PWA-style mobile web app, which is the right fit for your request.
