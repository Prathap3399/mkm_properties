const fs = require('fs');
const path = require('path');

function createSimplePdf(title, location, details) {
  // Simple PDF 1.4 template with valid cross-reference table
  const lines = [
    `MKM PROPERTIES - TRICHY`,
    `Project: ${title}`,
    `Location: ${location}`,
    `Contact Person: PRATHAP (Mobile: +91 96290 48171)`,
    `----------------------------------------------------`,
    `PROJECT HIGHLIGHTS:`,
    ...details.map(d => `- ${d}`),
    ``,
    `Legal & Documentation: Verified documents, immediate registration support.`,
    `Site Visit: Free site visit cab arrangement available upon booking.`,
    `Official Website: https://mkmproperties.com`
  ];

  let textStream = 'BT /F1 16 Tf 50 750 Td (MKM PROPERTIES - TRICHY) Tj ET\n';
  let y = 710;
  textStream += `BT /F1 20 Tf 50 ${y} Td (${title}) Tj ET\n`;
  y -= 30;
  textStream += `BT /F1 12 Tf 50 ${y} Td (Location: ${location}) Tj ET\n`;
  y -= 20;
  textStream += `BT /F1 12 Tf 50 ${y} Td (Contact: PRATHAP - 9629048171) Tj ET\n`;
  y -= 30;
  textStream += `BT /F1 11 Tf 50 ${y} Td (----------------------------------------------------------------) Tj ET\n`;
  y -= 25;

  for (const item of details) {
    textStream += `BT /F1 11 Tf 50 ${y} Td (${item}) Tj ET\n`;
    y -= 20;
  }
  y -= 20;
  textStream += `BT /F1 10 Tf 50 ${y} Td (For site visits and verified plot reservations, call: 9629048171) Tj ET\n`;

  const streamLength = Buffer.byteLength(textStream, 'utf-8');

  const pdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length ${streamLength} >>
stream
${textStream}
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000224 00000 n 
0000000${(280 + streamLength).toString().padStart(3, '0')} 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
${350 + streamLength}
%%EOF`;

  return Buffer.from(pdf, 'utf-8');
}

const brochuresDir = path.join(__dirname, '..', 'public', 'brochures');
if (!fs.existsSync(brochuresDir)) {
  fs.mkdirSync(brochuresDir, { recursive: true });
}

const projects = [
  {
    file: 'mkm-sterling-avenue-brochure.pdf',
    title: 'Sterling Avenue',
    location: 'K.K. Nagar Extension / Manikandam, Trichy',
    details: [
      'Gated community layout with wide 30ft and 40ft blacktop roads.',
      'Clear title deeds, DTCP approved, ready for immediate construction.',
      'Groundwater at sweet potable level, electricity lines connected.',
      'Sizes ranging from 1200 sq.ft to 2400 sq.ft.',
      'Very close to prominent schools and 10 mins from Central Bus Stand.'
    ]
  },
  {
    file: 'mkm-ritz-landmark-brochure.pdf',
    title: 'Ritz Landmark Avenue',
    location: 'Panjappur, Trichy (Near New Integrated Bus Terminal)',
    details: [
      'Prime high-growth investment destination near Panjappur New Bus Stand.',
      'Direct highway connectivity with rapid price appreciation.',
      'Solar street lighting, avenue trees, and concrete storm water drainage.',
      'Bank loan assistance arranged with leading nationalized banks.'
    ]
  },
  {
    file: 'mkm-rainbow-city-brochure.pdf',
    title: 'Rainbow City',
    location: 'Samayapuram, Trichy',
    details: [
      'Serene township environment just off the Chennai-Trichy Highway.',
      'Walking distance from renowned educational institutions and shrines.',
      'Full compound wall protection with 24/7 layout maintenance.',
      'Affordable investment plots starting with easy registration.'
    ]
  },
  {
    file: 'mkm-elegant-avenue-brochure.pdf',
    title: 'Elegant Avenue',
    location: 'Navalpattu IT Park Road, Trichy',
    details: [
      'Located directly in the burgeoning IT Corridor of Trichy.',
      'Ideal for IT professionals and high-yield residential construction.',
      'Fast developing residential neighbourhood with immediate bus facility.'
    ]
  },
  {
    file: 'mkm-glorious-town-brochure.pdf',
    title: 'Glorious Town',
    location: 'Thiruverumbur, Trichy (Near BHEL & NIT)',
    details: [
      'Strategic residential enclave in the industrial & academic belt.',
      'Minutes away from NIT Trichy, BHEL Main Gate, and Thiruverumbur Station.',
      'Planned wide 30ft avenue roads with stormwater drainage system.',
      'Sweet groundwater level and fast-growing capital appreciation potential.'
    ]
  },
  {
    file: 'mkm-samayapuram-highway-brochure.pdf',
    title: 'Samayapuram Highway Property',
    location: 'NH-45 Trichy-Chennai National Highway, Samayapuram',
    details: [
      'Direct national highway frontage suitable for commercial & residential plots.',
      'Heavy vehicular movement and supreme commercial visibility.',
      'Spot registration with verified title deeds.'
    ]
  }
];

for (const p of projects) {
  const buf = createSimplePdf(p.title, p.location, p.details);
  fs.writeFileSync(path.join(brochuresDir, p.file), buf);
  console.log('Created brochure:', p.file);
}
