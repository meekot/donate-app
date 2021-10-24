import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import mongoose from 'mongoose'
import cors from '@koa/cors'
import mount from 'koa-mount'
import serve from 'koa-static'
import {port, connexionString, baseApi} from './config';

import router from './router';

mongoose.connect(connexionString);
mongoose.connection.once('open', () => {
  console.log('DB was connected');
})
mongoose.connection.on('error', console.error);

const app = new Koa();

if (process.env.NODE_ENV === 'development') {
  app.use(cors());
}

app.use(bodyParser());

app.use(mount('/' + baseApi, router.routes()));

if (process.env.NODE_ENV === 'production') {
  app.use(serve(__dirname + '/../public'));
}

app.listen(port, () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('DEVELOPMENT SERVER');
  }
  console.log(`Server was started on: http://localhost:${port}/`);
});