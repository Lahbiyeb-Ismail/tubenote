import dotenv from 'dotenv';

import app from './app';
import envConfig from './config/envConfig';

dotenv.config();

const PORT = envConfig.server.port || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
