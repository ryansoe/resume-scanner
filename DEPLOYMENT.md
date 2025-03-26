# Deployment Guide

This document provides step-by-step instructions for deploying the Resume Scanner application using Render for the backend and Vercel for the frontend.

## Backend Deployment (Render)

### Option 1: Deploy via GitHub Repository

1. Sign up or log in to [Render](https://render.com/)
2. Connect your GitHub repository
3. Click "New Web Service"
4. Select your repository
5. Configure your web service:
   - Name: `resume-scanner-api` (or your preferred name)
   - Runtime: `Python`
   - Build Command: `pip install -r backend/requirements.txt`
   - Start Command: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Advanced Settings: Set environment variables
     - `OPENAI_API_KEY`: Your OpenAI API key
     - `MONGODB_URL`: Your MongoDB connection string (if using MongoDB)
     - `DB_NAME`: resume_scanner
     - `UPLOAD_FOLDER`: `/opt/render/project/src/backend/uploads`
     - `ADDITIONAL_CORS_ORIGINS`: Add any additional frontend URLs separated by commas
6. Configure a disk:
   - Name: `uploads`
   - Mount Path: `/opt/render/project/src/backend/uploads`
   - Size: `1 GB` (or adjust as needed)

### Option 2: Deploy via Render Blueprint

1. Create a repository fork or push your code to GitHub
2. Sign up or log in to [Render](https://render.com/)
3. Click "New Blueprint" and select your repository
4. Render will automatically detect the `render.yaml` file and create the necessary services

### Verifying Backend Deployment

Once deployed, your backend will be available at:
```
https://your-service-name.onrender.com/
```

Test the API by visiting:
```
https://your-service-name.onrender.com/api/v1
```

## Frontend Deployment (Vercel)

1. Sign up or log in to [Vercel](https://vercel.com/)
2. Import your GitHub repository
3. Configure the project:
   - Framework Preset: `Create React App`
   - Root Directory: `frontend` (important!)
   - Build and Output Settings:
     - Build Command: `npm run build`
     - Output Directory: `build`
   - Environment Variables:
     - `REACT_APP_API_URL`: Your Render backend URL with `/api/v1` (e.g., `https://resume-scanner-api.onrender.com/api/v1`)
4. Click "Deploy"

### Verifying Frontend Deployment

Once deployed, your frontend will be available at:
```
https://your-project-name.vercel.app/
```

## Updating CORS Settings

After deploying the frontend, you may need to update the CORS settings on the backend to allow requests from your Vercel domain:

1. Go to your Render dashboard
2. Select your backend service
3. Go to Environment Variables
4. Add or update the `ADDITIONAL_CORS_ORIGINS` variable with your Vercel domain (e.g., `https://resume-scanner.vercel.app`)

## Troubleshooting

### Backend Issues

1. **API Key Issues**: Ensure your OpenAI API key is correctly set in Render environment variables
2. **File Upload Errors**: Check if the disk is properly mounted at the correct path
3. **CORS Errors**: Update the `ADDITIONAL_CORS_ORIGINS` variable with your frontend domain

### Frontend Issues

1. **API Connection Errors**: Make sure `REACT_APP_API_URL` is correctly set in Vercel
2. **Build Failures**: Check the Vercel build logs for errors
3. **Routing Issues**: Ensure the Vercel project is configured to use the frontend directory

## Production Considerations

1. **Database**: Consider using MongoDB Atlas for persistent storage instead of in-memory storage
2. **API Keys**: Regularly rotate your OpenAI API key for security
3. **Scaling**: Monitor usage and adjust Render/Vercel plans as needed
4. **Custom Domain**: Set up custom domains in both Render and Vercel for a more professional appearance 