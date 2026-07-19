const prisma = require("../config/prisma");

exports.getAll = async (req, res) => {
  const products = await prisma.product.findMany({ include: { category: true } });
  res.json(products);
};

exports.getOne = async (req, res) => {
  const product = await prisma.product.findUnique({ where: { id: Number(req.params.id) } });
  if (!product) return res.status(404).json({ error: "Not found" });
  res.json(product);
};

exports.create = async (req, res) => {
  const product = await prisma.product.create({ data: req.body });
  res.status(201).json(product);
};

exports.update = async (req, res) => {
  const product = await prisma.product.update({
    where: { id: Number(req.params.id) },
    data: req.body,
  });
  res.json(product);
};

exports.remove = async (req, res) => {
  await prisma.product.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
};
