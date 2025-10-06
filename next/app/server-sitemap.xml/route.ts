import { getServerSideSitemap } from 'next-sitemap';
import fetchContentType from '@/lib/strapi/fetchContentType';

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://qwilo.es';

  try {
    // Fetch dynamic pages from Strapi
    const [pages, blogPosts, products] = await Promise.all([
      fetchContentType('pages', { populate: '*' }).catch(() => ({ data: [] })),
      fetchContentType('articles', { populate: '*' }).catch(() => ({ data: [] })),
      fetchContentType('products', { populate: '*' }).catch(() => ({ data: [] })),
    ]);

    const fields = [];

    // Add dynamic pages
    if (pages?.data) {
      const pageFields = pages.data.map((page: any) => ({
        loc: `${siteUrl}/${page.slug}`,
        lastmod: new Date(page.updatedAt).toISOString(),
        changefreq: 'weekly',
        priority: 0.8,
      }));
      fields.push(...pageFields);
    }

    // Add blog posts
    if (blogPosts?.data) {
      const blogFields = blogPosts.data.map((post: any) => ({
        loc: `${siteUrl}/blog/${post.slug}`,
        lastmod: new Date(post.updatedAt).toISOString(),
        changefreq: 'weekly',
        priority: 0.7,
      }));
      fields.push(...blogFields);
    }

    // Add products
    if (products?.data) {
      const productFields = products.data.map((product: any) => ({
        loc: `${siteUrl}/products/${product.slug}`,
        lastmod: new Date(product.updatedAt).toISOString(),
        changefreq: 'weekly',
        priority: 0.9,
      }));
      fields.push(...productFields);
    }

    return getServerSideSitemap(fields);
  } catch (error) {
    console.error('Error generating server sitemap:', error);
    return getServerSideSitemap([]);
  }
}
