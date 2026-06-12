import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'files');
const ALLOWED_EXTENSIONS = new Set([
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.ppt',
  '.pptx',
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
]);
const BLOCKED_MIME_PREFIXES = ['text/html'];
const BLOCKED_MIME_TYPES = new Set([
  'application/javascript',
  'application/x-javascript',
  'text/javascript',
  'application/x-msdownload',
  'application/x-sh',
  'application/x-php',
]);

function sanitizeFilename(filename: string) {
  const extension = path.extname(filename).toLowerCase();
  const baseName = path.basename(filename, extension);
  const safeBaseName = baseName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80) || 'file';

  return `${Date.now()}-${safeBaseName}${extension}`;
}

function isBlockedMimeType(type: string) {
  const mimeType = type.toLowerCase();
  return BLOCKED_MIME_TYPES.has(mimeType)
    || BLOCKED_MIME_PREFIXES.some((prefix) => mimeType.startsWith(prefix));
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized upload request.' },
        { status: 401 },
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: 'File tidak ditemukan.' },
        { status: 400 },
      );
    }

    const extension = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(extension)) {
      return NextResponse.json(
        { success: false, message: 'Format file tidak didukung.' },
        { status: 400 },
      );
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      return NextResponse.json(
        { success: false, message: 'Ukuran file maksimal 10MB.' },
        { status: 400 },
      );
    }

    if (file.type && isBlockedMimeType(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Tipe file tidak diizinkan.' },
        { status: 400 },
      );
    }

    const safeFilename = sanitizeFilename(file.name);
    const bytes = new Uint8Array(await file.arrayBuffer());

    await mkdir(UPLOAD_DIR, { recursive: true });
    // TODO: For production, move uploads to object storage instead of a writable local filesystem.
    await writeFile(path.join(UPLOAD_DIR, safeFilename), bytes);

    return NextResponse.json({
      success: true,
      url: `/uploads/files/${safeFilename}`,
      filename: safeFilename,
    });
  } catch (error) {
    console.error('[/api/admin/uploads] Upload failed:', error);
    return NextResponse.json(
      { success: false, message: 'Upload gagal. Coba lagi.' },
      { status: 500 },
    );
  }
}
