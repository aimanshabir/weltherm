/** Remove test data created during QA. */
const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();

async function main() {
  const product = await p.product.findFirst({ where: { name: "Test Tower Heater TX-100" } });
  if (product) {
    await p.product.delete({ where: { id: product.id } });
    console.log("deleted test product");
  }
  const post = await p.post.findFirst({ where: { title: "My Weltherm blanket made winter cozy" } });
  if (post) {
    await p.post.delete({ where: { id: post.id } });
    console.log("deleted test post");
  }
  const msg = await p.message.findFirst({ where: { email: "rahul@example.com" } });
  if (msg) {
    await p.message.delete({ where: { id: msg.id } });
    console.log("deleted test message");
  }
  console.log("cleanup done");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => p.$disconnect());
