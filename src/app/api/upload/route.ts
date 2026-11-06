import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const UPLOAD_ROOT = path.join(process.cwd(), 'uploads');
const DOCS_DIR = path.join(UPLOAD_ROOT, 'documents');
const VIDEOS_DIR = path.join(UPLOAD_ROOT, 'videos');

function ensureUploadDirs() {
  if (!fs.existsSync(DOCS_DIR)) fs.mkdirSync(DOCS_DIR, { recursive: true });
  if (!fs.existsSync(VIDEOS_DIR)) fs.mkdirSync(VIDEOS_DIR, { recursive: true });
}

export async function POST(req: NextRequest) {
  try {
    ensureUploadDirs();

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const fileCategory = (formData.get('category') as string) || 'document'; // 'document' or 'video'

    if (!file) {
      return NextResponse.json({ error: 'No file provided in form data' }, { status: 400 });
    }

    const originalName = file.name || 'unnamed';
    const ext = path.extname(originalName).toLowerCase();
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (fileCategory === 'video') {
      // Validate video format (MP4, MOV)
      const allowedVideoExts = ['.mp4', '.mov', '.m4v'];
      if (!allowedVideoExts.includes(ext)) {
        return NextResponse.json(
          { error: 'Only MP4 and MOV video formats are accepted.' },
          { status: 400 }
        );
      }

      // Max size: 100MB
      if (buffer.length > 100 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'Video file size exceeds maximum limit of 100MB.' },
          { status: 400 }
        );
      }

      const safeName = `video_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
      const filePath = path.join(VIDEOS_DIR, safeName);
      fs.writeFileSync(filePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/api/media/videos/${safeName}`,
        fileName: safeName,
        size: buffer.length,
        type: file.type || 'video/mp4',
      });
    } else {
      // Document or photo
      const allowedDocExts = ['.jpg', '.jpeg', '.png', '.pdf', '.webp'];
      if (!allowedDocExts.includes(ext)) {
        return NextResponse.json(
          { error: 'Allowed file formats: JPG, JPEG, PNG, PDF.' },
          { status: 400 }
        );
      }

      // Max size: 15MB
      if (buffer.length > 15 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'File size exceeds maximum limit of 15MB.' },
          { status: 400 }
        );
      }

      const safeName = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
      const filePath = path.join(DOCS_DIR, safeName);
      fs.writeFileSync(filePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/api/media/documents/${safeName}`,
        fileName: safeName,
        size: buffer.length,
        type: file.type,
      });
    }
  } catch (err: any) {
    console.error('File upload error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to process file upload' },
      { status: 500 }
    );
  }
}

