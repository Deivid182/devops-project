import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from '#config/logger';
import authRouter from '#routes/auth.routes';
import { securityMiddleware } from '#middleware/security.middleware';
import userRouter from '#routes/user.routes';
import { HttpStatus } from '#common/http-status/index';

const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use(
  morgan('combined', {
    stream: { write: message => logger.info(message.trim()) },
  })
);
app.use(securityMiddleware);
app.use((err, _, res, _next) => {
  const { statusCode } = err;
  if (statusCode) {
    return res.status(err.statusCode).json({ message: err.message });
  } else {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/', (_, res) => {
  logger.info('Hello world from logger!');
  res.send('Hello world from the backend!').status(HttpStatus.OK);
});

app.get('/health', (_, res) => {
  res.status(HttpStatus.OK).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/api', (_, res) => {
  res.status(HttpStatus.OK).json({ message: 'API is running' });
});

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

app.use((_, res) => {
  res.status(HttpStatus.NOT_FOUND).json({ message: 'Not found' });
});

export default app;
