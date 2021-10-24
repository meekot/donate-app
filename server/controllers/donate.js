import Donate from "../models/donate";

class DonateController {
  async create (ctx) {
    try {
      const {donate} = ctx.request.body;
      ctx.status = 201;
      ctx.body = {
        ok: true,
        donate: await Donate.create(donate)
      };
      
    } catch (e) {
      ctx.status = e.statusCode || e.status || 500;
      ctx.body = {
        ok: false,
        error: e.name === 'ValidationError'? Object.values(e.errors).map(val => val.message): e.message
      };
      console.error(e.message);
    }
  }
};

export default new DonateController();