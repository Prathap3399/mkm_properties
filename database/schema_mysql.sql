-- ================================================================
-- MKM Properties - Trichy
-- Complete MySQL Schema for GlobeHost / cPanel phpMyAdmin
-- Compatible with MySQL 5.7+ and MySQL 8.0+ / MariaDB 10.3+
-- Character set: utf8mb4 / Collation: utf8mb4_unicode_ci
-- ================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Project Table
CREATE TABLE IF NOT EXISTS `Project` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(191) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `coverImageUrl` TEXT NOT NULL,
  `galleryUrls` TEXT NULL,
  `videoUrl` TEXT NULL,
  `brochureUrl` TEXT NULL,
  `priceLabel` VARCHAR(100) NULL,
  `approvalStatus` VARCHAR(100) NULL,
  `availabilityStatus` VARCHAR(50) NOT NULL DEFAULT 'Available',
  `isPublished` TINYINT NOT NULL DEFAULT 1,
  `plotSizes` VARCHAR(255) NULL,
  `roadAccess` VARCHAR(255) NULL,
  `nearbyLandmarks` TEXT NULL,
  `amenities` TEXT NULL,
  `mapUrl` TEXT NULL,
  `createdAt` VARCHAR(64) NOT NULL,
  `updatedAt` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_project_slug` (`slug`),
  KEY `idx_project_published` (`isPublished`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Enquiry / Site Visit Table
CREATE TABLE IF NOT EXISTS `Enquiry` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `whatsapp` VARCHAR(50) NULL,
  `email` VARCHAR(255) NULL,
  `projectId` VARCHAR(64) NULL,
  `purpose` VARCHAR(100) NOT NULL,
  `budget` VARCHAR(100) NULL,
  `preferredLocation` VARCHAR(255) NULL,
  `purchaseTimeline` VARCHAR(100) NULL,
  `preferredVisitDate` VARCHAR(50) NULL,
  `preferredTime` VARCHAR(100) NULL,
  `message` TEXT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'NEW',
  `source` VARCHAR(100) NULL DEFAULT 'Website',
  `utmSource` VARCHAR(100) NULL,
  `utmMedium` VARCHAR(100) NULL,
  `utmCampaign` VARCHAR(100) NULL,
  `utmContent` VARCHAR(100) NULL,
  `utmTerm` VARCHAR(100) NULL,
  `consentAt` VARCHAR(64) NOT NULL,
  `privacyPolicyVersion` VARCHAR(50) NOT NULL DEFAULT 'v1.0',
  `createdAt` VARCHAR(64) NOT NULL,
  `updatedAt` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_enquiry_status` (`status`),
  KEY `idx_enquiry_phone` (`phone`),
  KEY `idx_enquiry_created` (`createdAt`),
  KEY `idx_enquiry_project` (`projectId`),
  CONSTRAINT `fk_enquiry_project` FOREIGN KEY (`projectId`) REFERENCES `Project` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. FollowUp Notes Table
CREATE TABLE IF NOT EXISTS `FollowUp` (
  `id` VARCHAR(64) NOT NULL,
  `enquiryId` VARCHAR(64) NOT NULL,
  `note` TEXT NOT NULL,
  `nextFollowUpAt` VARCHAR(64) NULL,
  `createdBy` VARCHAR(100) NOT NULL DEFAULT 'PRATHAP (Admin)',
  `createdAt` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_followup_enquiry` (`enquiryId`),
  CONSTRAINT `fk_followup_enquiry` FOREIGN KEY (`enquiryId`) REFERENCES `Enquiry` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Admin Users Table
CREATE TABLE IF NOT EXISTS `AdminUser` (
  `id` VARCHAR(64) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `passwordHash` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'admin',
  `createdAt` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_admin_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. User Portal Accounts Table
CREATE TABLE IF NOT EXISTS `User` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `whatsapp` VARCHAR(50) NULL,
  `email` VARCHAR(191) NULL,
  `passwordHash` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'user',
  `status` VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  `enquiryId` VARCHAR(64) NULL,
  `notes` TEXT NULL,
  `createdAt` VARCHAR(64) NOT NULL,
  `updatedAt` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_user_email` (`email`),
  KEY `idx_user_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Document Repository Table
CREATE TABLE IF NOT EXISTS `Document` (
  `id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `category` VARCHAR(100) NOT NULL,
  `fileUrl` TEXT NOT NULL,
  `fileSize` VARCHAR(50) NULL,
  `fileType` VARCHAR(50) NULL DEFAULT 'pdf',
  `projectId` VARCHAR(64) NULL,
  `isProtected` TINYINT NOT NULL DEFAULT 1,
  `createdAt` VARCHAR(64) NOT NULL,
  `updatedAt` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_document_category` (`category`),
  KEY `idx_document_project` (`projectId`),
  CONSTRAINT `fk_document_project` FOREIGN KEY (`projectId`) REFERENCES `Project` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Site Content Key-Value Table
CREATE TABLE IF NOT EXISTS `SiteContent` (
  `key` VARCHAR(191) NOT NULL,
  `title` VARCHAR(255) NULL,
  `content` LONGTEXT NOT NULL,
  `updatedAt` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Project Layout Sections Table
CREATE TABLE IF NOT EXISTS `ProjectSection` (
  `id` VARCHAR(64) NOT NULL,
  `projectId` VARCHAR(64) NOT NULL,
  `sectionCode` VARCHAR(10) NOT NULL,
  `sectionName` VARCHAR(100) NOT NULL,
  `pricePerSqFt` DECIMAL(10,2) NOT NULL,
  `roadWidth` VARCHAR(50) NULL DEFAULT '30 ft',
  `description` TEXT NULL,
  `createdAt` VARCHAR(64) NOT NULL,
  `updatedAt` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_section_project` (`projectId`),
  CONSTRAINT `fk_section_project` FOREIGN KEY (`projectId`) REFERENCES `Project` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Layout Plots Table
CREATE TABLE IF NOT EXISTS `LayoutPlot` (
  `id` VARCHAR(64) NOT NULL,
  `projectId` VARCHAR(64) NOT NULL,
  `sectionCode` VARCHAR(10) NOT NULL,
  `plotNumber` VARCHAR(50) NOT NULL,
  `areaSqFt` DECIMAL(10,2) NOT NULL,
  `dimensions` VARCHAR(100) NULL,
  `facing` VARCHAR(50) NULL DEFAULT 'East Facing',
  `roadWidth` VARCHAR(50) NULL DEFAULT '30 ft',
  `status` VARCHAR(50) NOT NULL DEFAULT 'Available',
  `cornerPremiumPercent` DECIMAL(5,2) NULL DEFAULT 0.00,
  `notes` TEXT NULL,
  `createdAt` VARCHAR(64) NOT NULL,
  `updatedAt` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_plot_project` (`projectId`),
  KEY `idx_plot_section` (`sectionCode`),
  CONSTRAINT `fk_plot_project` FOREIGN KEY (`projectId`) REFERENCES `Project` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Security Audit Trail Table
CREATE TABLE IF NOT EXISTS `AuditLog` (
  `id` VARCHAR(64) NOT NULL,
  `timestamp` VARCHAR(64) NOT NULL,
  `eventType` VARCHAR(100) NOT NULL,
  `severity` VARCHAR(20) NOT NULL,
  `actorId` VARCHAR(64) NULL,
  `actorEmail` VARCHAR(191) NULL,
  `ipAddress` VARCHAR(64) NULL,
  `details` TEXT NULL,
  `status` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_audit_event` (`eventType`),
  KEY `idx_audit_timestamp` (`timestamp`),
  KEY `idx_audit_actor` (`actorEmail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
