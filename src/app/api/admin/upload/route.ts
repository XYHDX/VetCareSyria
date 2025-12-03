import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { requireAdmin } from '@/lib/adminAuth';

// Make directories recursively with proper error handling
async function ensureDir(dir: string): Promise<boolean> {
  try {
    if (!fs.existsSync(dir)) {
      await mkdir(dir, { recursive: true, mode: 0o755 });
      if (!fs.existsSync(dir)) {
        return false;
      }
    } else {
      fs.chmodSync(dir, 0o755);
    }
    return true;
  } catch (error: any) {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth) return auth;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large (max 5MB)' },
        { status: 400 }
      );
    }

    const allowedExt = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
    const fileExtension = path.extname(file.name || '').toLowerCase();

    if (!file.type.startsWith('image/') || !allowedExt.includes(fileExtension)) {
      return NextResponse.json(
        { error: 'Uploaded file must be an image (png, jpg, jpeg, gif, webp)' },
        { status: 400 }
      );
    }

    const fileName = `${uuidv4()}${fileExtension}`;
    const cwd = process.cwd();
    const publicDir = path.join(cwd, 'public');
    if (!(await ensureDir(publicDir))) {
      return NextResponse.json(
        { error: 'Server lacks permission to write to public directory' },
        { status: 500 }
      );
    }
    
    // Create path to uploads directory
    const uploadsDir = path.join(publicDir, 'uploads');
    if (!(await ensureDir(uploadsDir))) {
      return NextResponse.json(
        { error: 'Server lacks permission to write to uploads directory' },
        { status: 500 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadsDir, fileName);
    
    try {
      await writeFile(filePath, buffer);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        if (stats.size !== buffer.length) {
          return NextResponse.json(
            { error: 'File verification failed' },
            { status: 500 }
          );
        }
      } else {
        return NextResponse.json(
          { error: 'File write verification failed' },
          { status: 500 }
        );
      }
    } catch (writeError: any) {
      return NextResponse.json(
        { error: `Error saving file: ${writeError.message}` },
        { status: 500 }
      );
    }
    
    const imageUrl = `/uploads/${fileName}`;
    return NextResponse.json({ 
      imageUrl,
      success: true
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error uploading image: ${error.message}` },
      { status: 500 }
    );
  }
}
