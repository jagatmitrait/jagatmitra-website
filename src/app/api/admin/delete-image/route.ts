// app/api/admin/delete-image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

// Consistent JWT token verification function
function verifyToken(request: NextRequest): TokenPayload {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  const token = authHeader.substring(7);
  
  try {
    // Verify JWT token with same parameters as other admin routes
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

export async function DELETE(request: NextRequest) {
  try {
    const tokenData = verifyToken(request);
    console.log('Deleting image as admin:', tokenData.username);

    const { public_id } = await request.json();

    if (!public_id) {
      return NextResponse.json(
        { error: 'Public ID is required' },
        { status: 400 }
      );
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result === 'ok') {
      return NextResponse.json({
        message: 'Image deleted successfully',
        public_id: public_id
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to delete image from Cloudinary' },
        { status: 400 }
      );
    }

  } catch (error: unknown) {
    console.error('Delete image error:', error);
    
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
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}