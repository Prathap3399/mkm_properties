-- MKM Properties - Layout Sections, Section Price Tags, and Layout Plots
-- Compatible with SQLite and Cloudflare D1

CREATE TABLE IF NOT EXISTS ProjectSection (
    id TEXT PRIMARY KEY,
    projectId TEXT NOT NULL,
    sectionCode TEXT NOT NULL, -- 'A', 'B', 'C', 'D'
    sectionName TEXT NOT NULL,
    pricePerSqFt REAL NOT NULL,
    roadWidth TEXT DEFAULT '30 ft',
    description TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (projectId) REFERENCES Project(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS LayoutPlot (
    id TEXT PRIMARY KEY,
    projectId TEXT NOT NULL,
    sectionCode TEXT NOT NULL, -- 'A', 'B', 'C', 'D'
    plotNumber TEXT NOT NULL, -- '1', '2', '3', '4'...
    areaSqFt REAL NOT NULL,
    dimensions TEXT, -- '30 x 40 ft'
    facing TEXT DEFAULT 'East Facing',
    roadWidth TEXT DEFAULT '30 ft',
    status TEXT NOT NULL DEFAULT 'Available', -- 'Available', 'Booked', 'Sold'
    cornerPremiumPercent REAL DEFAULT 0,
    notes TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (projectId) REFERENCES Project(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_section_project ON ProjectSection(projectId);
CREATE INDEX IF NOT EXISTS idx_plot_project ON LayoutPlot(projectId);
CREATE INDEX IF NOT EXISTS idx_plot_section ON LayoutPlot(sectionCode);
