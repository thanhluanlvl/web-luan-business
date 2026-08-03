import assert from 'node:assert/strict';
import test from 'node:test';

import handler from '../api/downloads.js';

const canRun = process.env.RUN_DB_INTEGRATION === '1'
  && process.env.ADMIN_API_TOKEN
  && process.env.PGHOST;

function callApi({ method, query = {}, body = {}, admin = false }) {
  const response = {
    body: undefined,
    headers: {},
    statusCode: 200,
  };

  const req = {
    method,
    query,
    body,
    headers: admin ? { authorization: `Bearer ${process.env.ADMIN_API_TOKEN}` } : {},
  };

  const res = {
    setHeader(name, value) {
      response.headers[name.toLowerCase()] = value;
    },
    status(statusCode) {
      response.statusCode = statusCode;
      return this;
    },
    json(payload) {
      response.body = payload;
      return response;
    },
    redirect(statusCode, location) {
      response.statusCode = statusCode;
      response.headers.location = location;
      return response;
    },
    end() {
      return response;
    },
  };

  return handler(req, res).then(() => response);
}

test('stores, lists, opens, and cleans up a Drive folder link', { skip: !canRun }, async () => {
  const folderId = '1AbCdEfGhIjKlMnOpQrStUvWxYz';
  const folderUrl = `https://drive.google.com/drive/folders/${folderId}?usp=sharing`;
  let createdId;

  try {
    const createResponse = await callApi({
      method: 'POST',
      admin: true,
      body: {
        name: `[TEST] Folder link ${Date.now()}`,
        description: 'Temporary integration test',
        google_drive_url: folderUrl,
      },
    });

    assert.equal(createResponse.statusCode, 201);
    createdId = createResponse.body.download.id;

    const adminResponse = await callApi({ method: 'GET', query: { admin: '1' }, admin: true });
    const adminItem = adminResponse.body.downloads.find((item) => item.id === createdId);
    assert.equal(adminItem.resource_type, 'folder');
    assert.equal(adminItem.google_drive_url, folderUrl);

    const publicResponse = await callApi({ method: 'GET' });
    const publicItem = publicResponse.body.downloads.find((item) => item.id === createdId);
    assert.equal(publicItem.resource_type, 'folder');
    assert.equal(publicItem.google_drive_url, undefined);

    const redirectResponse = await callApi({
      method: 'GET',
      query: { action: 'download', id: createdId },
    });
    assert.equal(redirectResponse.statusCode, 302);
    assert.equal(redirectResponse.headers.location, folderUrl);
  } finally {
    if (createdId) {
      const deleteResponse = await callApi({
        method: 'DELETE',
        query: { id: createdId },
        admin: true,
      });
      assert.equal(deleteResponse.statusCode, 200);
    }
  }
});
