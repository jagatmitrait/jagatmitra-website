// app/api/admin/upload-image/route.ts
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

// Interface for Cloudinary upload result
interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  eager?: Array<{
    secure_url: string;
    width: number;
    height: number;
  }>;
}

// Interface for Cloudinary errors
interface CloudinaryError extends Error {
  http_code?: number;
}

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

// JWT token verification function (consistent with admin/blogs/route.ts)
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

export async function POST(request: NextRequest) {
  try {
    const tokenData = verifyToken(request);
    console.log('Image upload by admin:', tokenData.username);

    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResponse = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'jagatmitra-blog', // Organize uploads in a folder
          public_id: `blog-${Date.now()}-${file.name.split('.')[0]}`, // Custom public ID
          transformation: [
            {
              quality: 'auto:good', // Automatic quality optimization
              fetch_format: 'auto', // Automatic format optimization
            }
          ],
          eager: [
            {
              width: 800,
              height: 600,
              crop: 'limit',
              quality: 'auto:good',
              fetch_format: 'auto'
            },
            {
              width: 400,
              height: 300,
              crop: 'limit',
              quality: 'auto:good',
              fetch_format: 'auto'
            }
          ], // Generate optimized versions
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else if (result) {
            resolve(result as CloudinaryUploadResult);
          } else {
            reject(new Error('Upload failed: No result returned'));
          }
        }
      ).end(buffer);
    });

    return NextResponse.json({
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
      width: uploadResponse.width,
      height: uploadResponse.height,
      format: uploadResponse.format,
      bytes: uploadResponse.bytes,
      // Include optimized versions
      eager: uploadResponse.eager?.map((eager) => ({
        url: eager.secure_url,
        width: eager.width,
        height: eager.height
      })) || []
    });

  } catch (error: unknown) {
    console.error('Upload error:', error);
    
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

    // Handle Cloudinary specific errors
    const cloudinaryError = error as CloudinaryError;
    if (cloudinaryError.http_code) {
      return NextResponse.json(
        { error: `Upload failed: ${cloudinaryError.message}` },
        { status: cloudinaryError.http_code }
      );
    }

    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}