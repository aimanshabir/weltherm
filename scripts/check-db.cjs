const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();

async function main() {
  const [products, categories, posts, users, subs, published, messages] = await Promise.all([
    p.product.count(),
    p.category.count(),
    p.post.count(),
    p.user.count(),
    p.subscriber.count(),
    p.post.count({ where: { status: "PUBLISHED" } }),
    p.message.count(),
  ]);
  console.log("products:", products, "| categories:", categories, "| posts:", posts, "| published:", published, "| users:", users, "| subscribers:", subs, "| messages:", messages);
  const sample = await p.product.findFirst({ where: { featured: true }, include: { category: true } });
  console.log("sample featured:", sample?.name, "/", sample?.category.name, "/ images:", sample?.images.slice(0, 60));
}

main()
  .catch((e) => {
    console.error("ERR", e.message);
    process.exit(1);
  })
  .finally(() => p.$disconnect());
