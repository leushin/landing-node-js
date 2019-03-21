const chai = require('chai');
const cheerio = require('cherio');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('../app');

chai.use(chaiHttp);

describe('/GET index', () => {
  it('it should get index page', (done) => {
    chai.request(server)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.html;
        const $ = cheerio.load(res.text);
        expect($('title').text()).to.be.equal('Home page');
        done();
      });
  });
});

describe('/GET login', () => {
  it('it should get login page', (done) => {
    chai.request(server)
      .get('/login')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.html;
        const $ = cheerio.load(res.text);
        expect($('title').text()).to.be.equal('Login page');
        done();
      });
  });
});

describe('/POST login', () => {
  it('it should get error with wrong data', (done) => {
    chai.request(server)
      .post('/login')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ email: 'admin@test.ru', password: 'admin2' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.html;
        const $ = cheerio.load(res.text);
        expect($('title').text()).to.be.equal('Login page');
        expect($('.status').text()).to.be.equal('Неверные логин или пароль');
        done();
      });
  });

  it('it should get error with null data', (done) => {
    chai.request(server)
      .post('/login')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.html;
        const $ = cheerio.load(res.text);
        expect($('title').text()).to.be.equal('Login page');
        expect($('.status').text()).to.be.equal('Неверные логин или пароль');
        done();
      });
  });

  it('it should get error with part of data', (done) => {
    chai.request(server)
      .post('/login')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ email: 'admin@test.ru' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.html;
        const $ = cheerio.load(res.text);
        expect($('title').text()).to.be.equal('Login page');
        expect($('.status').text()).to.be.equal('Неверные логин или пароль');
        done();
      });
  });
  
  it('it should get error with wrong type of data', (done) => {
    chai.request(server)
      .post('/login')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ email: 1111, password: 222 })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.html;
        const $ = cheerio.load(res.text);
        expect($('title').text()).to.be.equal('Login page');
        expect($('.status').text()).to.be.equal('Неверные логин или пароль');
        done();
      });
  });

  it('it should redirect login page to admin page', (done) => {
    const agent = chai.request.agent(server);
    agent
      .post('/login')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ email: 'admin@test.ru', password: 'admin' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.html;
        const $ = cheerio.load(res.text);
        expect($('title').text()).to.be.equal('Admin page');
        done();
        agent.close();
      });
  });
});

describe('/POST skills', () => {
  it('it should get error with wrong data', (done) => {
    const agent = chai.request.agent(server);
    agent
      .post('/login')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ email: 'admin@test.ru', password: 'admin' })
      .end((err, res) => {
        agent
          .post('/admin/skills')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({ email: 'admin@test.ru', password: 'admin2' })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res).to.be.html;
            const $ = cheerio.load(res.text);
            expect($('h1').text()).to.be.equal('Неправильно заполнены данные');
            done();
            agent.close();
          });
      });
  });

  it('it should get error with null data', (done) => {
    const agent = chai.request.agent(server);
    agent
      .post('/login')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ email: 'admin@test.ru', password: 'admin' })
      .end((err, res) => {
        agent
          .post('/admin/skills')
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res).to.be.html;
            const $ = cheerio.load(res.text);
            expect($('h1').text()).to.be.equal('Неправильно заполнены данные');
            done();
            agent.close();
          });
      });
  });

  it('it should get error with part of data', (done) => {
    const agent = chai.request.agent(server);
    agent
      .post('/login')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ email: 'admin@test.ru', password: 'admin' })
      .end((err, res) => {
        agent
          .post('/admin/skills')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({ age: '10', concerts: '20' })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res).to.be.html;
            const $ = cheerio.load(res.text);
            expect($('h1').text()).to.be.equal('Неправильно заполнены данные');
            done();
            agent.close();
          });
      });
  });
  
  it('it should get error with wrong type of data', (done) => {
    const agent = chai.request.agent(server);
    agent
      .post('/login')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ email: 'admin@test.ru', password: 'admin' })
      .end((err, res) => {
        agent
          .post('/admin/skills')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({ age: 1111, concerts: 222 })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res).to.be.html;
            const $ = cheerio.load(res.text);
            expect($('h1').text()).to.be.equal('Неправильно заполнены данные');
            done();
            agent.close();
          });
      });
  });

  it('it should get error with wrong type of data', (done) => {
    const agent = chai.request.agent(server);
    agent
      .post('/login')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ email: 'admin@test.ru', password: 'admin' })
      .end((err, res) => {
        agent
          .post('/admin/skills')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({ age: '10', concerts: '20', cities: '30', years: '40' })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res).to.be.html;
            const $ = cheerio.load(res.text);
            expect($('title').text()).to.be.equal('Admin page');
            done();
            agent.close();
          });
      });
  });
});