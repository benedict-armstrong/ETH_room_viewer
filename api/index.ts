import express, { Application } from 'express';
import cors from 'cors';
import rooms_router from './routes/rooms';
import { errorHandler, logErrors } from './error/errors';

const app: Application = express();
const port = process.env.PORT;

if (!port) {
  throw console.error('Port missing!');
}

// Body parsing Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/rooms', rooms_router);

app.get('/api/healthcheck', (req, res) => {
  res.send('OK');
});

app.use(logErrors);
app.use(errorHandler);

try {
  app.listen(port, (): void => {
    console.log(`Connected successfully on port ${port}`);
  });
} catch (error) {
  console.error(`Error occurred: ${error}`);
}
