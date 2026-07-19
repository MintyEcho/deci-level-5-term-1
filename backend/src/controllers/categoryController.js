const prisma = require("../config/prisma");

exports.getAll = async (req, res) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
};

exports.create = async (req, res) => {
  const category = await prisma.category.create({ data: { name: req.body.name } });
  res.status(201).json(category);
};

exports.update = async (req, res) => {
  const category = await prisma.category.update({
    where: { id: Number(req.params.id) },
    data: { name: req.body.name },
  });
  res.json(category);
};

exports.remove = async (req, res) => {
  await prisma.category.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
};
