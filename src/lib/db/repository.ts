import { getDatabase } from './index';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export interface ProjectRecord {
  id: string;
  name: string;
  slug: string;
  location: string;
  description: string;
  coverImageUrl: string;
  galleryUrls?: string | null;
  videoUrl?: string | null;
  brochureUrl?: string | null;
  priceLabel?: string | null;
  approvalStatus?: string | null;
  availabilityStatus: 'Available' | 'Coming Soon' | 'Sold Out' | 'Unpublished';
  isPublished: number;
  priceBrochureUrl?: string | null;
  plotSizes?: string | null;
  roadAccess?: string | null;
  nearbyLandmarks?: string | null;
  amenities?: string | null;
  mapUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectSectionRecord {
  id: string;
  projectId: string;
  sectionCode: string; // 'A', 'B', 'C', 'D'
  sectionName: string;
  pricePerSqFt: number;
  roadWidth?: string | null;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LayoutPlotRecord {
  id: string;
  projectId: string;
  sectionCode: string; // 'A', 'B', 'C', 'D'
  plotNumber: string;
  areaSqFt: number;
  dimensions?: string | null;
  facing?: string | null;
  roadWidth?: string | null;
  status: 'Available' | 'Booked' | 'Sold';
  cornerPremiumPercent?: number | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EnquiryRecord {
  id: string;
  name: string;
  phone: string;
  whatsapp?: string | null;
  email?: string | null;
  projectId?: string | null;
  projectName?: string | null;
  purpose: 'Build a House' | 'Investment' | 'Both';
  budget?: string | null;
  preferredLocation?: string | null;
  purchaseTimeline?: string | null;
  preferredVisitDate?: string | null;
  preferredTime?: string | null;
  hearAboutUs?: string | null;
  additionalRequirements?: string | null;
  message?: string | null;
  status: 'PENDING' | 'NEW' | 'CONTACTED' | 'SCHEDULED' | 'SITE_VISIT' | 'COMPLETED' | 'FOLLOW_UP' | 'CONVERTED' | 'BOOKED' | 'REJECTED' | 'APPROVED';
  source?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
  utmTerm?: string | null;
  consentAt: string;
  privacyPolicyVersion: string;
  approvedUserId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FollowUpRecord {
  id: string;
  enquiryId: string;
  note: string;
  nextFollowUpAt?: string | null;
  createdBy: string;
  createdAt: string;
}

export interface AdminUserRecord {
  id: string;
  email: string;
  passwordHash: string;
  role: string;
  createdAt: string;
}

export interface UserRecord {
  id: string;
  name: string;
  phone: string;
  whatsapp?: string | null;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin';
  status: 'PENDING' | 'APPROVED' | 'DISABLED' | 'REJECTED';
  enquiryId?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentRecord {
  id: string;
  title: string;
  description?: string | null;
  category: 'Brochure' | 'Layout' | 'Approval' | 'Legal' | 'Price Sheet';
  fileUrl: string;
  fileSize?: string | null;
  fileType: string;
  projectId?: string | null;
  projectName?: string | null;
  isProtected: number;
  createdAt: string;
  updatedAt: string;
}

export interface SiteContentRecord {
  key: string;
  title?: string | null;
  content: string;
  updatedAt: string;
}

export async function ensureSeeded() {
  const db = getDatabase();
  const existingCount = await db.get<{ count: number }>('SELECT count(*) as count FROM Project');
  const now = new Date().toISOString();

  // 1. Ensure default admin
  const existingAdmin = await db.get<AdminUserRecord>('SELECT * FROM AdminUser LIMIT 1');
  if (!existingAdmin) {
    const adminPasswordHash = bcrypt.hashSync('MkmTrichy@2026!', 10);
    await db.run(
      `INSERT OR IGNORE INTO AdminUser (id, email, passwordHash, role, createdAt) VALUES (?, ?, ?, ?, ?)`,
      [crypto.randomUUID(), 'admin@mkmproperties.com', adminPasswordHash, 'admin', now]
    );

    // Also mirror admin in User table for unified authentication
    await db.run(
      `INSERT OR IGNORE INTO User (id, name, phone, whatsapp, email, passwordHash, role, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [crypto.randomUUID(), 'PRATHAP (Admin)', '9629048171', '9629048171', 'admin@mkmproperties.com', adminPasswordHash, 'admin', 'APPROVED', now, now]
    );
  }

  // 2. Ensure demo approved user for immediate portal access & verification
  const demoUser = await db.get<UserRecord>("SELECT * FROM User WHERE email = 'demo@mkmproperties.com'");
  if (!demoUser) {
    const demoPasswordHash = bcrypt.hashSync('MKMClient@2026!', 10);
    await db.run(
      `INSERT OR IGNORE INTO User (id, name, phone, whatsapp, email, passwordHash, role, status, notes, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        crypto.randomUUID(),
        'Karthik Sundaram (Approved Client)',
        '9840123456',
        '9840123456',
        'demo@mkmproperties.com',
        demoPasswordHash,
        'user',
        'APPROVED',
        'Pre-approved sample client for property inspection and document access.',
        now,
        now
      ]
    );
  }

  // 3. Ensure projects are seeded
  if (!existingCount || existingCount.count === 0) {
    const initialProjects: Partial<ProjectRecord>[] = [
      {
        name: 'Sterling Avenue',
        slug: 'sterling-avenue',
        location: 'K.K. Nagar Extension / Manikandam, Trichy',
        description: 'Sterling Avenue is a prime DTCP-approved residential development offering clear title deeds, wide 40ft and 30ft blacktop roads, and sweet potable groundwater. Located just minutes away from central Trichy and renowned educational institutions, it is an ideal haven for building your family home.',
        coverImageUrl: '/images/sterling-avenue.jpg',
        galleryUrls: JSON.stringify(['/images/sterling-avenue.jpg', '/images/hero.jpg']),
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        brochureUrl: '/brochures/mkm-sterling-avenue-brochure.pdf',
        priceLabel: 'Starting from ₹1,450 / sq.ft',
        approvalStatus: 'DTCP Approved (Verified)',
        availabilityStatus: 'Available',
        isPublished: 1,
        plotSizes: '1,200 sq.ft to 2,400 sq.ft (Standard & Corner plots)',
        roadAccess: '40ft main blacktop road and 30ft internal connecting lanes',
        nearbyLandmarks: '10 mins to Trichy Central Bus Stand, 5 mins to Trichy International Airport Road, close to Infant Jesus School',
        amenities: JSON.stringify(['40ft & 30ft Blacktop Roads', 'Solar Street Lighting', 'Avenue Trees & Greenery', 'Sweet Ground Water Level', 'Immediate Electricity Connection', 'Clear Title & Spot Registration', 'Bank Loan Approved']),
        mapUrl: 'https://maps.google.com/?q=Tiruchirappalli,Tamil+Nadu'
      },
      {
        name: 'Ritz Landmark Avenue',
        slug: 'ritz-landmark-avenue',
        location: 'Panjappur, Trichy (Near New Bus Terminal)',
        description: 'Positioned right at the high-momentum growth axis of Trichy, Ritz Landmark Avenue is situated in close proximity to the sprawling Panjappur Integrated Bus Terminal, wholesale market, and Olympic sports academy. Highly recommended for investors aiming for capital growth.',
        coverImageUrl: '/images/ritz-landmark.jpg',
        galleryUrls: JSON.stringify(['/images/ritz-landmark.jpg', '/images/hero.jpg']),
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        brochureUrl: '/brochures/mkm-ritz-landmark-brochure.pdf',
        priceLabel: 'Attractive Investment Pricing on Request',
        approvalStatus: 'Verified Layout Documentation',
        availabilityStatus: 'Available',
        isPublished: 1,
        plotSizes: '1,000 sq.ft to 3,000 sq.ft',
        roadAccess: '33ft wide concrete & tar cross roads',
        nearbyLandmarks: '3 mins from New Integrated Bus Terminal Panjappur, Madurai-Trichy NH connectivity',
        amenities: JSON.stringify(['Prime Highway Access', 'Stormwater Drains', 'Compound Gated Entry', 'Solar Lighting', 'High Capital Appreciation Potential']),
        mapUrl: 'https://maps.google.com/?q=Panjappur,Tiruchirappalli'
      },
      {
        name: 'Rainbow City',
        slug: 'rainbow-city',
        location: 'Samayapuram, Trichy',
        description: 'Rainbow City is a lush, calm residential township crafted for peaceful community living. Located adjacent to the Chennai-Trichy National Highway, it combines convenient urban commute with peaceful rural greenery.',
        coverImageUrl: '/images/rainbow-city.jpg',
        galleryUrls: JSON.stringify(['/images/rainbow-city.jpg', '/images/hero.jpg']),
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        brochureUrl: '/brochures/mkm-rainbow-city-brochure.pdf',
        priceLabel: 'Starting from ₹1,200 / sq.ft',
        approvalStatus: 'DTCP & RERA Approved',
        availabilityStatus: 'Available',
        isPublished: 1,
        plotSizes: '1,200 sq.ft to 2,000 sq.ft',
        roadAccess: '30ft blacktop avenue',
        nearbyLandmarks: 'Samayapuram Mariamman Temple, Samayapuram Tollgate, SRM Medical & Engineering College',
        amenities: JSON.stringify(['Gated Township Entrance', 'Parks & Reserved Open Space', 'Children Play Zone', 'Potable Sweet Water', 'Street Lights & Boundary Stones']),
        mapUrl: 'https://maps.google.com/?q=Samayapuram,Tiruchirappalli'
      },
      {
        name: 'Elegant Avenue',
        slug: 'elegant-avenue',
        location: 'Navalpattu IT Park Road, Trichy',
        description: 'Tailored for tech professionals and modern families, Elegant Avenue is strategically located along the thriving ELCOT IT Park corridor in Navalpattu. Enjoy fast access to IT employers, BHEL township, and premier colleges.',
        coverImageUrl: '/images/elegant-avenue.jpg',
        galleryUrls: JSON.stringify(['/images/elegant-avenue.jpg', '/images/hero.jpg']),
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        brochureUrl: '/brochures/mkm-elegant-avenue-brochure.pdf',
        priceLabel: 'Starting from ₹1,650 / sq.ft',
        approvalStatus: 'DTCP Approved Layout',
        availabilityStatus: 'Available',
        isPublished: 1,
        plotSizes: '1,200 sq.ft to 2,400 sq.ft',
        roadAccess: '30ft and 40ft bitumen roads with drainage',
        nearbyLandmarks: 'Directly on ELCOT IT Park Road, near Anna University BIT Campus, 12 mins from TVS Tollgate',
        amenities: JSON.stringify(['Bitumen Roads', 'Underground Water Provision', 'Street Lights', 'Immediate House Construction Support', 'Clear Documentation']),
        mapUrl: 'https://maps.google.com/?q=Navalpattu,Tiruchirappalli'
      },
      {
        name: 'Glorious Town',
        slug: 'glorious-town',
        location: 'Thiruverumbur, Trichy (Near BHEL & NIT)',
        description: 'Glorious Town is an upcoming integrated residential sanctuary situated near the educational and industrial corridor of Thiruverumbur, NIT Trichy, and BHEL. Pre-launch enquiries and priority site visits are currently underway.',
        coverImageUrl: '/images/glorious-town.jpg',
        galleryUrls: JSON.stringify(['/images/glorious-town.jpg']),
        videoUrl: null,
        brochureUrl: '/brochures/mkm-glorious-town-brochure.pdf',
        priceLabel: 'Pre-launch Rates Available Upon Enquiry',
        approvalStatus: 'Approval in Process',
        availabilityStatus: 'Coming Soon',
        isPublished: 1,
        plotSizes: '1,000 sq.ft to 1,800 sq.ft',
        roadAccess: '30ft planned wide streets',
        nearbyLandmarks: 'NIT Trichy, BHEL Main Gate, Thiruverumbur Railway Station',
        amenities: JSON.stringify(['Planned Landscaping', 'Park Area', 'Avenue Trees', 'Clear Title Verification']),
        mapUrl: 'https://maps.google.com/?q=Thiruverumbur,Tiruchirappalli'
      },
      {
        name: 'Samayapuram Highway Property',
        slug: 'samayapuram-highway-property',
        location: 'NH-45 National Highway, Samayapuram, Trichy',
        description: 'Exclusive highway-facing commercial and premium residential plots positioned directly on the Chennai-Trichy NH-45 corridor. Ideal for showrooms, commercial ventures, warehouses, and prestigious residences with high footfall.',
        coverImageUrl: '/images/samayapuram-highway.jpg',
        galleryUrls: JSON.stringify(['/images/samayapuram-highway.jpg', '/images/hero.jpg']),
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        brochureUrl: '/brochures/mkm-samayapuram-highway-brochure.pdf',
        priceLabel: 'Commercial Rates on Request',
        approvalStatus: 'Commercial & DTCP Clearances Verified',
        availabilityStatus: 'Available',
        isPublished: 1,
        plotSizes: '2,400 sq.ft to 10,000 sq.ft (Bulk parcels available)',
        roadAccess: 'Direct NH-45 6-lane national highway service lane frontage',
        nearbyLandmarks: 'Samayapuram Toll Plaza, 20 mins to Srirangam Rajagopuram',
        amenities: JSON.stringify(['High Commercial Visibility', '60ft Frontage Approach', 'Heavy Vehicle Turning Access', '3 Phase Power Line Available', 'Immediate Registration']),
        mapUrl: 'https://maps.google.com/?q=Samayapuram+Tollgate,Trichy'
      }
    ];

    for (const p of initialProjects) {
      const id = crypto.randomUUID();
      await db.run(
        `INSERT INTO Project (
          id, name, slug, location, description, coverImageUrl, galleryUrls, videoUrl,
          brochureUrl, priceLabel, approvalStatus, availabilityStatus, isPublished,
          plotSizes, roadAccess, nearbyLandmarks, amenities, mapUrl, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id, p.name, p.slug, p.location, p.description, p.coverImageUrl, p.galleryUrls, p.videoUrl,
          p.brochureUrl, p.priceLabel, p.approvalStatus, p.availabilityStatus, p.isPublished,
          p.plotSizes, p.roadAccess, p.nearbyLandmarks, p.amenities, p.mapUrl, now, now
        ]
      );
    }
  }

  // 4. Ensure default customer documents are seeded in Document table
  const docCount = await db.get<{ count: number }>('SELECT count(*) as count FROM Document');
  if (!docCount || docCount.count === 0) {
    const projects = await db.all<ProjectRecord>('SELECT id, name, slug, brochureUrl FROM Project');
    for (const proj of projects) {
      if (proj.brochureUrl) {
        await db.run(
          `INSERT INTO Document (id, title, description, category, fileUrl, fileSize, fileType, projectId, isProtected, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
          [
            crypto.randomUUID(),
            `${proj.name} — Official Layout Brochure`,
            `Complete project profile with plot dimension schedule, approved layout sketch, and corridor connectivity for ${proj.name}.`,
            'Brochure',
            proj.brochureUrl,
            '1.4 MB',
            'pdf',
            proj.id,
            now,
            now
          ]
        );

        await db.run(
          `INSERT INTO Document (id, title, description, category, fileUrl, fileSize, fileType, projectId, isProtected, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
          [
            crypto.randomUUID(),
            `${proj.name} — Survey Map & Master Layout Plan`,
            `Detailed blueprint drawing indicating exact road widths, corner plot boundaries, park reserves, and utility easements.`,
            'Layout',
            proj.brochureUrl,
            '2.1 MB',
            'pdf',
            proj.id,
            now,
            now
          ]
        );
      }
    }

    // General legal and guidance documents
    await db.run(
      `INSERT INTO Document (id, title, description, category, fileUrl, fileSize, fileType, projectId, isProtected, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, NULL, 1, ?, ?)`,
      [
        crypto.randomUUID(),
        'Trichy Residential Land Due-Diligence Checklist',
        'Official 12-point legal document verification guide covering Parent Documents, Encumbrance Certificate, Patta, and DTCP sanction.',
        'Legal',
        '/brochures/mkm-sterling-avenue-brochure.pdf',
        '850 KB',
        'pdf',
        now,
        now
      ]
    );

    await db.run(
      `INSERT INTO Document (id, title, description, category, fileUrl, fileSize, fileType, projectId, isProtected, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, NULL, 1, ?, ?)`,
      [
        crypto.randomUUID(),
        'Direct Promoter Price Sheet & Registration Expense Matrix (2026)',
        'Comprehensive breakdown of plot square footage rates, guideline values, stamp duty (7%), and registration fees across Trichy micro-markets.',
        'Price Sheet',
        '/brochures/mkm-ritz-landmark-brochure.pdf',
        '620 KB',
        'pdf',
        now,
        now
      ]
    );
  }

  // 5. Ensure default SiteContent is present
  const contentCount = await db.get<{ count: number }>('SELECT count(*) as count FROM SiteContent');
  if (!contentCount || contentCount.count === 0) {
    const defaultContents = [
      {
        key: 'about_company',
        title: 'Company Philosophy',
        content: 'MKM Properties is a customer-first property advisory based in Trichy, Tamil Nadu. We believe buying residential land should be grounded in total clarity, verified legal documentation, and on-ground inspection rather than high-pressure sales tactics.'
      },
      {
        key: 'about_commitment',
        title: 'Our 5-Point Commitment',
        content: '1. Transparent Direct Promoter Pricing with zero hidden brokerage.\n2. 100% Verified Legal Documents & DTCP/RERA approvals.\n3. Complimentary Guided Round-Trip Site Visit.\n4. Potable Water & Soil Ground Inspection before any financial commitment.\n5. Post-purchase assistance for Patta transfer and plan sanctions.'
      },
      {
        key: 'contact_info',
        title: 'Contact Details',
        content: JSON.stringify({
          businessName: 'MKM Properties',
          contactPerson: 'PRATHAP (Senior Property Advisor)',
          phone: '9629048171',
          whatsapp: '9629048171',
          email: 'advisor@mkmproperties.com',
          address: 'No. 14, Royal Tower, Cantonment / K.K. Nagar Road, Tiruchirappalli - 620001, Tamil Nadu',
          googleMapsUrl: 'https://maps.google.com/?q=Tiruchirappalli,Tamil+Nadu',
          businessHours: 'Monday – Sunday: 8:00 AM – 8:00 PM'
        })
      }
    ];

    for (const c of defaultContents) {
      await db.run(
        `INSERT OR REPLACE INTO SiteContent (key, title, content, updatedAt) VALUES (?, ?, ?, ?)`,
        [c.key, c.title, c.content, now]
      );
    }
  }

  // 6. Ensure ProjectSection and LayoutPlot are seeded for layout pricing
  try {
    const sectionCount = await db.get<{ count: number }>('SELECT count(*) as count FROM ProjectSection');
    if (!sectionCount || sectionCount.count === 0) {
      const allProjs = await db.all<ProjectRecord>('SELECT * FROM Project');
      for (const proj of allProjs) {
        let rateA = 1650;
        let rateB = 1450;
        let rateC = 1350;
        let rateD = 1200;

        if (proj.slug === 'ritz-landmark-avenue') {
          rateA = 2100; rateB = 1850; rateC = 1700; rateD = 1550;
        } else if (proj.slug === 'rainbow-city') {
          rateA = 1400; rateB = 1250; rateC = 1150; rateD = 1050;
        } else if (proj.slug === 'elegant-avenue') {
          rateA = 1850; rateB = 1650; rateC = 1500; rateD = 1350;
        } else if (proj.slug === 'samayapuram-highway-property') {
          rateA = 2800; rateB = 2400; rateC = 2100; rateD = 1900;
        }

        const sections = [
          { code: 'A', name: 'Section A (40ft Main Entrance Road)', rate: rateA, road: '40 ft Blacktop Avenue', desc: 'Prime entrance corridor facing plots with maximum road width and highest commercial & residential value.' },
          { code: 'B', name: 'Section B (30ft Central Avenue)', rate: rateB, road: '30 ft Bitumen Road', desc: 'Central residential street with potable groundwater and immediate house construction readiness.' },
          { code: 'C', name: 'Section C (Park & OSR Adjacent)', rate: rateC, road: '30 ft Tar Road', desc: 'Serene plots bordering community park area, walking track, and avenue trees.' },
          { code: 'D', name: 'Section D (Interior Peaceful Belts)', rate: rateD, road: '30 ft Bitumen Road', desc: 'Peaceful residential pocket ideal for budget-conscious families planning long-term construction.' }
        ];

        for (const s of sections) {
          const secId = crypto.randomUUID();
          await db.run(
            `INSERT INTO ProjectSection (id, projectId, sectionCode, sectionName, pricePerSqFt, roadWidth, description, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [secId, proj.id, s.code, s.name, s.rate, s.road, s.desc, now, now]
          );
        }

        const samplePlots = [
          { plot: '1', sec: 'A', area: 1500, dim: '30 x 50 ft', facing: 'East Facing', road: '40 ft', status: 'Available', corner: 5, notes: 'Prime corner plot near entrance gate' },
          { plot: '2', sec: 'A', area: 1200, dim: '30 x 40 ft', facing: 'East Facing', road: '40 ft', status: 'Available', corner: 0, notes: 'Direct road access' },
          { plot: '3', sec: 'A', area: 1200, dim: '30 x 40 ft', facing: 'North Facing', road: '40 ft', status: 'Available', corner: 0, notes: 'Vastu compliant North entrance' },
          { plot: '4', sec: 'A', area: 1800, dim: '30 x 60 ft', facing: 'North Facing', road: '40 ft', status: 'Available', corner: 0, notes: 'Spacious 1.5 ground plot' },
          { plot: '5', sec: 'A', area: 2400, dim: '40 x 60 ft', facing: 'East Facing', road: '40 ft', status: 'Booked', corner: 0, notes: 'Reserved for family villa' },
          { plot: '6', sec: 'A', area: 1500, dim: '30 x 50 ft', facing: 'Corner (East-North)', road: '40 ft', status: 'Available', corner: 5, notes: 'Dual-road ventilated plot' },
          { plot: '7', sec: 'B', area: 1200, dim: '30 x 40 ft', facing: 'East Facing', road: '30 ft', status: 'Available', corner: 0, notes: 'Levelled sweet groundwater area' },
          { plot: '8', sec: 'B', area: 1200, dim: '30 x 40 ft', facing: 'North Facing', road: '30 ft', status: 'Available', corner: 0, notes: 'Ready for immediate building plan sanction' },
          { plot: '9', sec: 'B', area: 1500, dim: '30 x 50 ft', facing: 'East Facing', road: '30 ft', status: 'Available', corner: 0, notes: 'Ideal for 3BHK individual home' },
          { plot: '10', sec: 'B', area: 1200, dim: '30 x 40 ft', facing: 'South Facing', road: '30 ft', status: 'Available', corner: 0, notes: 'Clear title & spot registration' },
          { plot: '11', sec: 'B', area: 1500, dim: '30 x 50 ft', facing: 'North Facing', road: '30 ft', status: 'Available', corner: 0, notes: '30ft street light pole equipped' },
          { plot: '12', sec: 'B', area: 1800, dim: '30 x 60 ft', facing: 'Corner (North-East)', road: '30 ft', status: 'Available', corner: 5, notes: 'Premium corner location' },
          { plot: '13', sec: 'B', area: 1200, dim: '30 x 40 ft', facing: 'East Facing', road: '30 ft', status: 'Sold', corner: 0, notes: 'Registered sale deed issued' },
          { plot: '14', sec: 'B', area: 1200, dim: '30 x 40 ft', facing: 'North Facing', road: '30 ft', status: 'Available', corner: 0, notes: 'Bank loan pre-cleared' },
          { plot: '15', sec: 'C', area: 1200, dim: '30 x 40 ft', facing: 'East Facing', road: '30 ft', status: 'Available', corner: 0, notes: 'Overlooks community park' },
          { plot: '16', sec: 'C', area: 1500, dim: '30 x 50 ft', facing: 'North Facing', road: '30 ft', status: 'Available', corner: 0, notes: 'Park reserve boundary' },
          { plot: '17', sec: 'C', area: 1200, dim: '30 x 40 ft', facing: 'West Facing', road: '30 ft', status: 'Available', corner: 0, notes: 'Pleasant evening shade' },
          { plot: '18', sec: 'C', area: 1200, dim: '30 x 40 ft', facing: 'North Facing', road: '30 ft', status: 'Available', corner: 0, notes: 'Opposite open space reserve' },
          { plot: '19', sec: 'C', area: 2000, dim: '40 x 50 ft', facing: 'East Facing', road: '30 ft', status: 'Available', corner: 0, notes: 'Large garden home plot' },
          { plot: '20', sec: 'C', area: 1200, dim: '30 x 40 ft', facing: 'Corner (East-South)', road: '30 ft', status: 'Available', corner: 5, notes: 'Corner ventilation' },
          { plot: '21', sec: 'D', area: 1000, dim: '25 x 40 ft', facing: 'North Facing', road: '30 ft', status: 'Available', corner: 0, notes: 'Compact budget residential plot' },
          { plot: '22', sec: 'D', area: 1200, dim: '30 x 40 ft', facing: 'East Facing', road: '30 ft', status: 'Available', corner: 0, notes: 'Direct owner registration' },
          { plot: '23', sec: 'D', area: 1200, dim: '30 x 40 ft', facing: 'South Facing', road: '30 ft', status: 'Available', corner: 0, notes: 'Serene interior avenue' },
          { plot: '24', sec: 'D', area: 1500, dim: '30 x 50 ft', facing: 'North Facing', road: '30 ft', status: 'Available', corner: 0, notes: 'End-of-lane quiet plot' }
        ];

        for (const p of samplePlots) {
          await db.run(
            `INSERT INTO LayoutPlot (id, projectId, sectionCode, plotNumber, areaSqFt, dimensions, facing, roadWidth, status, cornerPremiumPercent, notes, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              crypto.randomUUID(),
              proj.id,
              p.sec,
              p.plot,
              p.area,
              p.dim,
              p.facing,
              p.road,
              p.status,
              p.corner,
              p.notes,
              now,
              now
            ]
          );
        }
      }
    }
  } catch (secErr: any) {
    console.warn('[DB Migration] Section/Plot seed notice:', secErr.message);
  }
}

// ================= PROJECT QUERIES =================
export async function getAllProjects(options: { publishedOnly?: boolean } = {}) {
  await ensureSeeded();
  const db = getDatabase();
  let query = 'SELECT * FROM Project';
  const params: any[] = [];
  if (options.publishedOnly) {
    query += ' WHERE isPublished = 1';
  }
  query += ' ORDER BY createdAt ASC';
  return db.all<ProjectRecord>(query, params);
}

export async function getProjectBySlug(slug: string) {
  await ensureSeeded();
  const db = getDatabase();
  return db.get<ProjectRecord>('SELECT * FROM Project WHERE slug = ?', [slug]);
}

export async function getProjectById(id: string) {
  await ensureSeeded();
  const db = getDatabase();
  return db.get<ProjectRecord>('SELECT * FROM Project WHERE id = ?', [id]);
}

export async function createProject(data: Omit<ProjectRecord, 'id' | 'createdAt' | 'updatedAt'>) {
  const db = getDatabase();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  await db.run(
    `INSERT INTO Project (
      id, name, slug, location, description, coverImageUrl, galleryUrls, videoUrl,
      brochureUrl, priceLabel, approvalStatus, availabilityStatus, isPublished,
      plotSizes, roadAccess, nearbyLandmarks, amenities, mapUrl, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, data.name, data.slug, data.location, data.description, data.coverImageUrl, data.galleryUrls || null,
      data.videoUrl || null, data.brochureUrl || null, data.priceLabel || null, data.approvalStatus || null,
      data.availabilityStatus, data.isPublished, data.plotSizes || null, data.roadAccess || null,
      data.nearbyLandmarks || null, data.amenities || null, data.mapUrl || null, now, now
    ]
  );
  return getProjectById(id);
}

export async function updateProject(id: string, data: Partial<ProjectRecord>) {
  const db = getDatabase();
  const now = new Date().toISOString();
  const fields: string[] = [];
  const params: any[] = [];

  for (const [key, val] of Object.entries(data)) {
    if (key === 'id' || key === 'createdAt') continue;
    fields.push(`${key} = ?`);
    params.push(val);
  }

  fields.push('updatedAt = ?');
  params.push(now);
  params.push(id);

  await db.run(`UPDATE Project SET ${fields.join(', ')} WHERE id = ?`, params);
  return getProjectById(id);
}

export async function deleteProject(id: string) {
  const db = getDatabase();
  return db.run('DELETE FROM Project WHERE id = ?', [id]);
}

// ================= ENQUIRY / LEAD QUERIES =================
export async function createEnquiry(data: {
  name: string;
  phone: string;
  whatsapp?: string | null;
  email?: string | null;
  projectId?: string | null;
  purpose: 'Build a House' | 'Investment' | 'Both';
  budget?: string | null;
  preferredLocation?: string | null;
  purchaseTimeline?: string | null;
  preferredVisitDate?: string | null;
  preferredTime?: string | null;
  hearAboutUs?: string | null;
  additionalRequirements?: string | null;
  message?: string | null;
  source?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
  utmTerm?: string | null;
  privacyPolicyVersion?: string;
}) {
  await ensureSeeded();
  const db = getDatabase();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const consentAt = now;
  const privacyPolicyVersion = data.privacyPolicyVersion || 'v1.0';

  await db.run(
    `INSERT INTO Enquiry (
      id, name, phone, whatsapp, email, projectId, purpose, budget, preferredLocation,
      purchaseTimeline, preferredVisitDate, preferredTime, hearAboutUs, additionalRequirements,
      message, status, source, utmSource, utmMedium, utmCampaign, utmContent, utmTerm,
      consentAt, privacyPolicyVersion, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, data.name, data.phone, data.whatsapp || data.phone, data.email || null, data.projectId || null, data.purpose,
      data.budget || null, data.preferredLocation || null, data.purchaseTimeline || null,
      data.preferredVisitDate || null, data.preferredTime || null, data.hearAboutUs || null,
      data.additionalRequirements || null, data.message || null, data.source || 'Site Visit Landing',
      data.utmSource || null, data.utmMedium || null, data.utmCampaign || null,
      data.utmContent || null, data.utmTerm || null, consentAt, privacyPolicyVersion,
      now, now
    ]
  );

  return getEnquiryById(id);
}

export async function getEnquiryById(id: string) {
  const db = getDatabase();
  return db.get<EnquiryRecord>(
    `SELECT e.*, p.name as projectName 
     FROM Enquiry e 
     LEFT JOIN Project p ON e.projectId = p.id 
     WHERE e.id = ?`,
    [id]
  );
}

export async function getEnquiries(filters: {
  search?: string;
  status?: string;
  projectId?: string;
  limit?: number;
  offset?: number;
} = {}) {
  await ensureSeeded();
  const db = getDatabase();
  let query = `
    SELECT e.*, p.name as projectName 
    FROM Enquiry e 
    LEFT JOIN Project p ON e.projectId = p.id 
    WHERE 1=1
  `;
  const params: any[] = [];

  if (filters.status && filters.status !== 'ALL') {
    query += ' AND e.status = ?';
    params.push(filters.status);
  }

  if (filters.projectId && filters.projectId !== 'ALL') {
    query += ' AND e.projectId = ?';
    params.push(filters.projectId);
  }

  if (filters.search) {
    query += ' AND (e.name LIKE ? OR e.phone LIKE ? OR e.email LIKE ? OR e.preferredLocation LIKE ?)';
    const s = `%${filters.search}%`;
    params.push(s, s, s, s);
  }

  query += ' ORDER BY e.createdAt DESC';

  if (filters.limit) {
    query += ' LIMIT ?';
    params.push(filters.limit);
    if (filters.offset) {
      query += ' OFFSET ?';
      params.push(filters.offset);
    }
  }

  return db.all<EnquiryRecord>(query, params);
}

export async function updateEnquiryStatus(id: string, status: string, notes?: string) {
  const db = getDatabase();
  const now = new Date().toISOString();
  await db.run('UPDATE Enquiry SET status = ?, updatedAt = ? WHERE id = ?', [status, now, id]);

  if (notes) {
    await addFollowUp(id, `Status updated to ${status}. Notes: ${notes}`);
  }

  return getEnquiryById(id);
}

export async function addFollowUp(enquiryId: string, note: string, nextFollowUpAt?: string | null, createdBy = 'PRATHAP (Admin)') {
  const db = getDatabase();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  await db.run(
    `INSERT INTO FollowUp (id, enquiryId, note, nextFollowUpAt, createdBy, createdAt) VALUES (?, ?, ?, ?, ?, ?)`,
    [id, enquiryId, note, nextFollowUpAt || null, createdBy, now]
  );
  return db.get<FollowUpRecord>('SELECT * FROM FollowUp WHERE id = ?', [id]);
}

export async function getFollowUps(enquiryId: string) {
  const db = getDatabase();
  return db.all<FollowUpRecord>('SELECT * FROM FollowUp WHERE enquiryId = ? ORDER BY createdAt DESC', [enquiryId]);
}

// ================= USER MANAGEMENT QUERIES =================
export async function getAllUsers(filters: { status?: string; role?: string; search?: string } = {}) {
  await ensureSeeded();
  const db = getDatabase();
  let query = 'SELECT id, name, phone, whatsapp, email, role, status, enquiryId, notes, createdAt, updatedAt FROM User WHERE 1=1';
  const params: any[] = [];

  if (filters.status && filters.status !== 'ALL') {
    query += ' AND status = ?';
    params.push(filters.status);
  }
  if (filters.role && filters.role !== 'ALL') {
    query += ' AND role = ?';
    params.push(filters.role);
  }
  if (filters.search) {
    query += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)';
    const s = `%${filters.search}%`;
    params.push(s, s, s);
  }

  query += ' ORDER BY createdAt DESC';
  return db.all<UserRecord>(query, params);
}

export async function getUserById(id: string) {
  await ensureSeeded();
  const db = getDatabase();
  return db.get<UserRecord>('SELECT * FROM User WHERE id = ?', [id]);
}

export async function getUserByEmail(email: string) {
  await ensureSeeded();
  const db = getDatabase();
  return db.get<UserRecord>('SELECT * FROM User WHERE LOWER(email) = LOWER(?)', [email.trim()]);
}

export async function getUserByPhone(phone: string) {
  await ensureSeeded();
  const db = getDatabase();
  return db.get<UserRecord>('SELECT * FROM User WHERE phone = ?', [phone.trim()]);
}

export async function createUser(data: {
  name: string;
  phone: string;
  whatsapp?: string | null;
  email: string;
  passwordHash: string;
  role?: 'user' | 'admin';
  status?: 'PENDING' | 'APPROVED' | 'DISABLED' | 'REJECTED';
  enquiryId?: string | null;
  notes?: string | null;
}) {
  await ensureSeeded();
  const db = getDatabase();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await db.run(
    `INSERT INTO User (id, name, phone, whatsapp, email, passwordHash, role, status, enquiryId, notes, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.name,
      data.phone,
      data.whatsapp || data.phone,
      data.email.trim().toLowerCase(),
      data.passwordHash,
      data.role || 'user',
      data.status || 'PENDING',
      data.enquiryId || null,
      data.notes || null,
      now,
      now
    ]
  );

  return getUserById(id);
}

export async function updateUser(id: string, updates: Partial<UserRecord>) {
  const db = getDatabase();
  const now = new Date().toISOString();
  const fields: string[] = [];
  const params: any[] = [];

  for (const [key, val] of Object.entries(updates)) {
    if (key === 'id' || key === 'createdAt') continue;
    fields.push(`${key} = ?`);
    params.push(val);
  }

  fields.push('updatedAt = ?');
  params.push(now);
  params.push(id);

  await db.run(`UPDATE User SET ${fields.join(', ')} WHERE id = ?`, params);
  return getUserById(id);
}

export async function deleteUser(id: string) {
  const db = getDatabase();
  return db.run('DELETE FROM User WHERE id = ?', [id]);
}

/**
 * Approve a Lead and automatically create or activate their customer portal account.
 */
export async function approveLeadToUser(enquiryId: string, initialPassword = 'MKMClient@2026!') {
  const enquiry = await getEnquiryById(enquiryId);
  if (!enquiry) {
    throw new Error('Enquiry not found');
  }

  const db = getDatabase();
  const now = new Date().toISOString();

  // Determine user email or fallback to phone-based email
  const userEmail = enquiry.email && enquiry.email.includes('@')
    ? enquiry.email.trim().toLowerCase()
    : `client_${enquiry.phone}@mkmproperties.com`;

  let existingUser = await getUserByEmail(userEmail);
  if (!existingUser && enquiry.phone) {
    existingUser = await getUserByPhone(enquiry.phone);
  }

  let userId: string;

  if (existingUser) {
    // Activate existing account
    await db.run(
      `UPDATE User SET status = 'APPROVED', enquiryId = ?, updatedAt = ? WHERE id = ?`,
      [enquiry.id, now, existingUser.id]
    );
    userId = existingUser.id;
  } else {
    // Create new approved user account
    const passwordHash = bcrypt.hashSync(initialPassword, 10);
    userId = crypto.randomUUID();
    await db.run(
      `INSERT INTO User (id, name, phone, whatsapp, email, passwordHash, role, status, enquiryId, notes, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, 'user', 'APPROVED', ?, ?, ?, ?)`,
      [
        userId,
        enquiry.name,
        enquiry.phone,
        enquiry.whatsapp || enquiry.phone,
        userEmail,
        passwordHash,
        enquiry.id,
        `Approved from Site Visit Lead #${enquiry.id.slice(0, 8)}. Preferred: ${enquiry.preferredLocation || 'Any'}.`,
        now,
        now
      ]
    );
  }

  // Update enquiry status to SCHEDULED or APPROVED
  await db.run(
    `UPDATE Enquiry SET status = 'APPROVED', approvedUserId = ?, updatedAt = ? WHERE id = ?`,
    [userId, now, enquiry.id]
  );

  // Add follow-up note
  await addFollowUp(
    enquiry.id,
    `Lead approved by Admin. Portal access granted to account: ${userEmail}. Default Password: ${initialPassword}`
  );

  return {
    success: true,
    userId,
    userEmail,
    initialPassword,
    userName: enquiry.name
  };
}

// ================= DOCUMENT QUERIES =================
export async function getAllDocuments(filters: { category?: string; projectId?: string; search?: string } = {}) {
  await ensureSeeded();
  const db = getDatabase();
  let query = `
    SELECT d.*, p.name as projectName 
    FROM Document d 
    LEFT JOIN Project p ON d.projectId = p.id 
    WHERE 1=1
  `;
  const params: any[] = [];

  if (filters.category && filters.category !== 'ALL') {
    query += ' AND d.category = ?';
    params.push(filters.category);
  }
  if (filters.projectId && filters.projectId !== 'ALL') {
    query += ' AND d.projectId = ?';
    params.push(filters.projectId);
  }
  if (filters.search) {
    query += ' AND (d.title LIKE ? OR d.description LIKE ?)';
    const s = `%${filters.search}%`;
    params.push(s, s);
  }

  query += ' ORDER BY d.createdAt DESC';
  return db.all<DocumentRecord>(query, params);
}

export async function getDocumentById(id: string) {
  await ensureSeeded();
  const db = getDatabase();
  return db.get<DocumentRecord>(
    `SELECT d.*, p.name as projectName 
     FROM Document d 
     LEFT JOIN Project p ON d.projectId = p.id 
     WHERE d.id = ?`,
    [id]
  );
}

export async function createDocument(data: {
  title: string;
  description?: string | null;
  category: 'Brochure' | 'Layout' | 'Approval' | 'Legal' | 'Price Sheet';
  fileUrl: string;
  fileSize?: string | null;
  fileType?: string;
  projectId?: string | null;
  isProtected?: number;
}) {
  await ensureSeeded();
  const db = getDatabase();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await db.run(
    `INSERT INTO Document (id, title, description, category, fileUrl, fileSize, fileType, projectId, isProtected, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.title,
      data.description || null,
      data.category,
      data.fileUrl,
      data.fileSize || '1.2 MB',
      data.fileType || 'pdf',
      data.projectId || null,
      data.isProtected !== undefined ? data.isProtected : 1,
      now,
      now
    ]
  );

  return getDocumentById(id);
}

export async function updateDocument(id: string, updates: Partial<DocumentRecord>) {
  const db = getDatabase();
  const now = new Date().toISOString();
  const fields: string[] = [];
  const params: any[] = [];

  for (const [key, val] of Object.entries(updates)) {
    if (key === 'id' || key === 'createdAt') continue;
    fields.push(`${key} = ?`);
    params.push(val);
  }

  fields.push('updatedAt = ?');
  params.push(now);
  params.push(id);

  await db.run(`UPDATE Document SET ${fields.join(', ')} WHERE id = ?`, params);
  return getDocumentById(id);
}

export async function deleteDocument(id: string) {
  const db = getDatabase();
  return db.run('DELETE FROM Document WHERE id = ?', [id]);
}

// ================= SITE CONTENT QUERIES =================
export async function getSiteContent(key: string) {
  await ensureSeeded();
  const db = getDatabase();
  return db.get<SiteContentRecord>('SELECT * FROM SiteContent WHERE key = ?', [key]);
}

export async function getAllSiteContents() {
  await ensureSeeded();
  const db = getDatabase();
  return db.all<SiteContentRecord>('SELECT * FROM SiteContent ORDER BY key ASC');
}

export async function setSiteContent(key: string, content: string, title?: string) {
  await ensureSeeded();
  const db = getDatabase();
  const now = new Date().toISOString();
  await db.run(
    `INSERT INTO SiteContent (key, title, content, updatedAt)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET title = excluded.title, content = excluded.content, updatedAt = excluded.updatedAt`,
    [key, title || null, content, now]
  );
  return getSiteContent(key);
}

// Legacy AdminUser query
export async function getAdminByEmail(email: string) {
  await ensureSeeded();
  const db = getDatabase();
  return db.get<AdminUserRecord>('SELECT * FROM AdminUser WHERE LOWER(email) = LOWER(?)', [email.trim()]);
}

// ================= SECTIONS & PLOTS QUERIES =================
export async function getSectionsByProjectId(projectId: string) {
  await ensureSeeded();
  const db = getDatabase();
  return db.all<ProjectSectionRecord>(
    'SELECT * FROM ProjectSection WHERE projectId = ? ORDER BY sectionCode ASC',
    [projectId]
  );
}

export async function getPlotsByProjectId(projectId: string, sectionCode?: string) {
  await ensureSeeded();
  const db = getDatabase();
  if (sectionCode && sectionCode !== 'ALL') {
    return db.all<LayoutPlotRecord>(
      'SELECT * FROM LayoutPlot WHERE projectId = ? AND sectionCode = ? ORDER BY CAST(plotNumber AS INTEGER), plotNumber ASC',
      [projectId, sectionCode]
    );
  }
  return db.all<LayoutPlotRecord>(
    'SELECT * FROM LayoutPlot WHERE projectId = ? ORDER BY sectionCode ASC, CAST(plotNumber AS INTEGER), plotNumber ASC',
    [projectId]
  );
}

export async function getPlotById(id: string) {
  await ensureSeeded();
  const db = getDatabase();
  return db.get<LayoutPlotRecord>('SELECT * FROM LayoutPlot WHERE id = ?', [id]);
}

export async function createOrUpdateSection(data: Partial<ProjectSectionRecord> & { projectId: string; sectionCode: string }) {
  await ensureSeeded();
  const db = getDatabase();
  const now = new Date().toISOString();
  const existing = await db.get<ProjectSectionRecord>(
    'SELECT * FROM ProjectSection WHERE projectId = ? AND sectionCode = ?',
    [data.projectId, data.sectionCode]
  );

  if (existing) {
    await db.run(
      `UPDATE ProjectSection SET sectionName = ?, pricePerSqFt = ?, roadWidth = ?, description = ?, updatedAt = ? WHERE id = ?`,
      [
        data.sectionName ?? existing.sectionName,
        data.pricePerSqFt ?? existing.pricePerSqFt,
        data.roadWidth ?? existing.roadWidth,
        data.description ?? existing.description,
        now,
        existing.id
      ]
    );
    return db.get<ProjectSectionRecord>('SELECT * FROM ProjectSection WHERE id = ?', [existing.id]);
  } else {
    const id = crypto.randomUUID();
    await db.run(
      `INSERT INTO ProjectSection (id, projectId, sectionCode, sectionName, pricePerSqFt, roadWidth, description, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.projectId,
        data.sectionCode,
        data.sectionName || `Section ${data.sectionCode}`,
        data.pricePerSqFt || 1500,
        data.roadWidth || '30 ft',
        data.description || '',
        now,
        now
      ]
    );
    return db.get<ProjectSectionRecord>('SELECT * FROM ProjectSection WHERE id = ?', [id]);
  }
}

export async function createPlot(data: Omit<LayoutPlotRecord, 'id' | 'createdAt' | 'updatedAt'>) {
  await ensureSeeded();
  const db = getDatabase();
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  await db.run(
    `INSERT INTO LayoutPlot (id, projectId, sectionCode, plotNumber, areaSqFt, dimensions, facing, roadWidth, status, cornerPremiumPercent, notes, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.projectId,
      data.sectionCode,
      data.plotNumber,
      data.areaSqFt,
      data.dimensions || null,
      data.facing || 'East Facing',
      data.roadWidth || '30 ft',
      data.status || 'Available',
      data.cornerPremiumPercent || 0,
      data.notes || null,
      now,
      now
    ]
  );
  return db.get<LayoutPlotRecord>('SELECT * FROM LayoutPlot WHERE id = ?', [id]);
}

export async function updatePlot(id: string, data: Partial<LayoutPlotRecord>) {
  await ensureSeeded();
  const db = getDatabase();
  const now = new Date().toISOString();
  const existing = await getPlotById(id);
  if (!existing) return null;

  await db.run(
    `UPDATE LayoutPlot SET
      sectionCode = ?, plotNumber = ?, areaSqFt = ?, dimensions = ?, facing = ?,
      roadWidth = ?, status = ?, cornerPremiumPercent = ?, notes = ?, updatedAt = ?
     WHERE id = ?`,
    [
      data.sectionCode ?? existing.sectionCode,
      data.plotNumber ?? existing.plotNumber,
      data.areaSqFt ?? existing.areaSqFt,
      data.dimensions ?? existing.dimensions,
      data.facing ?? existing.facing,
      data.roadWidth ?? existing.roadWidth,
      data.status ?? existing.status,
      data.cornerPremiumPercent ?? existing.cornerPremiumPercent,
      data.notes ?? existing.notes,
      now,
      id
    ]
  );
  return getPlotById(id);
}

export async function deletePlot(id: string) {
  await ensureSeeded();
  const db = getDatabase();
  const res = await db.run('DELETE FROM LayoutPlot WHERE id = ?', [id]);
  return Boolean(res.changes && res.changes > 0);
}

export async function updateProjectBrochures(id: string, brochureUrl: string, priceBrochureUrl?: string) {
  await ensureSeeded();
  const db = getDatabase();
  const now = new Date().toISOString();
  await db.run(
    'UPDATE Project SET brochureUrl = ?, priceBrochureUrl = COALESCE(?, priceBrochureUrl), updatedAt = ? WHERE id = ?',
    [brochureUrl, priceBrochureUrl || null, now, id]
  );
  return getProjectById(id);
}
