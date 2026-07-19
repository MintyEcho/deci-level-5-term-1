function calculateCartTotal(items) {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

function buildPaginationMeta({ page, limit, total }) {
  const p = Number(page) || 1;
  const l = Number(limit) || 20;
  return { page: p, limit: l, total, pages: Math.ceil(total / l) };
}

module.exports = { calculateCartTotal, buildPaginationMeta };
