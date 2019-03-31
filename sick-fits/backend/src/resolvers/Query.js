const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

const Query = {

  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  me(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user({
      where: { id: ctx.request.userId }
    }, info);
  },
  async users(parent, args, ctx, info) {
    // 1. Check it they are logged in
    if (!ctx.request.userId) {
      throw new Error('You must be logged in!');
    }

    // 2. Check if the user has the permissions to query all the users
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);

    // 3. If they do, query all the users!
    return ctx.db.query.users({}, info);
  },
  async order(parent, args, ctx, info) {
    // 1. Make sure they are logged in
    if (!ctx.request.userId) {
      throw new Error('You must be logged in!');
    }

    // 2. Query the current order
    const order = await ctx.db.query.order({
      where: { id: args.id },
    }, info);

    // 3. Check if they have permissions to see this order
    const ownsOrder = order.user.id === ctx.request.userId;
    const isAdmin = ctx.request.user.permissions.includes('ADMIN');
    if (!ownsOrder && !isAdmin) {
      throw new Error('You can see this!');
    }

    // 4. Return the order
    return order;
  },
  async orders(parent, args, ctx, info) {
    const { userId } = ctx.request;
    // 1. Make sure they are logged in
    if (!userId) {
      throw new Error('You must be logged in!');
    }

    // 2 . Query the list orders
    const orders = await ctx.db.query.orders({
      where: {
        user: { id: userId }
      },
      orderBy: args.orderBy,
    }, info);

    // 4. Return the orders list
    return orders;
  }
};

module.exports = Query;
