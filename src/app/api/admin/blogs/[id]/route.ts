// app/api/admin/blogs/[id]/route.ts
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

// Consistent JWT token verification function (matching the main admin route)
function verifyToken(request: NextRequest): TokenPayload {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  const token = authHeader.substring(7);
  
  try {
    // Verify JWT token with same parameters as main admin route
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

// Interface for blog update data
interface BlogUpdateData {
  title: string;
  content: string;
  summary: string;
  author: string;
  published: boolean;
  header_image: string;
  updated_at: Date;
  updated_by: string;
  header_image_public_id?: string;
}

// PUT - Update existing blog
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tokenData = verifyToken(request);
    console.log('Updating blog as admin:', tokenData.username);
    
    await connectDB();

    // Await params before using
    const { id } = await params;

    const body = await request.json();
    console.log('Updating blog with data:', body); // Debug log

    const { title, content, summary, header_image, header_image_public_id, author, published } = body;

    // Validate required fields
    if (!title || !content || !summary) {
      return NextResponse.json(
        { error: 'Title, content, and summary are required' },
        { status: 400 }
      );
    }

    // Create update data object
    const updateData: BlogUpdateData = {
      title,
      content,
      summary,
      author: author || 'Jagatmitra Foundation',
      published: published !== undefined ? published : true,
      header_image: header_image || '',
      updated_at: new Date(),
      updated_by: tokenData.username
    };

    // Only update header_image_public_id if it's provided
    if (header_image_public_id !== undefined) {
      updateData.header_image_public_id = header_image_public_id;
    }

    console.log('Update data:', updateData); // Debug log

    const blog = await Blog.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true, 
        runValidators: true,
        lean: false
      }
    );

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    console.log('Blog updated successfully:', blog); // Debug log

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

    // Handle MongoDB duplicate key error
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        { error: 'Blog with this title already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update blog' },
      { status: 500 }
    );
  }
}

// DELETE - Delete blog
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tokenData = verifyToken(request);
    console.log('Deleting blog as admin:', tokenData.username);
    
    await connectDB();

    // Await params before using
    const { id } = await params;

    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    // TODO: If you want to delete the image from Cloudinary when deleting the blog:
    // if (blog.header_image_public_id) {
    //   try {
    //     await cloudinary.uploader.destroy(blog.header_image_public_id);
    //   } catch (error) {
    //     console.error('Error deleting image from Cloudinary:', error);
    //   }
    // }

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
