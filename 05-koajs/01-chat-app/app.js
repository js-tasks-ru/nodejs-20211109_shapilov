const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let subscribers = [];

router.get('/subscribe', async (ctx, next) => {
  const longPoll = new Promise((resolve, reject) => {
    subscribers.push(resolve);
    
    ctx.res.on('error', () => {
      subscribers.splice(subscribers.indexOf(resolve), 1);
      const error = new Error('Connection closed');
      error.code = 'CONNECTION_RESET';
      reject(error);
    })
  });

  let message;

  try {
    message = await longPoll;
  } catch (err) {
    if (err.code === 'CONNECTION_RESET') {
      return;
    }

    throw err;
  }

  ctx.body = message;
});

router.post('/publish', async (ctx, next) => {
  const body = ctx.request.body;

  if (!('message' in body) || body.message === '') {
    return;
  }

  subscribers.forEach((pollResolve) => {
    pollResolve(body.message);
  });

  subscribers = [];

  ctx.body = 'OK';
});

app.use(router.routes());

module.exports = app;
