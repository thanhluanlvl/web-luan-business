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
);

CREATE INDEX IF NOT EXISTS web_luan_downloads_public_order_idx
ON web_luan_downloads (is_active, sort_order, id);
