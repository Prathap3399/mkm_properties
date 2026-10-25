-- MKM Properties - User, Documents, Content & Enhanced Enquiries
-- Compatible with SQLite and Cloudflare D1

CREATE TABLE IF NOT EXISTS User (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT,
    email TEXT UNIQUE,
    passwordHash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    status TEXT NOT NULL DEFAULT 'PENDING',
    enquiryId TEXT,
    notes TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Document (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- 'Brochure', 'Layout', 'Approval', 'Legal', 'Price Sheet'
    fileUrl TEXT NOT NULL,
    fileSize TEXT,
    fileType TEXT DEFAULT 'pdf',
    projectId TEXT,
    isProtected INTEGER NOT NULL DEFAULT 1,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (projectId) REFERENCES Project(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS SiteContent (
    key TEXT PRIMARY KEY,
    title TEXT,
    content TEXT NOT NULL,
    updatedAt TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_user_email ON User(email);
CREATE INDEX IF NOT EXISTS idx_user_status ON User(status);
CREATE INDEX IF NOT EXISTS idx_document_category ON Document(category);
CREATE INDEX IF NOT EXISTS idx_document_project ON Document(projectId);
