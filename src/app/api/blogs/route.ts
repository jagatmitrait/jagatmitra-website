// app/api/blogs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to verify admin token
function verifyToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  try {
    jwt.verify(token, JWT_SECRET);
    return token;
  } catch {
    return null;
  }
}

// GET - Get all blogs (admin only)
export async function GET() {
  try {
    await connectDB();

    // Only fetch published blogs for public access
    const blogs = await Blog.find({ published: true })
      .sort({ created_at: -1 })
      .lean();

    return NextResponse.json(blogs);
  } catch (error: unknown) {
    console.error('Get public blogs error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

// POST - Create new blog (admin only)
export async function POST(request: NextRequest) {
  try {
    const token = verifyToken(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { title, content, summary, header_image, author, published } = body;

    // Validate required fields
    if (!title || !content || !summary) {
      return NextResponse.json(
        { error: 'Title, content, and summary are required' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const blog = new Blog({
      title,
      content,
      summary,
      header_image: header_image || '',
      author: author || 'Jagatmitra Foundation',
      published: published !== undefined ? published : true,
      slug,
    });

    const savedBlog = await blog.save();

    return NextResponse.json(
      { 
        message: 'Blog created successfully',
        blog: savedBlog 
      },
      { status: 201 }
    );

  } catch (error: unknown) {
    console.error('Create blog error:', error);
    
    // Handle validation errors
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation error: Please check your input data' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    );
  }
}