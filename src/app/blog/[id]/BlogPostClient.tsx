"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  User,
  Share2,
  Heart,
} from "lucide-react";
import Image from "next/image";
import type { BlogPost } from "@/data/blogs";

interface BlogPostClientProps {
  blog: BlogPost;
}

const BlogPostClient: React.FC<BlogPostClientProps> = ({ blog }) => {
  const router = useRouter();

  const handleBack = (): void => {
    router.push("/blog");
  };

  const handleShare = async (): Promise<void> => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.summary,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
      } catch (error) {
        console.log("Error copying to clipboard:", error);
      }
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const createMarkup = (htmlContent: string) => {
    return { __html: htmlContent };
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement>
  ): void => {
    const target = e.currentTarget;
    target.src = `data:image/svg+xml;base64,${btoa(`
      <svg width="1200" height="400" viewBox="0 0 1200 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:0.3" />
            <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:0.3" />
          </linearGradient>
        </defs>
        <rect width="1200" height="400" fill="url(#headerGrad)"/>
        <circle cx="600" cy="200" r="80" fill="#3B82F6" fill-opacity="0.4"/>
        <text x="600" y="210" text-anchor="middle" fill="#1F2937" font-family="Arial" font-size="24" font-weight="bold">Blog Header</text>
      </svg>
    `)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {blog.header_image && (
        <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
          <Image
            src={blog.header_image}
            alt={blog.title}
            fill
            className="object-cover"
            onError={handleImageError}
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <button
            onClick={handleBack}
            className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleShare}
            className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          {!blog.header_image && (
            <button
              onClick={handleBack}
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors mb-8 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Blog</span>
            </button>
          )}

          <header className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight font-serif">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-green-600" />
                <span className="font-medium">{blog.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>{formatDate(blog.created_at)}</span>
              </div>
              {blog.updated_at !== blog.created_at && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    Updated: {formatDate(blog.updated_at)}
                  </span>
                </div>
              )}
            </div>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 sm:p-8 border-l-4 border-green-500">
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed font-medium">
                {blog.summary}
              </p>
            </div>
          </header>

          <article className="prose lg:prose-xl max-w-none">
            <div
              className="blog-content"
              dangerouslySetInnerHTML={createMarkup(blog.content)}
            />
          </article>

          <footer className="mt-12 sm:mt-16 pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <button
                onClick={handleShare}
                className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Article</span>
              </button>
              <div className="text-sm text-gray-500">
                <p>
                  Published by{" "}
                  <span className="font-medium text-gray-700">{blog.author}</span>
                </p>
                <p>{formatDate(blog.created_at)}</p>
              </div>
            </div>
          </footer>

          <div className="mt-16 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-2xl p-1">
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-purple-500 rounded-full mb-6 animate-bounce-gentle">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                <span className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Get Involved
                </span>
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Inspired by this story? Join us in making a difference. Every
                action counts towards creating positive change in our communities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push("/get-involved")}
                  className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Volunteer With Us
                </button>
                <button
                  onClick={() => router.push("/donate")}
                  className="inline-flex items-center space-x-2 bg-transparent border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Support Our Mission
                </button>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={handleBack}
              className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to All Articles</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounceGentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-gentle { animation: bounceGentle 2s ease-in-out infinite; }
        .blog-content { color: #374151; line-height: 1.8; }
        .blog-content h1,.blog-content h2,.blog-content h3,.blog-content h4,.blog-content h5,.blog-content h6 { color: #111827; font-weight: bold; margin: 2rem 0 1rem 0; }
        .blog-content p { margin: 1rem 0; }
        .blog-content img { max-width: 100%; height: auto; border-radius: 0.5rem; margin: 2rem 0; }
        .blog-content blockquote { border-left: 4px solid #10b981; padding-left: 1rem; margin: 2rem 0; font-style: italic; background: #f0fdf4; padding: 1rem; border-radius: 0.5rem; }
        .blog-content ul,.blog-content ol { margin: 1rem 0; padding-left: 2rem; }
        .blog-content li { margin: 0.5rem 0; }
      `}</style>
    </div>
  );
};

export default BlogPostClient;
