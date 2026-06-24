// app/api/admin/blogs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key';

interface TokenPayload {
  username: string;
  email: string;
  role: string;
  loginTime: string;
  iat: number;
  exp: number;
  iss: string;
  aud: string;
}

// JWT token verification function
function verifyToken(request: NextRequest): TokenPayload {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  const token = authHeader.substring(7);
  
  try {
    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'jagatmitra-admin',
      audience: 'jagatmitra-portal'
    }) as TokenPayload;
    
    return decoded;
  } catch (jwtError) {
    console.error('JWT verification failed:', jwtError);
    throw new Error('Invalid or expired token');
  }
}

// GET - Fetch all blogs (admin)
export async function GET(request: NextRequest) {
  try {
    const tokenData = verifyToken(request);
    console.log('Authenticated admin:', tokenData.username);
    
    await connectDB();

    const blogs = await Blog.find({})
      .sort({ created_at: -1 })
      .lean();

    return NextResponse.json({ 
      blogs,
      total: blogs.length 
    });
  } catch (error: unknown) {
    console.error('Get admin blogs error:', error);
    
    if (error instanceof Error && (
        error.message.includes('token') || 
        error.message.includes('jwt') ||
        error.message.includes('expired')
      )) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login again' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

// POST - Create new blog
export async function POST(request: NextRequest) {
  try {
    const tokenData = verifyToken(request);
    console.log('Creating blog as admin:', tokenData.username);
    
    await connectDB();

    const body = await request.json();
    console.log('Creating blog with data:', body);

    const { title, content, summary, header_image, header_image_public_id, author, published } = body;

    // Validate required fields
    if (!title || !content || !summary) {
      return NextResponse.json(
        { error: 'Title, content, and summary are required' },
        { status: 400 }
      );
    }

    // Create blog data object
    const blogData = {
      title: title.trim(),
      content,
      summary: summary.trim(),
      author: author || 'Jagatmitra Foundation',
      published: published !== undefined ? published : true,
      header_image: header_image || '',
      header_image_public_id: header_image_public_id || '',
      created_by: tokenData.username, // Add who created it
      created_at: new Date(),
      updated_at: new Date()
    };

    console.log('Blog data to save:', blogData);

    const blog = new Blog(blogData);
    await blog.save();

    console.log('Blog saved successfully:', blog._id);

    return NextResponse.json({ 
      blog: {
        ...blog.toObject(),
        id: blog._id.toString()
      },
      message: 'Blog created successfully' 
    }, { status: 201 });

  } catch (error: unknown) {
    console.error('Create blog error:', error);
    
    if (error instanceof Error && (
        error.message.includes('token') || 
        error.message.includes('jwt') ||
        error.message.includes('expired')
      )) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login again' },
        { status: 401 }
      );
    }

    // Handle MongoDB duplicate key error
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        { error: 'Blog with this title already exists' },
        { status: 400 }
      );
    }

    // Handle validation errors
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Invalid blog data provided' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    );
  }
}

// PUT - Update existing blog
export async function PUT(request: NextRequest) {
  try {
    const tokenData = verifyToken(request);
    console.log('Updating blog as admin:', tokenData.username);
    
    await connectDB();

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      );
    }

    // Add metadata
    const dataToUpdate = {
      ...updateData,
      updated_by: tokenData.username,
      updated_at: new Date()
    };

    const blog = await Blog.findByIdAndUpdate(
      id,
      dataToUpdate,
      { new: true, runValidators: true }
    );

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      blog,
      message: 'Blog updated successfully' 
    });

  } catch (error: unknown) {
    console.error('Update blog error:', error);
    
    if (error instanceof Error && (
        error.message.includes('token') || 
        error.message.includes('jwt') ||
        error.message.includes('expired')
      )) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login again' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update blog' },
      { status: 500 }
    );
  }
}

// DELETE - Delete blog
export async function DELETE(request: NextRequest) {
  try {
    const tokenData = verifyToken(request);
    console.log('Deleting blog as admin:', tokenData.username);
    
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      );
    }

    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Blog deleted successfully',
      deletedBlog: {
        id: blog._id,
        title: blog.title
      }
    });

  } catch (error: unknown) {
    console.error('Delete blog error:', error);
    
    if (error instanceof Error && (
        error.message.includes('token') || 
        error.message.includes('jwt') ||
        error.message.includes('expired')
      )) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login again' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}