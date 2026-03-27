import { z, defineCollection, reference } from 'astro:content';

// Using Astro Collections for blog posts

// Blog schema
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    tags: z.array(z.string()).optional(),
    categories: z.array(z.string()).optional(),
    featured: z.boolean().default(false).optional(),
    draft: z.boolean().default(false),
    relatedPosts: z.array(reference('blog')).optional(),
  }),
});

// Projects schema
const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    description: z.string().optional(),
    startDate: z.date(),
    endDate: z.date().optional(),
    status: z.enum(['completed', 'in-progress', 'planned', 'archived']).default('completed'),
    technologies: z.array(z.string()),
    categories: z.array(z.string()).optional(),
    featured: z.boolean().default(false).optional(),
    draft: z.boolean().default(false).optional(),
    githubUrl: z.string().url().optional(),
    liveUrl: z.string().url().optional(),
    imageUrl: z.string().optional(),
    favicon: z.string().optional(), // Project favicon filename (from /public/favicons/)
    priority: z.number().min(1).max(10).default(5), // For sorting
    collaborators: z.array(z.string()).optional(),
    achievements: z.array(z.string()).optional(), // Awards, metrics, etc.
  }),
});

export const collections = {
  'blog': blog,
  'projects': projects,
};
