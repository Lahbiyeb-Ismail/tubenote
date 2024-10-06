import express, { type Request, type Response } from 'express';

const app = express();
const port = 5050;

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
