// app/blog/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { Search, Calendar, User, ArrowRight, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getPublishedBlogs, type BlogPost } from "@/data/blogs";

const BlogList: React.FC = () => {
  const router = useRouter();
  const [blogs] = useState<BlogPost[]>(() => getPublishedBlogs());
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>(() =>
    getPublishedBlogs()
  );

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter(
        (blog: BlogPost) =>
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBlogs(filtered);
    }
  }, [searchTerm, blogs]);

  const handleBlogClick = (blogId: string): void => {
    router.push(`/blog/${blogId}`);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement>,
    index: number
  ): void => {
    const target = e.currentTarget;
    target.src = `data:image/svg+xml;base64,${btoa(`
      <svg width="400" height="224" viewBox="0 0 400 224" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="blogGrad${index}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:0.3" />
            <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:0.3" />
          </linearGradient>
        </defs>
        <rect width="400" height="224" fill="url(#blogGrad${index})"/>
        <circle cx="200" cy="112" r="40" fill="#3B82F6" fill-opacity="0.4"/>
        <text x="200" y="118" text-anchor="middle" fill="#1F2937" font-family="Arial" font-size="16" font-weight="bold">Blog Post</text>
      </svg>
    `)}`;
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse" />
          <div
            className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6 animate-bounce-gentle">
            <BookOpen className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 font-serif">
            Our Blog
          </h1>

          <div className="w-24 h-1 bg-white/60 mx-auto rounded-full mb-6" />

          <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Stories of impact, insights from the field, and updates on our
            mission to create positive change
          </p>

          {/* Search Bar - Fixed hydration issue */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/90 backdrop-blur-sm border-0 focus:ring-2 focus:ring-white/50 focus:outline-none text-gray-800 placeholder-gray-500 text-lg shadow-xl"
                suppressHydrationWarning={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="container mx-auto px-4 py-16">
        {filteredBlogs.length > 0 ? (
          <>
            <div className="mb-8 text-center">
              <p className="text-gray-600">
                {searchTerm
                  ? `Found ${filteredBlogs.length} article${
                      filteredBlogs.length !== 1 ? "s" : ""
                    } for "${searchTerm}"`
                  : `${filteredBlogs.length} article${
                      filteredBlogs.length !== 1 ? "s" : ""
                    } available`}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog: BlogPost, index: number) => (
                <article
                  key={blog._id}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer animate-fade-in"
                  onClick={() => handleBlogClick(blog._id)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Header Image / Fallback */}
                  {blog.header_image ? (
                    <div className="relative overflow-hidden h-56">
                      <Image
                        src={blog.header_image}
                        alt={blog.title}
                        width={400}
                        height={224}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => handleImageError(e, index)}
                        priority={index < 3} // Prioritize first 3 images for better LCP
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-800">
                        {formatDate(blog.created_at)}
                      </div>
                    </div>
                  ) : (
                    <div className="h-56 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center relative overflow-hidden">
                      <BookOpen className="w-16 h-16 text-gray-400" />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-800">
                        {formatDate(blog.created_at)}
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    <h2 className="font-bold text-xl mb-3 text-gray-900 group-hover:text-green-600 transition-colors leading-tight line-clamp-2">
                      {blog.title}
                    </h2>

                    <p className="text-gray-600 leading-relaxed line-clamp-3 mb-4">
                      {blog.summary}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>{blog.author}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(blog.created_at)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-green-600 font-medium group-hover:text-green-700 transition-colors">
                        Read Full Story
                      </span>
                      <ArrowRight className="w-5 h-5 text-green-600 group-hover:translate-x-1 group-hover:text-green-700 transition-all" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-12 border border-white/30 shadow-xl max-w-md mx-auto">
              {searchTerm ? (
                <>
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                    No Results Found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    We couldn&apos;t find any articles matching &quot;
                    {searchTerm}&quot;. Try adjusting your search terms.
                  </p>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    suppressHydrationWarning={true}
                  >
                    Clear Search
                  </button>
                </>
              ) : (
                <>
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                    No Blog Posts Yet
                  </h3>
                  <p className="text-gray-600">
                    Stay tuned for inspiring stories and updates from our
                    initiatives. Great content is coming soon!
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounceGentle {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-bounce-gentle {
          animation: bounceGentle 2s ease-in-out infinite;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default BlogList;
