import {
  cleanText,
  ensureDownloadsTable,
  getGoogleDriveResourceType,
  isAdminRequest,
  query,
  toGoogleDriveDownloadUrl,
  validateGoogleDriveUrl,
} from '../lib/downloads-store.js';

function firstQueryValue(value) {
  return Array.isArray(value) ? value[0] : value;
}

function unauthorized(res) {
  return res.status(401).json({ error: 'Phiên quản trị không hợp lệ. Vui lòng đăng nhập lại.' });
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    await ensureDownloadsTable();

    if (req.method === 'GET') {
      const action = firstQueryValue(req.query?.action);
      const id = String(firstQueryValue(req.query?.id) || '');

      if (action === 'download') {
        if (!/^\d+$/.test(id)) {
          return res.status(400).json({ error: 'Mục tải không hợp lệ.' });
        }

        const result = await query(
          `UPDATE web_luan_downloads
           SET download_count = download_count + 1
           WHERE id = $1::bigint AND is_active = TRUE
           RETURNING google_drive_url`,
          [id]
        );

        if (!result.rows.length) {
          return res.status(404).json({ error: 'Không tìm thấy phần mềm.' });
        }

        return res.redirect(302, toGoogleDriveDownloadUrl(result.rows[0].google_drive_url));
      }

      const includeHidden = firstQueryValue(req.query?.admin) === '1';
      if (includeHidden && !isAdminRequest(req)) return unauthorized(res);

      const result = await query(`
        SELECT id::text AS id, name, description, google_drive_url,
               ${includeHidden ? 'is_active, download_count::text AS download_count,' : ''}
               to_char(updated_at AT TIME ZONE 'Asia/Ho_Chi_Minh', 'DD/MM/YYYY HH24:MI') AS updated_at_vn
        FROM web_luan_downloads
        ${includeHidden ? '' : 'WHERE is_active = TRUE'}
        ORDER BY sort_order, id DESC
      `);

      const downloads = result.rows.map((row) => {
        const resourceType = getGoogleDriveResourceType(row.google_drive_url) || 'file';
        if (includeHidden) return { ...row, resource_type: resourceType };

        const publicRow = { ...row, resource_type: resourceType };
        delete publicRow.google_drive_url;
        return publicRow;
      });

      return res.status(200).json({ downloads });
    }

    if (!isAdminRequest(req)) return unauthorized(res);

    if (req.method === 'POST') {
      const name = cleanText(req.body?.name, 160);
      const description = cleanText(req.body?.description, 500);
      const driveUrl = validateGoogleDriveUrl(req.body?.google_drive_url);

      if (!name) return res.status(400).json({ error: 'Vui lòng nhập tên phần mềm.' });
      if (driveUrl.error) return res.status(400).json({ error: driveUrl.error });

      const result = await query(
        `INSERT INTO web_luan_downloads
           (name, description, google_drive_url, sort_order)
         VALUES (
           $1,
           NULLIF($2, ''),
           $3,
           (SELECT COALESCE(MAX(sort_order), 0) + 10 FROM web_luan_downloads)
         )
         RETURNING id::text AS id, name, description, google_drive_url,
                   is_active, download_count::text AS download_count`,
        [name, description, driveUrl.value]
      );

      return res.status(201).json({ download: result.rows[0] });
    }

    const id = String(firstQueryValue(req.query?.id) || req.body?.id || '');
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ error: 'Mục tải không hợp lệ.' });
    }

    if (req.method === 'PUT') {
      const sets = [];
      const values = [];

      if (req.body?.name !== undefined) {
        const name = cleanText(req.body.name, 160);
        if (!name) return res.status(400).json({ error: 'Tên phần mềm không được để trống.' });
        values.push(name);
        sets.push(`name = $${values.length}`);
      }

      if (req.body?.description !== undefined) {
        values.push(cleanText(req.body.description, 500));
        sets.push(`description = NULLIF($${values.length}, '')`);
      }

      if (req.body?.google_drive_url !== undefined) {
        const driveUrl = validateGoogleDriveUrl(req.body.google_drive_url);
        if (driveUrl.error) return res.status(400).json({ error: driveUrl.error });
        values.push(driveUrl.value);
        sets.push(`google_drive_url = $${values.length}`);
      }

      if (req.body?.is_active !== undefined) {
        if (typeof req.body.is_active !== 'boolean') {
          return res.status(400).json({ error: 'Trạng thái hiển thị không hợp lệ.' });
        }
        values.push(req.body.is_active);
        sets.push(`is_active = $${values.length}`);
      }

      if (!sets.length) {
        return res.status(400).json({ error: 'Không có thông tin cần cập nhật.' });
      }

      values.push(id);
      const result = await query(
        `UPDATE web_luan_downloads
         SET ${sets.join(', ')}, updated_at = now()
         WHERE id = $${values.length}::bigint
         RETURNING id::text AS id, name, description, google_drive_url,
                   is_active, download_count::text AS download_count,
                   to_char(updated_at AT TIME ZONE 'Asia/Ho_Chi_Minh', 'DD/MM/YYYY HH24:MI') AS updated_at_vn`,
        values
      );

      if (!result.rows.length) {
        return res.status(404).json({ error: 'Không tìm thấy mục tải.' });
      }
      return res.status(200).json({ download: result.rows[0] });
    }

    if (req.method === 'DELETE') {
      const result = await query(
        'DELETE FROM web_luan_downloads WHERE id = $1::bigint RETURNING id',
        [id]
      );
      if (!result.rows.length) {
        return res.status(404).json({ error: 'Không tìm thấy mục tải.' });
      }
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Download API error:', error);
    return res.status(500).json({ error: 'Không thể xử lý kho phần mềm lúc này.' });
  }
}
