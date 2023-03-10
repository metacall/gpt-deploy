(await import("dotenv")).config();
import logger from './src/logger/index.js';
import app from './src/app.js';
const port = process.env.PORT || 5000;
app.listen(port, () => {
  logger.info(`Server started: http://localhost:${port}`);
});