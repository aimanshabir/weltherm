/** One-off: decode HTML entities left in category/product names from the WP import. */
const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();

function decode(s) {
  return String(s)
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&ldquo;|&rdquo;|&quot;/g, '"')
    .replace(/&lsquo;|&rsquo;/g, "'")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&hellip;/g, "…")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, " ")
    .trim();
}

async function main() {
  const categories = await p.category.findMany();
  for (const c of categories) {
    const name = decode(c.name);
    if (name !== c.name) {
      await p.category.update({ where: { id: c.id }, data: { name } });
      console.log(`category: "${c.name}" -> "${name}"`);
    }
  }
  const products = await p.product.findMany({ select: { id: true, name: true, shortDescription: true } });
  for (const prod of products) {
    const name = decode(prod.name);
    if (name !== prod.name) {
      await p.product.update({ where: { id: prod.id }, data: { name } });
      console.log(`product: "${prod.name}" -> "${name}"`);
    }
  }
  console.log("done");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => p.$disconnect());
