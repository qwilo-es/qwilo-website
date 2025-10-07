# SEO Setup Guide for Qwilo

## ✅ Current SEO Implementation

### 1. Technical SEO
- ✅ Sitemap generation (static + dynamic)
- ✅ Robots.txt configured
- ✅ Structured data (Schema.org JSON-LD)
- ✅ Meta tags optimization
- ✅ Canonical URLs
- ✅ Open Graph tags
- ✅ Twitter Cards
- ✅ Multi-language support (es/en)

### 2. Analytics & Tracking
- ✅ Google Analytics (GA4) ready
- ✅ Google Tag Manager ready
- ✅ Performance monitoring setup

### 3. Structured Data Types
- Organization
- Website
- Article (for blog posts)
- Product (for products)
- Service (for services)
- BreadcrumbList (for navigation)
- FAQPage (for FAQ sections)

---

## 🚀 Quick Setup Instructions

### Step 1: Get Your Google Analytics ID
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property for `qwilo.es`
3. Copy your Measurement ID (format: `G-XXXXXXXXXX`)

### Step 2: Get Google Search Console Verification
1. Go to [Google Search Console](https://search.google.com/search-console/)
2. Add property: `https://qwilo.es`
3. Choose "HTML tag" verification method
4. Copy the verification code from the meta tag

### Step 3: Configure Environment Variables
Add these to your `.env` file:

```bash
# Required
NEXT_PUBLIC_SITE_URL=https://qwilo.es
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_verification_code

# Optional (if using Google Tag Manager)
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

### Step 4: Submit Sitemap to Google
1. In Google Search Console, go to "Sitemaps"
2. Submit: `https://qwilo.es/sitemap.xml`
3. Submit: `https://qwilo.es/server-sitemap.xml`

---

## 📊 SEO URLs

- Main sitemap: `https://qwilo.es/sitemap.xml`
- Dynamic sitemap: `https://qwilo.es/server-sitemap.xml`
- Robots.txt: `https://qwilo.es/robots.txt`

---

## 🎯 Target Keywords

Primary keywords:
- agencia IA
- automatización ventas
- chatbot WhatsApp
- chatbot IA
- agente inteligente

Secondary keywords:
- automatización empresarial
- IA conversacional
- marketing automation
- asistente virtual
- soluciones IA

---

## 📈 Next Steps for Better Ranking

### 1. Content Strategy
- [ ] Create high-quality blog content
- [ ] Add case studies
- [ ] Include customer testimonials
- [ ] Create landing pages for each service
- [ ] Add FAQ sections to pages

### 2. Technical Optimization
- [ ] Optimize images (WebP format, lazy loading)
- [ ] Improve Core Web Vitals scores
- [ ] Add internal linking structure
- [ ] Implement AMP pages (optional)

### 3. Off-Page SEO
- [ ] Build backlinks from relevant sites
- [ ] Social media sharing
- [ ] Directory submissions
- [ ] Guest posting
- [ ] PR and media coverage

### 4. Local SEO (if applicable)
- [ ] Create Google Business Profile
- [ ] Add business to local directories
- [ ] Get customer reviews
- [ ] Add location-specific content

### 5. Monitoring
- [ ] Set up Google Search Console alerts
- [ ] Monitor rankings for target keywords
- [ ] Track organic traffic in GA4
- [ ] Monitor Core Web Vitals
- [ ] Check sitemap indexing status

---

## 🔧 Using Structured Data

### For Blog Posts
```tsx
<StructuredData
  type="article"
  data={{
    title: "Article Title",
    description: "Article description",
    image: "https://...",
    publishedAt: "2024-01-01",
    updatedAt: "2024-01-02"
  }}
/>
```

### For Products
```tsx
<StructuredData
  type="product"
  data={{
    name: "Product Name",
    description: "Product description",
    image: "https://...",
    price: "99.00",
    slug: "product-slug",
    rating: 4.5,
    reviewCount: 10
  }}
/>
```

### For Services
```tsx
<StructuredData
  type="service"
  data={{
    name: "Service Name",
    description: "Service description",
    features: ["Feature 1", "Feature 2"]
  }}
/>
```

### For Breadcrumbs
```tsx
<StructuredData
  type="breadcrumb"
  data={{
    items: [
      { name: "Home", url: "/" },
      { name: "Products", url: "/products" },
      { name: "Product Name", url: "/products/slug" }
    ]
  }}
/>
```

### For FAQ
```tsx
<StructuredData
  type="faq"
  data={{
    questions: [
      {
        question: "What is Qwilo?",
        answer: "Qwilo is..."
      },
      {
        question: "How does it work?",
        answer: "It works by..."
      }
    ]
  }}
/>
```

---

## 🔍 SEO Checklist

### Before Launch
- [x] Sitemap generated and accessible
- [x] Robots.txt properly configured
- [x] Meta tags on all pages
- [x] Canonical URLs set
- [x] Structured data implemented
- [x] Analytics tracking ready
- [ ] Environment variables configured
- [ ] SSL certificate installed (HTTPS)
- [ ] 404 page created
- [ ] Redirect strategy for old URLs

### After Launch
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Verify Google Analytics tracking
- [ ] Test structured data with Google Rich Results Test
- [ ] Check mobile-friendliness
- [ ] Test page speed (Lighthouse)
- [ ] Monitor indexing status
- [ ] Set up alerts for errors

---

## 📚 Resources

- [Google Search Console](https://search.google.com/search-console/)
- [Google Analytics](https://analytics.google.com/)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Schema.org Documentation](https://schema.org/)

---

## 🆘 Troubleshooting

### Sitemap not showing pages?
Run `npm run build` to regenerate the sitemap.

### Analytics not tracking?
1. Check that `NEXT_PUBLIC_GA_ID` is set
2. Verify the format is `G-XXXXXXXXXX`
3. Clear browser cache and test in incognito mode
4. Check browser console for errors

### Structured data not appearing?
1. Test with [Google Rich Results Test](https://search.google.com/test/rich-results)
2. Check browser console for JSON-LD errors
3. Verify data is being passed correctly to components

### Pages not indexed?
1. Check robots.txt allows crawling
2. Verify sitemap is submitted in Search Console
3. Check for manual actions in Search Console
4. Ensure pages return 200 status code
5. Wait 2-4 weeks for initial indexing
