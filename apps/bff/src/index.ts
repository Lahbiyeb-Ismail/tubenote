import dotenv from "dotenv";

import app from "./app";
import { envConfig } from "./config";

dotenv.config();

const port = envConfig.server.port;

app.listen(port, () => {
  console.log(`BFF server listening on port ${port}`);
});
