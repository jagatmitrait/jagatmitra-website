// app/blog/[id]/page.tsx
import { notFound } from "next/navigation";
import { getBlogById, getPublishedBlogs } from "@/data/blogs";
import BlogPostClient from "./BlogPostClient";

export function generateStaticParams() {
  return getPublishedBlogs().map((blog) => ({
    id: blog._id,
  }));
}

export const dynamicParams = false;

interface BlogPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = await params;
  const blog = getBlogById(id);

  if (!blog) {
    notFound();
  }

  return <BlogPostClient blog={blog} />;
}
