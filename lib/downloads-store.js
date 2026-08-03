/* global process */

import pg from 'pg';

const { Pool } = pg;

const globalStore = globalThis;

const pool = globalStore.__webLuanDownloadsPool || new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT || 5432),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE || 'ChatHist',
  max: 3,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

if (process.env.NODE_ENV !== 'production') {
  globalStore.__webLuanDownloadsPool = pool;
}

let tableReady;

export async function ensureDownloadsTable() {
  if (!tableReady) {
    tableReady = (async () => {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS web_luan_downloads (
          id BIGSERIAL PRIMARY KEY,
          name VARCHAR(160) NOT NULL,
          description VARCHAR(500),
          google_drive_url TEXT NOT NULL,
          sort_order INTEGER NOT NULL DEFAULT 0,
          is_active BOOLEAN NOT NULL DEFAULT TRUE,
          download_count BIGINT NOT NULL DEFAULT 0,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `);
      await pool.query(`
        CREATE INDEX IF NOT EXISTS web_luan_downloads_public_order_idx
        ON web_luan_downloads (is_active, sort_order, id)
      `);
    })().catch((error) => {
      tableReady = null;
      throw error;
    });
  }

  return tableReady;
}

export function getGoogleDriveFileId(rawUrl) {
  try {
    const url = new URL(String(rawUrl || '').trim());
    const hostname = url.hostname.toLowerCase().replace(/^www\./, '');
    if (!['drive.google.com', 'drive.usercontent.google.com'].includes(hostname)) return '';

    const pathMatch = url.pathname.match(/\/file\/d\/([^/]+)/i);
    if (pathMatch?.[1]) return decodeURIComponent(pathMatch[1]);

    if (hostname === 'drive.usercontent.google.com' || /^\/(?:uc|download)(?:\/|$)/i.test(url.pathname)) {
      return url.searchParams.get('id') || '';
    }

    return '';
  } catch {
    return '';
  }
}

export function getGoogleDriveFolderId(rawUrl) {
  try {
    const url = new URL(String(rawUrl || '').trim());
    const hostname = url.hostname.toLowerCase().replace(/^www\./, '');
    if (hostname !== 'drive.google.com') return '';

    const pathMatch = url.pathname.match(/\/folders\/([^/]+)/i);
    if (pathMatch?.[1]) return decodeURIComponent(pathMatch[1]);

    if (/\/folderview\/?$/i.test(url.pathname)) {
      return url.searchParams.get('id') || '';
    }

    return '';
  } catch {
    return '';
  }
}

export function getGoogleDriveResourceType(rawUrl) {
  if (getGoogleDriveFolderId(rawUrl)) return 'folder';
  if (getGoogleDriveFileId(rawUrl)) return 'file';

  try {
    const url = new URL(String(rawUrl || '').trim());
    const hostname = url.hostname.toLowerCase().replace(/^www\./, '');
    if (hostname === 'drive.google.com' && /^\/open\/?$/i.test(url.pathname) && url.searchParams.get('id')) {
      return 'drive';
    }
  } catch {
    return '';
  }

  return '';
}

export function validateGoogleDriveUrl(rawUrl) {
  const value = String(rawUrl || '').trim();
  if (!value) return { error: 'Vui lòng dán link Google Drive.' };
  if (value.length > 2000) return { error: 'Link Google Drive quá dài.' };

  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') {
      return { error: 'Link Google Drive phải bắt đầu bằng https://.' };
    }
  } catch {
    return { error: 'Link Google Drive không hợp lệ.' };
  }

  if (!getGoogleDriveResourceType(value)) {
    return {
      error: 'Chưa nhận ra link Google Drive. Hãy dùng link chia sẻ của file hoặc thư mục.',
    };
  }

  return { value };
}

export function toGoogleDriveOpenUrl(rawUrl) {
  return String(rawUrl || '').trim();
}

export function isAdminRequest(request) {
  const expectedToken = process.env.ADMIN_API_TOKEN || '';
  const authorization = request.headers?.authorization || '';
  return Boolean(expectedToken) && authorization === `Bearer ${expectedToken}`;
}

export function cleanText(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength);
}

export async function query(text, params = []) {
  return pool.query(text, params);
}
