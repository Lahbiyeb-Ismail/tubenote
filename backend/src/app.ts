import 'express-async-errors';

import express, { type Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.route';
import videoRoutes from './routes/video.route';
import noteRoutes from './routes/note.route';
import userRoutes from './routes/user.route';
import { errorHandler, notFoundRoute } from './middlewares/errorsMiddleware';

const app: Express = express();

app.use(helmet());

app.use(express.json());

app.use(cookieParser());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Configure CORS middleware
app.use(
  cors({
    origin: ['http://localhost:3000'], // Specify the allowed origin(s) for requests
    credentials: true, // Allow sending cookies along with the requests
  })
);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/videos', videoRoutes);
app.use('/api/v1/notes', noteRoutes);
app.use('/api/v1/users', userRoutes);

// ?: Global Error middleware
app.use(notFoundRoute);
app.use(errorHandler);

export default app;
