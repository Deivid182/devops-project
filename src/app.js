import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from '#config/logger';
import authRouter from '#routes/auth.routes';

const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
// write logs inside logs folder
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use((err, req, res, _next) => {
  // logger.error(err.stack);
  console.log('-------------');
  console.log({ err });
  console.log('-------------');
  const { statusCode } = err;
  if(statusCode){
    return res.status(err.statusCode).json({ message: err.message });
  } else {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/', (req, res) => {

  req.cookies;

  logger.info('Hello world from logger!');
  res.send('Hello world from the backend!').status(200);
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

app.get('/api', (req, res) => {
  res.status(200).json({ message: 'API is running' });
});

app.use('/api/auth', authRouter);

export default app;