import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getGoogleDriveFolderId,
  getGoogleDriveResourceType,
  toGoogleDriveDownloadUrl,
  validateGoogleDriveUrl,
} from '../lib/downloads-store.js';

const folderId = '1AbCdEfGhIjKlMnOp';
const fileId = '9ZyXwVuTsRqPoNmLk';

test('accepts common Google Drive folder links', () => {
  const links = [
    `https://drive.google.com/drive/folders/${folderId}?usp=sharing`,
    `https://drive.google.com/drive/u/0/folders/${folderId}?usp=drive_link`,
    `https://drive.google.com/folderview?id=${folderId}`,
  ];

  for (const link of links) {
    assert.deepEqual(validateGoogleDriveUrl(link), { value: link });
    assert.equal(getGoogleDriveFolderId(link), folderId);
    assert.equal(getGoogleDriveResourceType(link), 'folder');
    assert.equal(toGoogleDriveDownloadUrl(link), link);
  }
});

test('keeps direct-download behavior for Google Drive files', () => {
  const link = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;

  assert.deepEqual(validateGoogleDriveUrl(link), { value: link });
  assert.equal(getGoogleDriveResourceType(link), 'file');
  assert.equal(
    toGoogleDriveDownloadUrl(link),
    `https://drive.google.com/uc?export=download&id=${fileId}`
  );
});

test('rejects non-Google Drive and malformed links', () => {
  assert.ok(validateGoogleDriveUrl('https://example.com/drive/folders/abc').error);
  assert.ok(validateGoogleDriveUrl('not-a-url').error);
});
