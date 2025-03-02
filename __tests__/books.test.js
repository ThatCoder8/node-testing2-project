const request = require('supertest');
const server = require('../api/server');
const db = require('../data/db-config');

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db.seed.run();
});

afterAll(async () => {
  await db.destroy();
});

describe('books integration tests', () => {
  it('GET / responds with JSON', async () => {
    const res = await request(server).get('/');
    expect(res.status).toBe(200);
    expect(res.body.api).toBe('up and running');
  });

  // GET /api/books
  it('GET /api/books returns all books', async () => {
    const res = await request(server).get('/api/books');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);
    expect(res.body[0]).toHaveProperty('title');
  });

  // GET /api/books/:id
  it('GET /api/books/:id returns book by id', async () => {
    const res = await request(server).get('/api/books/1');
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('To Kill a Mockingbird');
  });

  it('GET /api/books/:id returns 404 for invalid id', async () => {
    const res = await request(server).get('/api/books/999');
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Book not found');
  });

  // POST /api/books
  it('POST /api/books creates a new book', async () => {
    const newBook = {
      title: 'Dune',
      author: 'Frank Herbert',
      year: 1965,
      genre: 'Science Fiction'
    };
    const res = await request(server).post('/api/books').send(newBook);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Dune');
    
    // Verify book was added to database
    const books = await db('books');
    expect(books).toHaveLength(4);
  });

  it('POST /api/books returns 400 for missing title', async () => {
    const invalidBook = {
      author: 'Frank Herbert'
    };
    const res = await request(server).post('/api/books').send(invalidBook);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Title and author are required');
  });

  // PUT /api/books/:id
  it('PUT /api/books/:id updates a book', async () => {
    const updates = {
      title: 'Updated Title',
      author: 'Updated Author'
    };
    const res = await request(server).put('/api/books/1').send(updates);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Title');
    
    // Verify book was updated in database
    const book = await db('books').where({ id: 1 }).first();
    expect(book.title).toBe('Updated Title');
  });

  it('PUT /api/books/:id returns 404 for invalid id', async () => {
    const updates = {
      title: 'Updated Title',
      author: 'Updated Author'
    };
    const res = await request(server).put('/api/books/999').send(updates);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Book not found');
  });

  // DELETE /api/books/:id
  it('DELETE /api/books/:id deletes a book', async () => {
    const res = await request(server).delete('/api/books/1');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Book deleted successfully');
    
    // Verify book was deleted from database
    const books = await db('books');
    expect(books).toHaveLength(2);
  });

  it('DELETE /api/books/:id returns 404 for invalid id', async () => {
    const res = await request(server).delete('/api/books/999');
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Book not found');
  });
});
