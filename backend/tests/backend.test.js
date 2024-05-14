const request = require('supertest');

const url = 'http://localhost:8000/api';
const testId = 'testUser';
const shortId = 'boo';
const validFriend = 'testFriend';
const gameId = '5e04ad71e8296713c02b218f';

describe('GET /seeks', () => {
  it('succeeds with /seeks/userId', async () => {
    const response = await request(url)
      .get(`/seeks/${testId}`)
      .expect('Content-Type', 'application/json; charset=utf-8');
    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe('object');
  });

  it('fails without userId', async () => {
    const response = await request(url)
      .get('/seeks');
      // .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(404);
  });
});

describe('POST /seeks', () => {
  it('succeeds when valid userId is sent', async () => {
    const response = await request(url)
      .post('/seeks')
      .send({ userId: testId })
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe('object');
    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('playerOne');
    expect(response.body.finished).toEqual(false);
    expect(response.body.startedBy).toEqual(testId);
  });

  it('fails without userId', async () => {
    const response = await request(url)
      .post('/seeks')
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(422);
    expect(response.body.err).toEqual('userId is required');
  });

  it('fails when userId is shorter than 5 characters', async () => {
    const response = await request(url)
      .post('/seeks')
      .send({ userId: shortId })
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(422);
    expect(typeof response.body).toBe('object');
    expect(response.body.err).toEqual('userId must be at least 5 characters long');
  });
});

describe('POST /withFriend', () => {
  it('succeeds when valid userId is sent', async () => {
    const response = await request(url)
      .post('/withFriend')
      .send({ userId: testId, friendId: validFriend })
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe('object');
    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('friendId');
    expect(response.body.withFriend).toEqual(true);
    expect(response.body.friendId).toEqual(validFriend);
  });

  it('fails without userId', async () => {
    const response = await request(url)
      .post('/withFriend')
      .send({ friendId: validFriend })
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(422);
    expect(response.body.err).toEqual('userId is required');
  });

  it('fails without friendId', async () => {
    const response = await request(url)
      .post('/withFriend')
      .send({ userId: testId })
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(422);
    expect(response.body.err).toEqual('friendId is required');
  });

  it('fails when userId is shorter than 5 characters', async () => {
    const response = await request(url)
      .post('/withFriend')
      .send({ userId: shortId, friendId: validFriend })
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(422);
    expect(typeof response.body).toBe('object');
    expect(response.body).toHaveProperty('err');
    expect(response.body.err).toEqual('userId must be at least 5 characters long');
  });

  it('fails when friendId is shorter than 5 characters', async () => {
    const response = await request(url)
      .post('/withFriend')
      .send({ userId: testId, friendId: shortId })
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(422);
    expect(typeof response.body).toBe('object');
    expect(response.body).toHaveProperty('err');
    expect(response.body.err).toEqual('friendId must be at least 5 characters long');
  });
});

describe('GET /withFriendRequests', () => {
  it('succeeds with /withFriendRequests/userId', async () => {
    const response = await request(url)
      .get(`/withFriendRequests/${testId}`)
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe('object');
  });

  it('fails without userId', async () => {
    const response = await request(url)
      .get('/withFriendRequests');
      // .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(404);
  });
});

describe('GET /allUserGames', () => {
  it('succeeds with /allUserGames/userId', async () => {
    const response = await request(url)
      .get(`/allUserGames/${testId}`)
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe('object');
  });

  it('fails without userId', async () => {
    const response = await request(url)
      .get('/allUserGames');
      // .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(404);
  });
});

describe('GET /game', () => {
  it('succeeds with /game/_id', async () => {
    const response = await request(url)
      .get(`/game/${gameId}`)
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe('object');
  });

  it('fails without _id', async () => {
    const response = await request(url)
      .get('/seeks');
      // .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(404);
  });
});
