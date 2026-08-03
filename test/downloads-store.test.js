import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getGoogleDriveFolderId,
  getGoogleDriveResourceType,
  toGoogleDriveOpenUrl,
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
    assert.equal(toGoogleDriveOpenUrl(link), link);
  }
});

test('opens Google Drive files through their original share link', () => {
  const link = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;

  assert.deepEqual(validateGoogleDriveUrl(link), { value: link });
  assert.equal(getGoogleDriveResourceType(link), 'file');
  assert.equal(toGoogleDriveOpenUrl(link), link);
});

test('accepts ambiguous legacy Drive links without treating them as files', () => {
  const link = `https://drive.google.com/open?id=${folderId}&usp=drive_fs`;

  assert.deepEqual(validateGoogleDriveUrl(link), { value: link });
  assert.equal(getGoogleDriveResourceType(link), 'drive');
  assert.equal(toGoogleDriveOpenUrl(link), link);
});

test('rejects non-Google Drive and malformed links', () => {
  assert.ok(validateGoogleDriveUrl('https://example.com/drive/folders/abc').error);
  assert.ok(validateGoogleDriveUrl('not-a-url').error);
});
