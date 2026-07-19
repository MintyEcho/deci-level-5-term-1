const prisma = require("../config/prisma");

async function getOrCreateCart(userId) {
  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) cart = await prisma.cart.create({ data: { userId } });
  return cart;
}

function withTotal(cart) {
  const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  return { ...cart, total };
}

exports.getCart = async (req, res) => {
  const cart = await getOrCreateCart(req.user.id);
  const full = await prisma.cart.findUnique({
    where: { id: cart.id },
    include: { items: { include: { product: true } } },
  });
  res.json(withTotal(full));
};

exports.addItem = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const cart = await getOrCreateCart(req.user.id);

  const item = await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId: Number(productId) } },
    update: { quantity: { increment: Number(quantity) } },
    create: { cartId: cart.id, productId: Number(productId), quantity: Number(quantity) },
  });
  res.status(201).json(item);
};

exports.updateItem = async (req, res) => {
  const { quantity } = req.body;
  const cart = await getOrCreateCart(req.user.id);

  if (Number(quantity) <= 0) {
    await prisma.cartItem.delete({
      where: { cartId_productId: { cartId: cart.id, productId: Number(req.params.productId) } },
    });
    return res.status(204).send();
  }

  const item = await prisma.cartItem.update({
    where: { cartId_productId: { cartId: cart.id, productId: Number(req.params.productId) } },
    data: { quantity: Number(quantity) },
  });
  res.json(item);
};

exports.removeItem = async (req, res) => {
  const cart = await getOrCreateCart(req.user.id);
  await prisma.cartItem.delete({
    where: { cartId_productId: { cartId: cart.id, productId: Number(req.params.productId) } },
  });
  res.status(204).send();
};
