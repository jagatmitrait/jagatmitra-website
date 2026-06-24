// app/admin/dashboard/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  Save,
  X,
  LogOut,
  FileText,
  User,
  Upload,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  summary: string;
  header_image?: string;
  author: string;
  created_at: string;
  updated_at: string;
  published: boolean;
  slug: string;
}

interface BlogFormData {
  title: string;
  content: string;
  summary: string;
  header_image: string;
  header_image_public_id?: string;
  author: string;
  published: boolean;
}

interface Notification {
  show: boolean;
  type: "success" | "error";
  message: string;
}

interface UploadResponse {
  url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  eager?: Array<{
    url: string;
    width: number;
    height: number;
  }>;
}

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [notification, setNotification] = useState<Notification>({
    show: false,
    type: "success",
    message: "",
  });

  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    content: "",
    summary: "",
    header_image: "",
    author: "Jagatmitra Foundation",
    published: true,
  });

  // Quill editor setup
  const theme = "snow";
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["link", "image"],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ["blockquote", "code-block"],
      ["clean"],
    ],
  };

  const { quill, quillRef } = useQuill({ theme, modules });

  const showNotification = (
    type: "success" | "error",
    message: string
  ): void => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "success", message: "" });
    }, 5000);
  };

  const fetchBlogs = useCallback(async (): Promise<void> => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/blogs", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("adminToken");
          router.push("/admin/login");
          return;
        }
        throw new Error("Failed to fetch blogs");
      }

      const data = await response.json();
      setBlogs(data.blogs || []);
    } catch (error: unknown) {
      console.error("Error fetching blogs:", error);
      showNotification("error", "Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Update form data when quill content changes
  useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        const content = quill.root.innerHTML;
        setFormData((prev) => ({ ...prev, content }));
      });
    }
  }, [quill]);

  // Set content when editing a blog
  useEffect(() => {
    if (quill && editingBlog) {
      quill.root.innerHTML = editingBlog.content;
    }
  }, [quill, editingBlog]);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    fetchBlogs();
  }, [router, fetchBlogs]);

  const handleLogout = (): void => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  const handleNewBlog = (): void => {
    setEditingBlog(null);
    setFormData({
      title: "",
      content: "",
      summary: "",
      header_image: "",
      author: "Jagatmitra Foundation",
      published: true,
    });
    // Clear quill editor
    if (quill) {
      quill.setContents([]);
    }
    setShowModal(true);
  };

  const handleEditBlog = (blog: BlogPost): void => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      summary: blog.summary,
      header_image: blog.header_image || "",
      author: blog.author,
      published: blog.published,
    });
    setShowModal(true);
  };

  const handleDeleteBlog = async (blogId: string): Promise<void> => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      // Use the main admin blogs route with query parameter for deletion
      const response = await fetch(`/api/admin/blogs?id=${blogId}`, {
        method: "DELETE",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          localStorage.removeItem("adminToken");
          router.push("/admin/login");
          return;
        }
        throw new Error(errorData.error || "Failed to delete blog");
      }

      const result = await response.json();
      setBlogs(blogs.filter((blog) => blog._id !== blogId));
      showNotification("success", result.message || "Blog deleted successfully");
    } catch (error: unknown) {
      console.error("Error deleting blog:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to delete blog";
      showNotification("error", errorMessage);
    }
  };

  // Update the handleImageUpload function
  const handleImageUpload = async (file: File): Promise<string | null> => {
    if (!file || !file.type.startsWith("image/")) {
      showNotification("error", "Please select a valid image file");
      return null;
    }

    // Check file size (5MB limit to match backend)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      showNotification("error", "File size must be less than 5MB");
      return null;
    }

    setUploadingImage(true);
    try {
      const token = localStorage.getItem("adminToken");
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload-image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          localStorage.removeItem("adminToken");
          router.push("/admin/login");
          return null;
        }
        throw new Error(errorData.error || "Upload failed");
      }

      const data: UploadResponse = await response.json();

      // Store both URL and public_id for potential future deletion
      setFormData((prev) => ({
        ...prev,
        header_image: data.url,
        header_image_public_id: data.public_id,
      }));

      return data.url;
    } catch (error: unknown) {
      console.error("Error uploading image:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to upload image";
      showNotification("error", errorMessage);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleHeaderImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = await handleImageUpload(file);
      if (imageUrl) {
        showNotification("success", "Header image uploaded successfully");
      }
    }
    // Clear the input to allow re-uploading the same file
    e.target.value = "";
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setSaving(true);

    // Get content from quill editor
    const content = quill ? quill.root.innerHTML : formData.content;
    const submitData = { ...formData, content };

    try {
      const token = localStorage.getItem("adminToken");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      if (editingBlog) {
        // Update existing blog
        const response = await fetch(`/api/admin/blogs/${editingBlog._id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(submitData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 401) {
            localStorage.removeItem("adminToken");
            router.push("/admin/login");
            return;
          }
          throw new Error(errorData.error || "Failed to update blog");
        }

        const updatedBlog = await response.json();
        setBlogs(
          blogs.map((blog) =>
            blog._id === editingBlog._id ? updatedBlog.blog : blog
          )
        );
        showNotification("success", "Blog updated successfully");
      } else {
        // Create new blog
        const response = await fetch("/api/admin/blogs", {
          method: "POST",
          headers,
          body: JSON.stringify(submitData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 401) {
            localStorage.removeItem("adminToken");
            router.push("/admin/login");
            return;
          }
          throw new Error(errorData.error || "Failed to create blog");
        }

        const newBlog = await response.json();
        setBlogs([newBlog.blog, ...blogs]);
        showNotification("success", "Blog created successfully");
      }

      setShowModal(false);
      setFormData({
        title: "",
        content: "",
        summary: "",
        header_image: "",
        author: "Jagatmitra Foundation",
        published: true,
      });
    } catch (error: unknown) {
      console.error("Error saving blog:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to save blog";
      showNotification("error", errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewBlog = (blogId: string): void => {
    router.push(`/blog/${blogId}`);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>): void => {
    e.currentTarget.style.display = "none";
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3 ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Blog Management
              </h1>
              <p className="text-gray-600">Jagatmitra Foundation Admin Panel</p>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/")}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                View Website
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Bar */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              All Blog Posts
            </h2>
            <p className="text-gray-600">
              {blogs.length} article{blogs.length !== 1 ? "s" : ""} total
            </p>
          </div>

          <button
            onClick={handleNewBlog}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>New Blog Post</span>
          </button>
        </div>

        {/* Blog List */}
        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog: BlogPost) => (
              <div
                key={blog._id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200"
              >
                {/* Blog Header Image */}
                {blog.header_image && (
                  <div className="relative h-48 mb-4 rounded-t-xl overflow-hidden">
                    <Image
                      src={blog.header_image}
                      alt={blog.title}
                      fill
                      className="object-cover"
                      onError={handleImageError}
                    />
                  </div>
                )}

                <div className="p-6">
                  {/* Blog Info */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          blog.published
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {blog.published ? "Published" : "Draft"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(blog.created_at)}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                      {blog.title}
                    </h3>

                    <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                      {blog.summary}
                    </p>

                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <User className="w-4 h-4" />
                      <span>{blog.author}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewBlog(blog._id)}
                      className="flex-1 flex items-center justify-center space-x-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-md text-sm transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>

                    <button
                      onClick={() => handleEditBlog(blog)}
                      className="flex-1 flex items-center justify-center space-x-1 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-md text-sm transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDeleteBlog(blog._id)}
                      className="flex-1 flex items-center justify-center space-x-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-md text-sm transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Blog Posts Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first blog post to get started.
            </p>
            <button
              onClick={handleNewBlog}
              className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Create First Post</span>
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl w-full">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingBlog ? "Edit Blog Post" : "Create New Blog Post"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter blog title..."
                  />
                </div>

                {/* Summary */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Summary *
                  </label>
                  <textarea
                    name="summary"
                    value={formData.summary}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief summary of the blog post..."
                  />
                </div>

                {/* Header Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Header Image
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleHeaderImageUpload}
                        className="hidden"
                        id="header-image-upload"
                      />
                      <label
                        htmlFor="header-image-upload"
                        className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg cursor-pointer transition-colors"
                      >
                        {uploadingImage ? (
                          <>
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            <span>Upload Image</span>
                          </>
                        )}
                      </label>
                      {formData.header_image && (
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              header_image: "",
                            }))
                          }
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    {formData.header_image && (
                      <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden relative">
                        <Image
                          src={formData.header_image}
                          alt="Header preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Editor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <div
                    className="border border-gray-300 rounded-lg"
                    style={{ minHeight: "200px" }}
                  >
                    <div ref={quillRef} />
                  </div>
                </div>

                {/* Author and Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Author
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Author name..."
                    />
                  </div>

                  <div className="flex items-center space-x-3 pt-7">
                    <input
                      type="checkbox"
                      id="published"
                      name="published"
                      checked={formData.published}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label
                      htmlFor="published"
                      className="text-sm font-medium text-gray-700"
                    >
                      Publish immediately
                    </label>
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleButtonClick}
                disabled={saving || !formData.title || !formData.summary}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{editingBlog ? "Update" : "Create"} Post</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
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

export default AdminDashboard;