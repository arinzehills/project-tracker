import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { projectRouter } from './modules';
import { errorHandler } from './middlewares/errorHandler.middleware';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;
const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/project-tracker';

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());

// CORS middleware
app.use((_req: Request, res: Response, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');

  if (_req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Health check
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Project Tracker API is running!' });
});

// Routes
app.use('/api/projects', projectRouter);

// Error handling middleware (must be last)
app.use(errorHandler);

// Connect to MongoDB and start server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(DB_URI)
    .then(() => console.log('✓ Connected to MongoDB'))
    .catch((err) => console.error('✗ MongoDB connection error:', err));

  // Start the server
  app.listen(PORT, () => {
    console.log(`✓ Backend server running on http://localhost:${PORT}`);
  });
}

export { app };
