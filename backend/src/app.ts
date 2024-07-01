import compression from 'compression';
import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';

import noteRoutes from './routes/noteRoutes';
import videoRoutes from './routes/videoRoutes';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import compressFilter from './utils/compressFilter';

const app: Express = express();

// Helmet is used to secure this app by configuring the http-header
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Compression is used to reduce the size of the response body
app.use(compression({ filter: compressFilter }));

// Configure CORS middleware
app.use(
  cors({
    origin: ['http://localhost:3000', "https://tubenote-frontend.vercel.app"], // Specify the allowed origin(s) for requests
    credentials: true, // Allow sending cookies along with the requests
  }),
);

app.use('/api/v1', videoRoutes);
app.use('/api/v1', noteRoutes);
app.use('/api/v1', authRoutes);
app.use('/api/v1', userRoutes);

export default app;
