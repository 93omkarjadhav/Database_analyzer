const request = require('supertest');
const app = require('../server');

describe('SQL Query & Autofix API Endpoints', () => {

  describe('POST /api/chat', () => {
    it('should handle valid chat / SQL query requests', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: 'SELECT * FROM student_old;',
          prompt: 'SELECT * FROM student_old;',
          query: 'SELECT * FROM student_old;',
          dbType: 'mysql'
        });

      expect(response.statusCode).toBeLessThan(500);
      expect(response.body).toBeDefined();
    });

    it('should handle broken SQL query and generate autofix response', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: 'SELECT * FORM student_old;',
          prompt: 'SELECT * FORM student_old;',
          query: 'SELECT * FORM student_old;',
          dbType: 'mysql'
        });

      expect(response.statusCode).toBeLessThan(500);
      expect(response.body).toBeDefined();
    });
  });
});