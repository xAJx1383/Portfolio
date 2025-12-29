// File: src/content/config.ts
import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  // Fix: Explicitly type the schema context to resolve implicit 'any' errors
  schema: ({ image }: { image: () => any }) => z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().max(160, "Keep description SEO friendly"),
    // Fix: Explicitly type 'img' parameter
    image: image().refine((img: { width: number }) => img.width >= 1080, {
      message: "Cover image must be at least 1080px wide.",
    }),
    role: z.string().default('Full Stack'),
    gameLink: z.string().url().optional(),
    genre: z.string().default('Experience'),
    
    video: z.string().optional(),
    stack: z.array(z.string()).min(1, "List tools (e.g. Luau, Rojo, Blender)"),
    draft: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

export const collections = {
  projects,
};