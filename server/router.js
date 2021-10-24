import Router from 'koa-router';
import DonateController from './controllers/donate'
const router = new Router();

const api = 'donate';

router.prefix(`/${api}`);

router.post('/', DonateController.create);

export default router;