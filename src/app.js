import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello from Docker!').status(200);
});

export default app;