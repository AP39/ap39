# AP39 blog posts

One JSON file per post, named <slug>.json:

    { "title": "...", "slug": "...", "date": "2026-10-27", "excerpt": "...", "content": "## Heading

Paragraph..." }

content uses the same markdown subset as the alpha posts (src/lib/PostContent.tsx).
Add each new post to public/sitemap.xml as https://ap39.site/blog/<slug>, and add /blog itself with the first post.
