import express, { type Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';

const app: Express = express();

app.use(helmet());

app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Configure CORS middleware
app.use(
  cors({
    origin: ['http://localhost:3000'], // Specify the allowed origin(s) for requests
    credentials: true, // Allow sending cookies along with the requests
  })
);

app.get('/', (_req, res) => {
  res.send('Hello, world!');
});

export default app;
