const bcrypt = require("bcryptjs");
const prisma = require("../src/config/prisma");

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@shop.com" },
    update: {},
    create: { name: "Admin", email: "admin@shop.com", password: passwordHash, role: "admin" },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@shop.com" },
    update: {},
    create: { name: "Customer", email: "customer@shop.com", password: passwordHash, role: "customer" },
  });

  const categories = await Promise.all(
    ["Phones", "Laptops", "Accessories"].map((name) =>
      prisma.category.upsert({ where: { name }, update: {}, create: { name } })
    )
  );

  const products = [
    { name: "Phone X", price: 699, stock: 50, categoryName: "Phones", description: "Flagship phone" },
    { name: "Laptop Pro", price: 1299, stock: 20, categoryName: "Laptops", description: "Powerful laptop" },
    { name: "Wireless Mouse", price: 25, stock: 200, categoryName: "Accessories", description: "Ergonomic mouse" },
    { name: "USB-C Charger", price: 19, stock: 300, categoryName: "Accessories", description: "Fast charger" },
  ];

  for (const p of products) {
    const category = categories.find((c) => c.name === p.categoryName);
    const existing = await prisma.product.findFirst({ where: { name: p.name } });
    if (!existing) {
      await prisma.product.create({
        data: {
          name: p.name,
          price: p.price,
          stock: p.stock,
          description: p.description,
          categoryId: category.id,
        },
      });
    }
  }

  console.log("Seed complete:", { admin: admin.email, customer: customer.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
