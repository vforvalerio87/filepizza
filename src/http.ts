import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import { Storage } from './storage';

export function createServer(storage: Storage) {
  const app = new Koa();

  const router = new Router();

  router.post('/channels', async (ctx, next) => {
    const body = ctx.request.body;
    const publicKey = body.publicKey;

    const channel = await storage.openChannel(publicKey);
    ctx.body = channel;
  })

  router.get('/channels/:token', async (ctx, next) => {

  })

  router.del('/channels/:token', async (ctx, next) => {

  })

  router.post('/channels/:token/messages', async (ctx, next) => {

  })

  router.get('/channels/:token/messages', async (ctx, next) => {

  })

  app
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods());

  return app
}
