-- MKM Properties - Trichy Database Schema
-- Compatible with Cloudflare D1 and SQLite

CREATE TABLE IF NOT EXISTS Project (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    coverImageUrl TEXT NOT NULL,
    galleryUrls TEXT,
    videoUrl TEXT,
    brochureUrl TEXT,
    priceLabel TEXT,
    approvalStatus TEXT,
    availabilityStatus TEXT NOT NULL DEFAULT 'Available',
    isPublished INTEGER NOT NULL DEFAULT 1,
    plotSizes TEXT,
    roadAccess TEXT,
    nearbyLandmarks TEXT,
    amenities TEXT,
    mapUrl TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Enquiry (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    projectId TEXT,
    purpose TEXT NOT NULL,
    budget TEXT,
    preferredLocation TEXT,
    purchaseTimeline TEXT,
    preferredVisitDate TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'NEW',
    source TEXT DEFAULT 'Website',
    utmSource TEXT,
    utmMedium TEXT,
    utmCampaign TEXT,
    utmContent TEXT,
    utmTerm TEXT,
    consentAt TEXT NOT NULL,
    privacyPolicyVersion TEXT NOT NULL DEFAULT 'v1.0',
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (projectId) REFERENCES Project(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS FollowUp (
    id TEXT PRIMARY KEY,
    enquiryId TEXT NOT NULL,
    note TEXT NOT NULL,
    nextFollowUpAt TEXT,
    createdBy TEXT NOT NULL DEFAULT 'PRATHAP (Admin)',
    createdAt TEXT NOT NULL,
    FOREIGN KEY (enquiryId) REFERENCES Enquiry(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS AdminUser (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    passwordHash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    createdAt TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_project_slug ON Project(slug);
CREATE INDEX IF NOT EXISTS idx_project_published ON Project(isPublished);
CREATE INDEX IF NOT EXISTS idx_enquiry_status ON Enquiry(status);
CREATE INDEX IF NOT EXISTS idx_enquiry_phone ON Enquiry(phone);
CREATE INDEX IF NOT EXISTS idx_enquiry_created ON Enquiry(createdAt);
CREATE INDEX IF NOT EXISTS idx_followup_enquiry ON FollowUp(enquiryId);
