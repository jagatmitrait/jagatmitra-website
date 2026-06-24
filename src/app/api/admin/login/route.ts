// app/api/admin/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Get credentials from environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'support@jagatmitrafoundation.com';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Check if environment variables are set
    if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
      console.error('Admin credentials not set in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Validate credentials
    if (username.trim() !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const tokenPayload = {
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      role: 'admin',
      loginTime: new Date().toISOString()
    };

    const token = jwt.sign(
      tokenPayload,
      JWT_SECRET,
      { 
        expiresIn: '24h',
        issuer: 'jagatmitra-admin',
        audience: 'jagatmitra-portal'
      }
    );

    // Return success response
    return NextResponse.json({
      token,
      message: 'Login successful',
      admin: {
        id: 'admin-001',
        username: ADMIN_USERNAME,
        email: ADMIN_EMAIL,
        role: 'admin'
      }
    }, {
      status: 200,
      headers: {
        'Set-Cookie': `adminToken=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`
      }
    });

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}