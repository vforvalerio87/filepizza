import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import * as cors from '@koa/cors';
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
    const token = ctx.params.token;
    const channel = await storage.getChannel(token)

    ctx.body = channel;
  })

  router.del('/channels/:token', async (ctx, next) => {
    const token = ctx.params.token;
    await storage.closeChannel(token);

    ctx.body = null;
  })

  router.post('/channels/:token/messages', async (ctx, next) => {
    const token = ctx.params.token;
    const body = ctx.request.body;
    const message = body.message;

    await storage.postMessage(token, message)

    ctx.body = null;
  })

  router.get('/channels/:token/messages', async (ctx, next) => {
    const token = ctx.params.token;
    const body = ctx.request.body;
    const secret = body.secret;

    const messages = await storage.receiveMessages(token, secret)
    ctx.body = messages;
  })

  app
    .use(cors())
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods());

  return app
}
