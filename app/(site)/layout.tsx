import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { getCategories } from "@/lib/queries";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories();
  const nav = categories.map((c) => ({
    name: c.name,
    slug: c.slug,
    group: c.group,
    count: c._count.products,
  }));

  return (
    <>
      <SiteHeader categories={nav} />
      <main className="flex-1">{children}</main>
      <SiteFooter categories={nav} />
    </>
  );
}
