import app from '../app';
import request from 'supertest';

describe('App', () => {
  describe('GET /health', () => {
    it('should return 200', async () => {
      const {statusCode}= await request(app).get('/health');
      expect(statusCode).toBe(200);
    });
  });

  describe('GET /api', () => {
    it('should return API is running message', async () => {
      const {body}= await request(app).get('/api');
      expect(body).toHaveProperty('message', 'API is running');
    });
  });

  describe('GET /non-existent-endpoint', () => {
    it('should return 404', async () => {
      const {statusCode}= await request(app).get('/non-existent-endpoint');
      expect(statusCode).toBe(404);
    });
  });
});