const prisma = require("../config/prisma");
const { logActivity } = require("../services/activityLogService");
const { buildPaginationMeta } = require("../utils/calculations");

// GET /api/products?search=&categoryId=&sort=price_asc|price_desc|name_asc|name_desc&page=1&limit=20
exports.getAll = async (req, res) => {
  const { search, categoryId, sort, page = 1, limit = 20 } = req.query;

  const where = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  if (categoryId) where.categoryId = Number(categoryId);

  const sortMap = {
    price_asc: { price: "asc" },
    price_desc: { price: "desc" },
    name_asc: { name: "asc" },
    name_desc: { name: "desc" },
  };
  const orderBy = sortMap[sort] || { createdAt: "desc" };

  const take = Number(limit);
  const skip = (Number(page) - 1) * take;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take,
      include: { category: true, images: true },
    }),
    prisma.product.count({ where }),
  ]);

  res.json({
    data: products,
    pagination: buildPaginationMeta({ page, limit: take, total }),
  });
};

exports.getOne = async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: Number(req.params.id) },
    include: { category: true, images: true },
  });
  if (!product) return res.status(404).json({ error: "Not found" });
  res.json(product);
};

exports.create = async (req, res) => {
  const { name, description, price, stock, categoryId } = req.body;
  const product = await prisma.product.create({
    data: {
      name,
      description,
      price: Number(price),
      stock: Number(stock) || 0,
      categoryId: Number(categoryId),
    },
  });
  res.status(201).json(product);
  logActivity({
    action: "product.created",
    entity: "Product",
    entityId: product.id,
    userId: req.user?.id,
    metadata: { name: product.name },
  });
};

exports.update = async (req, res) => {
  const { name, description, price, stock, categoryId } = req.body;
  const data = {};
  if (name !== undefined) data.name = name;
  if (description !== undefined) data.description = description;
  if (price !== undefined) data.price = Number(price);
  if (stock !== undefined) data.stock = Number(stock);
  if (categoryId !== undefined) data.categoryId = Number(categoryId);

  const product = await prisma.product.update({
    where: { id: Number(req.params.id) },
    data,
  });
  res.json(product);
  logActivity({
    action: "product.updated",
    entity: "Product",
    entityId: product.id,
    userId: req.user?.id,
    metadata: data,
  });
};

exports.remove = async (req, res) => {
  const id = Number(req.params.id);
  await prisma.product.delete({ where: { id } });
  res.status(204).send();
  logActivity({ action: "product.deleted", entity: "Product", entityId: id, userId: req.user?.id });
};

// POST /api/products/:id/images (multipart, field name "images", up to 5)
exports.uploadImages = async (req, res) => {
  const productId = Number(req.params.id);
  const files = req.files || [];
  if (!files.length) return res.status(400).json({ error: "No images uploaded" });

  const created = await prisma.$transaction(
    files.map((f) =>
      prisma.productImage.create({
        data: { productId, url: `/uploads/${f.filename}` },
      })
    )
  );
  res.status(201).json(created);
};
