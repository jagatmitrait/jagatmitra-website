// app/api/blogs/[id]/route.ts
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

// GET - Get single blog (admin only - can see unpublished)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    // Await the params before accessing properties
    const { id } = await params;
    
    // Only fetch published blogs for public access
    const blog = await Blog.findOne({
      $and: [
        { published: true },
        {
          $or: [
            { _id: id },
            { slug: id }
          ]
        }
      ]
    }).lean();

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(blog);
  } catch (error: unknown) {
    console.error('Error fetching blog:', error);
    
    // Handle cast errors (invalid ObjectId)
    if (error && typeof error === 'object' && 'name' in error && error.name === 'CastError') {
      return NextResponse.json(
        { error: 'Invalid blog ID' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update blog (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = verifyToken(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { id } = await params;
    const body = await request.json();
    
    const { title, content, summary, header_image, author, published } = body;

    // Validate required fields
    if (!title || !content || !summary) {
      return NextResponse.json(
        { error: 'Title, content, and summary are required' },
        { status: 400 }
      );
    }

    // Generate new slug if title changed
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        title,
        content,
        summary,
        header_image: header_image || '',
        author: author || 'Jagatmitra Foundation',
        published: published !== undefined ? published : true,
        slug,
        updated_at: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Blog updated successfully',
      blog: updatedBlog
    });

  } catch (error: unknown) {
    console.error('Update blog error:', error);
    
    // Handle validation errors
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation error: Please check your input data' },
        { status: 400 }
      );
    }

    // Handle cast errors (invalid ObjectId)
    if (error && typeof error === 'object' && 'name' in error && error.name === 'CastError') {
      return NextResponse.json(
        { error: 'Invalid blog ID' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update blog' },
      { status: 500 }
    );
  }
}

// DELETE - Delete blog (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = verifyToken(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { id } = await params;

    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Blog deleted successfully'
    });

  } catch (error: unknown) {
    console.error('Delete blog error:', error);
    
    // Handle cast errors (invalid ObjectId)
    if (error && typeof error === 'object' && 'name' in error && error.name === 'CastError') {
      return NextResponse.json(
        { error: 'Invalid blog ID' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}