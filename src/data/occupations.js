// ── Australian Skilled Occupation Data ─────────────────────────────────────
// Sources: Home Affairs MLTSSL/STSOL/PMSOL, Jobs and Skills Australia
// IMPORTANT: Occupation list status changes — always verify at
// immi.homeaffairs.gov.au before lodging an EOI.
// Last reviewed: July 2026

export const CATEGORIES = [
  { id: 'all',          label: 'All Occupations'       },
  { id: 'ict',          label: 'ICT & Technology'       },
  { id: 'engineering',  label: 'Engineering'            },
  { id: 'healthcare',   label: 'Healthcare'             },
  { id: 'accounting',   label: 'Accounting & Finance'   },
  { id: 'construction', label: 'Construction & Architecture' },
  { id: 'education',    label: 'Education'              },
  { id: 'hospitality',  label: 'Hospitality'            },
  { id: 'trades',       label: 'Trades & Technical'     },
  { id: 'science',      label: 'Science & Environment'  },
  { id: 'social',       label: 'Social & Community'     },
];

// What visas each list qualifies for
export const LIST_VISA_ELIGIBILITY = {
  MLTSSL: {
    label:   'MLTSSL',
    color:   '#ccff00',
    textColor:'#000',
    full:    'Medium and Long-term Strategic Skills List',
    visas:   ['189', '190', '491', '482 (MT stream)', '186 (DE)'],
    desc:    'Qualifies for the widest range of skilled visas including the Skilled Independent (189).',
  },
  STSOL: {
    label:   'STSOL',
    color:   '#00d4ff',
    textColor:'#000',
    full:    'Short-term Skilled Occupation List',
    visas:   ['482 (ST stream)', '190 (some states)', '491 (some states)'],
    desc:    'Primarily for employer-sponsored short-term work (482). Max 2-year visa duration.',
  },
  PMSOL: {
    label:   'PMSOL',
    color:   '#ff6b6b',
    textColor:'#fff',
    full:    'Priority Migration Skilled Occupation List',
    visas:   ['189', '190', '491', '482 (MT stream)', '186 (DE)'],
    desc:    'Same visas as MLTSSL but receives priority invitation rounds in SkillSelect.',
  },
  ROL: {
    label:   'ROL',
    color:   '#f59e0b',
    textColor:'#000',
    full:    'Regional Occupation List',
    visas:   ['491', '494', '191'],
    desc:    'Used for regional visa streams. Encourages settlement outside major cities.',
  },
};

export const DEMAND_LEVELS = {
  'Critical':  { color: '#ff3b3b', bg: 'rgba(255,59,59,0.1)'  },
  'Very High': { color: '#ff6b00', bg: 'rgba(255,107,0,0.1)'  },
  'High':      { color: '#ccff00', bg: 'rgba(204,255,0,0.1)'  },
  'Medium':    { color: '#00d4ff', bg: 'rgba(0,212,255,0.1)'  },
  'Low':       { color: '#999',    bg: 'rgba(153,153,153,0.1)' },
};

export const ASSESSING_BODIES = {
  ACS:       { name: 'Australian Computer Society',             url: 'https://www.acs.org.au/msa.html'              },
  EA:        { name: 'Engineers Australia',                     url: 'https://www.engineersaustralia.org.au'         },
  AICD:      { name: 'Australian Institute of Company Directors',url: 'https://www.aicd.com.au'                     },
  CPA:       { name: 'CPA Australia / CAANZ / IPA',            url: 'https://www.cpaaustralia.com.au'              },
  AHPRA:     { name: 'AHPRA',                                   url: 'https://www.ahpra.gov.au'                     },
  ANMAC:     { name: 'Australian Nursing and Midwifery Accreditation Council', url: 'https://anmac.org.au'         },
  VETASSESS: { name: 'VETASSESS',                               url: 'https://www.vetassess.com.au'                 },
  TRA:       { name: 'Trades Recognition Australia',            url: 'https://www.tradesrecognitionaustralia.gov.au' },
  AITSL:     { name: 'Australian Institute for Teaching and School Leadership', url: 'https://www.aitsl.edu.au'   },
  SCA:       { name: 'Society of Construction Accountants',     url: 'https://www.sca.org.au'                      },
  AIQS:      { name: 'Australian Institute of Quantity Surveyors', url: 'https://www.aiqs.com.au'                  },
  RAIA:      { name: 'Architects Accreditation Council',        url: 'https://www.aaca.org.au'                     },
  ACECQA:    { name: 'ACECQA',                                  url: 'https://www.acecqa.gov.au'                    },
  TEQSA:     { name: 'TEQSA / University',                      url: 'https://www.teqsa.gov.au'                    },
  AACA:      { name: 'Architects Accreditation Council of Australia', url: 'https://www.aaca.org.au'               },
};

// State nomination codes
const ALL_STATES = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export const OCCUPATIONS = [

  // ── ICT & Technology ────────────────────────────────────────────────────
  {
    id: '135112', title: 'ICT Project Manager',         category: 'ict',
    list: 'MLTSSL', assessing: 'ACS', demand: 'Very High',
    salary: { min: 110000, max: 170000, median: 135000 },
    stateNomination: ALL_STATES,
    description: 'Plans, coordinates and oversees ICT projects from inception to delivery.',
    altTitles: ['Project Manager', 'IT Project Manager', 'Scrum Master'],
  },
  {
    id: '261111', title: 'ICT Business Analyst',        category: 'ict',
    list: 'MLTSSL', assessing: 'ACS', demand: 'Very High',
    salary: { min: 90000, max: 140000, median: 112000 },
    stateNomination: ALL_STATES,
    description: 'Analyses business processes and requirements to design ICT solutions.',
    altTitles: ['Business Analyst', 'BA', 'Requirements Analyst'],
  },
  {
    id: '261112', title: 'Systems Analyst',             category: 'ict',
    list: 'MLTSSL', assessing: 'ACS', demand: 'High',
    salary: { min: 90000, max: 135000, median: 108000 },
    stateNomination: ALL_STATES,
    description: 'Analyses system requirements and designs technical specifications.',
    altTitles: ['System Analyst', 'IT Analyst'],
  },
  {
    id: '261211', title: 'Multimedia Specialist',       category: 'ict',
    list: 'MLTSSL', assessing: 'ACS', demand: 'Medium',
    salary: { min: 65000, max: 105000, median: 82000 },
    stateNomination: ['NSW', 'VIC', 'QLD', 'WA'],
    description: 'Creates multimedia content including animations, video and interactive media.',
    altTitles: ['UX/UI Designer', 'Multimedia Designer', 'Digital Designer'],
  },
  {
    id: '261212', title: 'Web Developer',               category: 'ict',
    list: 'MLTSSL', assessing: 'ACS', demand: 'High',
    salary: { min: 75000, max: 130000, median: 98000 },
    stateNomination: ALL_STATES,
    description: 'Designs and develops websites and web applications.',
    altTitles: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer'],
  },
  {
    id: '261311', title: 'Analyst Programmer',          category: 'ict',
    list: 'MLTSSL', assessing: 'ACS', demand: 'High',
    salary: { min: 85000, max: 130000, median: 105000 },
    stateNomination: ALL_STATES,
    description: 'Analyses user requirements and writes, tests and maintains code.',
    altTitles: ['Programmer', 'Application Developer'],
  },
  {
    id: '261312', title: 'Developer Programmer',        category: 'ict',
    list: 'MLTSSL', assessing: 'ACS', demand: 'High',
    salary: { min: 85000, max: 130000, median: 105000 },
    stateNomination: ALL_STATES,
    description: 'Designs, writes, tests and maintains computer programs.',
    altTitles: ['Software Developer', 'Coder', 'Programmer'],
  },
  {
    id: '261313', title: 'Software Engineer',           category: 'ict',
    list: 'MLTSSL', assessing: 'ACS', demand: 'Critical',
    salary: { min: 95000, max: 165000, median: 125000 },
    stateNomination: ALL_STATES,
    description: 'Applies engineering principles to design, develop and maintain complex software systems.',
    altTitles: ['Senior Software Engineer', 'Software Architect', 'Platform Engineer'],
  },
  {
    id: '261314', title: 'Software Tester',             category: 'ict',
    list: 'MLTSSL', assessing: 'ACS', demand: 'High',
    salary: { min: 75000, max: 120000, median: 95000 },
    stateNomination: ALL_STATES,
    description: 'Plans and executes software testing to ensure quality and functionality.',
    altTitles: ['QA Engineer', 'Test Engineer', 'Automation Tester'],
  },
  {
    id: '262111', title: 'Database Administrator',      category: 'ict',
    list: 'MLTSSL', assessing: 'ACS', demand: 'High',
    salary: { min: 90000, max: 140000, median: 110000 },
    stateNomination: ALL_STATES,
    description: 'Installs, configures, upgrades and maintains database management systems.',
    altTitles: ['DBA', 'Database Engineer', 'Data Engineer'],
  },
  {
    id: '262112', title: 'ICT Security Specialist',     category: 'ict',
    list: 'MLTSSL', assessing: 'ACS', demand: 'Critical',
    salary: { min: 100000, max: 175000, median: 135000 },
    stateNomination: ALL_STATES,
    description: 'Protects computer systems and networks from cyber threats.',
    altTitles: ['Cyber Security Analyst', 'Information Security Analyst', 'Penetration Tester'],
  },
  {
    id: '262113', title: 'Systems Administrator',       category: 'ict',
    list: 'MLTSSL', assessing: 'ACS', demand: 'High',
    salary: { min: 80000, max: 130000, median: 100000 },
    stateNomination: ALL_STATES,
    description: 'Manages and maintains server infrastructure and IT operations.',
    altTitles: ['Sysadmin', 'Linux Administrator', 'Cloud Administrator'],
  },
  {
    id: '263111', title: 'Computer Network and Systems Engineer', category: 'ict',
    list: 'MLTSSL', assessing: 'ACS', demand: 'High',
    salary: { min: 90000, max: 145000, median: 115000 },
    stateNomination: ALL_STATES,
    description: 'Designs, installs and manages computer networks and telecommunications systems.',
    altTitles: ['Network Engineer', 'Infrastructure Engineer', 'Cloud Network Engineer'],
  },
  {
    id: '263112', title: 'Network Administrator',       category: 'ict',
    list: 'MLTSSL', assessing: 'ACS', demand: 'High',
    salary: { min: 80000, max: 125000, median: 100000 },
    stateNomination: ALL_STATES,
    description: 'Administers and maintains network hardware, software and security.',
    altTitles: ['NOC Engineer', 'Network Support Engineer'],
  },
  {
    id: '263211', title: 'ICT Quality Assurance Engineer', category: 'ict',
    list: 'MLTSSL', assessing: 'ACS', demand: 'Medium',
    salary: { min: 80000, max: 125000, median: 98000 },
    stateNomination: ['NSW', 'VIC', 'QLD', 'WA', 'SA'],
    description: 'Develops and maintains quality assurance processes for ICT systems.',
    altTitles: ['QA Engineer', 'Quality Engineer'],
  },
  {
    id: '263212', title: 'ICT Support Engineer',        category: 'ict',
    list: 'MLTSSL', assessing: 'ACS', demand: 'Medium',
    salary: { min: 65000, max: 105000, median: 82000 },
    stateNomination: ['NSW', 'VIC', 'QLD', 'WA'],
    description: 'Provides technical support and maintains ICT systems for users.',
    altTitles: ['Technical Support Engineer', 'IT Support Specialist'],
  },
  {
    id: '263299', title: 'ICT Support and Test Engineers NEC', category: 'ict',
    list: 'MLTSSL', assessing: 'ACS', demand: 'Medium',
    salary: { min: 65000, max: 110000, median: 85000 },
    stateNomination: ['NSW', 'VIC', 'QLD'],
    description: 'ICT support and testing roles not elsewhere classified.',
    altTitles: ['DevOps Engineer', 'Site Reliability Engineer', 'Platform Engineer'],
  },

  // ── Engineering ─────────────────────────────────────────────────────────
  {
    id: '231211', title: 'Architect',                   category: 'construction',
    list: 'MLTSSL', assessing: 'AACA', demand: 'High',
    salary: { min: 80000, max: 140000, median: 105000 },
    stateNomination: ALL_STATES,
    description: 'Designs buildings and structures, and oversees their construction.',
    altTitles: ['Building Architect', 'Residential Architect'],
  },
  {
    id: '233111', title: 'Chemical Engineer',           category: 'engineering',
    list: 'MLTSSL', assessing: 'EA', demand: 'High',
    salary: { min: 90000, max: 150000, median: 115000 },
    stateNomination: ALL_STATES,
    description: 'Designs and oversees processes for manufacturing chemicals and related products.',
    altTitles: ['Process Engineer', 'Petrochemical Engineer'],
  },
  {
    id: '233211', title: 'Civil Engineer',              category: 'engineering',
    list: 'MLTSSL', assessing: 'EA', demand: 'Very High',
    salary: { min: 90000, max: 155000, median: 118000 },
    stateNomination: ALL_STATES,
    description: 'Designs and oversees construction of infrastructure including roads, bridges and buildings.',
    altTitles: ['Infrastructure Engineer', 'Civil Design Engineer'],
  },
  {
    id: '233212', title: 'Geotechnical Engineer',       category: 'engineering',
    list: 'MLTSSL', assessing: 'EA', demand: 'High',
    salary: { min: 95000, max: 155000, median: 120000 },
    stateNomination: ALL_STATES,
    description: 'Investigates subsurface conditions for construction projects.',
    altTitles: ['Geomechanics Engineer'],
  },
  {
    id: '233213', title: 'Quantity Surveyor',           category: 'construction',
    list: 'MLTSSL', assessing: 'AIQS', demand: 'High',
    salary: { min: 80000, max: 145000, median: 108000 },
    stateNomination: ALL_STATES,
    description: 'Estimates and manages costs for construction projects.',
    altTitles: ['Cost Manager', 'Estimator', 'Cost Planner'],
  },
  {
    id: '233214', title: 'Structural Engineer',         category: 'engineering',
    list: 'MLTSSL', assessing: 'EA', demand: 'Very High',
    salary: { min: 95000, max: 160000, median: 122000 },
    stateNomination: ALL_STATES,
    description: 'Analyses and designs structural components of buildings and infrastructure.',
    altTitles: ['Structures Engineer'],
  },
  {
    id: '233215', title: 'Transport Engineer',          category: 'engineering',
    list: 'MLTSSL', assessing: 'EA', demand: 'High',
    salary: { min: 90000, max: 155000, median: 115000 },
    stateNomination: ALL_STATES,
    description: 'Plans and designs road and traffic systems.',
    altTitles: ['Traffic Engineer', 'Road Design Engineer'],
  },
  {
    id: '233311', title: 'Electrical Engineer',         category: 'engineering',
    list: 'MLTSSL', assessing: 'EA', demand: 'Very High',
    salary: { min: 95000, max: 160000, median: 125000 },
    stateNomination: ALL_STATES,
    description: 'Designs, develops and maintains electrical systems and equipment.',
    altTitles: ['Power Systems Engineer', 'Electrical Design Engineer'],
  },
  {
    id: '233411', title: 'Electronics Engineer',        category: 'engineering',
    list: 'MLTSSL', assessing: 'EA', demand: 'High',
    salary: { min: 90000, max: 150000, median: 115000 },
    stateNomination: ALL_STATES,
    description: 'Designs and develops electronic components and systems.',
    altTitles: ['Embedded Systems Engineer', 'Hardware Engineer'],
  },
  {
    id: '233511', title: 'Industrial Engineer',         category: 'engineering',
    list: 'MLTSSL', assessing: 'EA', demand: 'High',
    salary: { min: 88000, max: 145000, median: 112000 },
    stateNomination: ALL_STATES,
    description: 'Improves organisational efficiency, productivity and quality systems.',
    altTitles: ['Process Improvement Engineer', 'Lean Engineer'],
  },
  {
    id: '233512', title: 'Mechanical Engineer',         category: 'engineering',
    list: 'MLTSSL', assessing: 'EA', demand: 'Very High',
    salary: { min: 90000, max: 155000, median: 120000 },
    stateNomination: ALL_STATES,
    description: 'Designs, tests and maintains mechanical systems and machinery.',
    altTitles: ['Design Engineer', 'Mechanical Design Engineer'],
  },
  {
    id: '233611', title: 'Mining Engineer',             category: 'engineering',
    list: 'MLTSSL', assessing: 'EA', demand: 'Critical',
    salary: { min: 110000, max: 190000, median: 145000 },
    stateNomination: ['WA', 'QLD', 'NSW', 'SA', 'NT'],
    description: 'Plans and oversees the extraction of minerals from the earth.',
    altTitles: ['Underground Mining Engineer', 'Open Pit Engineer'],
  },
  {
    id: '233612', title: 'Petroleum Engineer',          category: 'engineering',
    list: 'MLTSSL', assessing: 'EA', demand: 'High',
    salary: { min: 110000, max: 185000, median: 145000 },
    stateNomination: ['WA', 'QLD', 'NT', 'SA'],
    description: 'Designs methods for extracting oil and gas from the earth.',
    altTitles: ['Drilling Engineer', 'Reservoir Engineer'],
  },
  {
    id: '233999', title: 'Engineering Professionals NEC', category: 'engineering',
    list: 'MLTSSL', assessing: 'EA', demand: 'High',
    salary: { min: 88000, max: 150000, median: 115000 },
    stateNomination: ALL_STATES,
    description: 'Engineering roles not elsewhere classified including environmental and biomedical engineering.',
    altTitles: ['Environmental Engineer', 'Biomedical Engineer', 'Renewable Energy Engineer'],
  },
  {
    id: '133111', title: 'Construction Project Manager', category: 'construction',
    list: 'MLTSSL', assessing: 'VETASSESS', demand: 'Very High',
    salary: { min: 105000, max: 175000, median: 135000 },
    stateNomination: ALL_STATES,
    description: 'Plans, coordinates and manages construction projects from start to completion.',
    altTitles: ['Project Manager (Construction)', 'Site Manager', 'Construction Manager'],
  },

  // ── Healthcare ───────────────────────────────────────────────────────────
  {
    id: '253111', title: 'General Medical Practitioner', category: 'healthcare',
    list: 'PMSOL', assessing: 'AHPRA', demand: 'Critical',
    salary: { min: 150000, max: 350000, median: 220000 },
    stateNomination: ALL_STATES,
    description: 'Provides primary and comprehensive healthcare to patients of all ages.',
    altTitles: ['GP', 'General Practitioner', 'Family Doctor'],
  },
  {
    id: '253311', title: 'Hospital Pharmacist',          category: 'healthcare',
    list: 'MLTSSL', assessing: 'AHPRA', demand: 'Very High',
    salary: { min: 85000, max: 130000, median: 105000 },
    stateNomination: ALL_STATES,
    description: 'Prepares and dispenses medications in hospital settings.',
    altTitles: ['Clinical Pharmacist', 'Pharmacist'],
  },
  {
    id: '253312', title: 'Retail Pharmacist',            category: 'healthcare',
    list: 'MLTSSL', assessing: 'AHPRA', demand: 'Very High',
    salary: { min: 80000, max: 125000, median: 100000 },
    stateNomination: ALL_STATES,
    description: 'Dispenses medications and provides health advice in retail settings.',
    altTitles: ['Community Pharmacist', 'Dispensary Pharmacist'],
  },
  {
    id: '254411', title: 'Registered Nurse (Critical Care)', category: 'healthcare',
    list: 'PMSOL', assessing: 'ANMAC', demand: 'Critical',
    salary: { min: 75000, max: 110000, median: 90000 },
    stateNomination: ALL_STATES,
    description: 'Provides intensive care nursing for critically ill patients.',
    altTitles: ['ICU Nurse', 'Critical Care Nurse'],
  },
  {
    id: '254414', title: 'Registered Nurse (Medical)',   category: 'healthcare',
    list: 'PMSOL', assessing: 'ANMAC', demand: 'Critical',
    salary: { min: 72000, max: 108000, median: 88000 },
    stateNomination: ALL_STATES,
    description: 'Provides nursing care in medical wards and clinical settings.',
    altTitles: ['RN', 'Registered Nurse', 'Clinical Nurse'],
  },
  {
    id: '254422', title: 'Registered Nurse (NEC)',       category: 'healthcare',
    list: 'PMSOL', assessing: 'ANMAC', demand: 'Critical',
    salary: { min: 72000, max: 108000, median: 88000 },
    stateNomination: ALL_STATES,
    description: 'Registered nurses in specialities not elsewhere classified.',
    altTitles: ['Perioperative Nurse', 'Paediatric Nurse', 'Aged Care Nurse'],
  },
  {
    id: '252411', title: 'Occupational Therapist',       category: 'healthcare',
    list: 'MLTSSL', assessing: 'AHPRA', demand: 'Very High',
    salary: { min: 72000, max: 110000, median: 88000 },
    stateNomination: ALL_STATES,
    description: 'Helps people participate in daily activities after illness, injury or disability.',
    altTitles: ['OT', 'Community OT'],
  },
  {
    id: '252511', title: 'Physiotherapist',              category: 'healthcare',
    list: 'MLTSSL', assessing: 'AHPRA', demand: 'Very High',
    salary: { min: 70000, max: 115000, median: 88000 },
    stateNomination: ALL_STATES,
    description: 'Assesses and treats physical conditions through exercise and manual therapy.',
    altTitles: ['Physio', 'Sports Physiotherapist'],
  },
  {
    id: '252711', title: 'Medical Diagnostic Radiographer', category: 'healthcare',
    list: 'MLTSSL', assessing: 'AHPRA', demand: 'High',
    salary: { min: 75000, max: 115000, median: 93000 },
    stateNomination: ALL_STATES,
    description: 'Performs diagnostic imaging including X-rays, CT, MRI and ultrasound.',
    altTitles: ['Radiographer', 'Medical Imaging Technologist'],
  },
  {
    id: '252311', title: 'Dentist',                      category: 'healthcare',
    list: 'MLTSSL', assessing: 'AHPRA', demand: 'Very High',
    salary: { min: 100000, max: 200000, median: 145000 },
    stateNomination: ALL_STATES,
    description: 'Diagnoses and treats diseases and disorders of teeth and gums.',
    altTitles: ['General Dentist', 'Dental Surgeon'],
  },
  {
    id: '272311', title: 'Clinical Psychologist',        category: 'healthcare',
    list: 'MLTSSL', assessing: 'AHPRA', demand: 'Very High',
    salary: { min: 85000, max: 145000, median: 110000 },
    stateNomination: ALL_STATES,
    description: 'Assesses and treats mental health disorders through psychological therapies.',
    altTitles: ['Psychologist', 'Mental Health Psychologist'],
  },
  {
    id: '251511', title: 'Pharmacist',                   category: 'healthcare',
    list: 'MLTSSL', assessing: 'AHPRA', demand: 'Very High',
    salary: { min: 80000, max: 125000, median: 100000 },
    stateNomination: ALL_STATES,
    description: 'Prepares and dispenses medications and advises on their safe use.',
    altTitles: ['Community Pharmacist', 'Clinical Pharmacist'],
  },
  {
    id: '253321', title: 'Specialist Medical Practitioner', category: 'healthcare',
    list: 'PMSOL', assessing: 'AHPRA', demand: 'Critical',
    salary: { min: 200000, max: 500000, median: 300000 },
    stateNomination: ALL_STATES,
    description: 'Medical specialists in fields such as cardiology, surgery, psychiatry.',
    altTitles: ['Cardiologist', 'Surgeon', 'Psychiatrist', 'Anaesthetist'],
  },

  // ── Accounting & Finance ─────────────────────────────────────────────────
  {
    id: '221111', title: 'Accountant (General)',         category: 'accounting',
    list: 'MLTSSL', assessing: 'CPA', demand: 'High',
    salary: { min: 70000, max: 120000, median: 90000 },
    stateNomination: ALL_STATES,
    description: 'Prepares and examines financial records and ensures regulatory compliance.',
    altTitles: ['Financial Accountant', 'Account Manager', 'Bookkeeper'],
  },
  {
    id: '221112', title: 'Management Accountant',        category: 'accounting',
    list: 'MLTSSL', assessing: 'CPA', demand: 'High',
    salary: { min: 80000, max: 135000, median: 102000 },
    stateNomination: ALL_STATES,
    description: 'Provides financial analysis and reporting to support business decisions.',
    altTitles: ['Finance Manager', 'FP&A Analyst', 'Cost Accountant'],
  },
  {
    id: '221113', title: 'Taxation Accountant',          category: 'accounting',
    list: 'MLTSSL', assessing: 'CPA', demand: 'High',
    salary: { min: 75000, max: 125000, median: 95000 },
    stateNomination: ALL_STATES,
    description: 'Prepares tax returns, provides tax planning advice and ensures compliance.',
    altTitles: ['Tax Adviser', 'Tax Specialist'],
  },
  {
    id: '221213', title: 'External Auditor',             category: 'accounting',
    list: 'MLTSSL', assessing: 'CPA', demand: 'High',
    salary: { min: 80000, max: 140000, median: 105000 },
    stateNomination: ALL_STATES,
    description: 'Examines and verifies the accuracy of financial records and statements.',
    altTitles: ['Auditor', 'Senior Auditor', 'Assurance Manager'],
  },
  {
    id: '221214', title: 'Internal Auditor',             category: 'accounting',
    list: 'MLTSSL', assessing: 'CPA', demand: 'High',
    salary: { min: 80000, max: 140000, median: 105000 },
    stateNomination: ALL_STATES,
    description: 'Reviews internal controls, risk management and operational processes.',
    altTitles: ['Internal Audit Manager', 'Risk Auditor'],
  },
  {
    id: '222311', title: 'Financial Investment Adviser', category: 'accounting',
    list: 'MLTSSL', assessing: 'VETASSESS', demand: 'Medium',
    salary: { min: 80000, max: 155000, median: 110000 },
    stateNomination: ['NSW', 'VIC', 'QLD', 'WA'],
    description: 'Advises clients on investment strategies and financial planning.',
    altTitles: ['Financial Adviser', 'Financial Planner', 'Wealth Adviser'],
  },
  {
    id: '222312', title: 'Financial Investment Manager', category: 'accounting',
    list: 'MLTSSL', assessing: 'VETASSESS', demand: 'Medium',
    salary: { min: 100000, max: 200000, median: 140000 },
    stateNomination: ['NSW', 'VIC'],
    description: 'Manages investment portfolios on behalf of clients or institutions.',
    altTitles: ['Portfolio Manager', 'Fund Manager', 'Asset Manager'],
  },

  // ── Education ────────────────────────────────────────────────────────────
  {
    id: '241111', title: 'Early Childhood Teacher',      category: 'education',
    list: 'MLTSSL', assessing: 'ACECQA', demand: 'Critical',
    salary: { min: 55000, max: 80000, median: 65000 },
    stateNomination: ALL_STATES,
    description: 'Develops and implements educational programs for children aged 0–5 years.',
    altTitles: ['Kindy Teacher', 'Preschool Teacher', 'Childcare Teacher'],
  },
  {
    id: '241411', title: 'Secondary School Teacher',     category: 'education',
    list: 'MLTSSL', assessing: 'AITSL', demand: 'Very High',
    salary: { min: 70000, max: 110000, median: 85000 },
    stateNomination: ALL_STATES,
    description: 'Teaches students in Years 7–12 across specialist subject areas.',
    altTitles: ['High School Teacher', 'STEM Teacher', 'English Teacher'],
  },
  {
    id: '242111', title: 'English as a Second Language Teacher', category: 'education',
    list: 'MLTSSL', assessing: 'AITSL', demand: 'High',
    salary: { min: 65000, max: 100000, median: 80000 },
    stateNomination: ALL_STATES,
    description: 'Teaches English language skills to students for whom English is an additional language.',
    altTitles: ['ESL Teacher', 'TESOL Teacher', 'EAL/D Teacher'],
  },
  {
    id: '241511', title: 'Special Education Teacher',    category: 'education',
    list: 'MLTSSL', assessing: 'AITSL', demand: 'Very High',
    salary: { min: 70000, max: 108000, median: 85000 },
    stateNomination: ALL_STATES,
    description: 'Develops and implements programs for students with disabilities.',
    altTitles: ['Special Needs Teacher', 'Disability Education Teacher'],
  },

  // ── Hospitality ──────────────────────────────────────────────────────────
  {
    id: '351311', title: 'Chef',                         category: 'hospitality',
    list: 'MLTSSL', assessing: 'TRA', demand: 'Very High',
    salary: { min: 55000, max: 90000, median: 68000 },
    stateNomination: ALL_STATES,
    description: 'Plans menus and prepares, cooks and presents food in commercial kitchens.',
    altTitles: ['Head Chef', 'Executive Chef', 'Sous Chef'],
  },
  {
    id: '351411', title: 'Cook',                         category: 'hospitality',
    list: 'STSOL', assessing: 'TRA', demand: 'Very High',
    salary: { min: 48000, max: 72000, median: 58000 },
    stateNomination: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS'],
    description: 'Prepares and cooks food in cafes, restaurants and institutional kitchens.',
    altTitles: ['Line Cook', 'Short Order Cook'],
  },
  {
    id: '141111', title: 'Cafe or Restaurant Manager',   category: 'hospitality',
    list: 'STSOL', assessing: 'VETASSESS', demand: 'High',
    salary: { min: 58000, max: 90000, median: 70000 },
    stateNomination: ['NSW', 'VIC', 'QLD', 'WA', 'TAS'],
    description: 'Manages the operations of a cafe or restaurant.',
    altTitles: ['F&B Manager', 'Restaurant Manager', 'Hospitality Manager'],
  },
  {
    id: '141311', title: 'Hotel or Motel Manager',       category: 'hospitality',
    list: 'STSOL', assessing: 'VETASSESS', demand: 'Medium',
    salary: { min: 65000, max: 105000, median: 80000 },
    stateNomination: ['NSW', 'VIC', 'QLD', 'WA', 'TAS', 'NT'],
    description: 'Manages the overall operations of a hotel or accommodation facility.',
    altTitles: ['Accommodation Manager', 'Resort Manager'],
  },

  // ── Trades & Technical ───────────────────────────────────────────────────
  {
    id: '341111', title: 'Electrician',                  category: 'trades',
    list: 'STSOL', assessing: 'TRA', demand: 'Critical',
    salary: { min: 70000, max: 120000, median: 90000 },
    stateNomination: ALL_STATES,
    description: 'Installs, maintains and repairs electrical systems and equipment.',
    altTitles: ['Licensed Electrician', 'Electrical Tradesperson'],
  },
  {
    id: '334111', title: 'Plumber',                      category: 'trades',
    list: 'STSOL', assessing: 'TRA', demand: 'Very High',
    salary: { min: 70000, max: 115000, median: 88000 },
    stateNomination: ALL_STATES,
    description: 'Installs and repairs water supply, drainage and gas systems.',
    altTitles: ['Licensed Plumber', 'Gasfitter', 'Drainer'],
  },
  {
    id: '331111', title: 'Carpenter',                    category: 'trades',
    list: 'STSOL', assessing: 'TRA', demand: 'Very High',
    salary: { min: 65000, max: 108000, median: 82000 },
    stateNomination: ALL_STATES,
    description: 'Constructs, installs and repairs structures and fixtures made from wood.',
    altTitles: ['Cabinet Maker', 'Joiner', 'Formwork Carpenter'],
  },
  {
    id: '322313', title: 'Welder (First Class)',          category: 'trades',
    list: 'STSOL', assessing: 'TRA', demand: 'High',
    salary: { min: 65000, max: 110000, median: 82000 },
    stateNomination: ['WA', 'QLD', 'NSW', 'SA', 'NT'],
    description: 'Welds metal components using various welding techniques.',
    altTitles: ['Boilermaker', 'Structural Welder', 'Pipe Welder'],
  },
  {
    id: '323214', title: 'Refrigeration and Air Conditioning Mechanic', category: 'trades',
    list: 'STSOL', assessing: 'TRA', demand: 'Very High',
    salary: { min: 70000, max: 115000, median: 88000 },
    stateNomination: ALL_STATES,
    description: 'Installs and maintains refrigeration, air conditioning and climate control systems.',
    altTitles: ['HVAC Technician', 'Air Conditioning Installer', 'Refrigeration Tech'],
  },
  {
    id: '342212', title: 'Electronics Tradesperson',     category: 'trades',
    list: 'STSOL', assessing: 'TRA', demand: 'High',
    salary: { min: 65000, max: 105000, median: 82000 },
    stateNomination: ['NSW', 'VIC', 'QLD', 'WA', 'SA'],
    description: 'Installs, maintains and repairs electronic equipment and systems.',
    altTitles: ['Avionics Technician', 'Communications Technician'],
  },

  // ── Science & Environment ─────────────────────────────────────────────────
  {
    id: '234113', title: 'Environmental Engineer',       category: 'science',
    list: 'MLTSSL', assessing: 'EA', demand: 'High',
    salary: { min: 85000, max: 145000, median: 112000 },
    stateNomination: ALL_STATES,
    description: 'Designs solutions to environmental challenges including water, waste and pollution.',
    altTitles: ['Environmental Consultant', 'Sustainability Engineer'],
  },
  {
    id: '234311', title: 'Environmental Scientist',      category: 'science',
    list: 'MLTSSL', assessing: 'VETASSESS', demand: 'High',
    salary: { min: 75000, max: 125000, median: 95000 },
    stateNomination: ALL_STATES,
    description: 'Studies and analyses environmental conditions and impacts.',
    altTitles: ['Ecologist', 'Environmental Consultant', 'Environmental Officer'],
  },
  {
    id: '234912', title: 'Hydrologist',                  category: 'science',
    list: 'MLTSSL', assessing: 'VETASSESS', demand: 'High',
    salary: { min: 85000, max: 140000, median: 108000 },
    stateNomination: ALL_STATES,
    description: 'Studies the distribution and movement of water in the natural environment.',
    altTitles: ['Water Resources Engineer', 'Hydrogeologist'],
  },
  {
    id: '225113', title: 'Market Research Analyst',      category: 'science',
    list: 'MLTSSL', assessing: 'VETASSESS', demand: 'Medium',
    salary: { min: 70000, max: 115000, median: 88000 },
    stateNomination: ['NSW', 'VIC', 'QLD'],
    description: 'Conducts and analyses market research to support business decisions.',
    altTitles: ['Data Analyst', 'Research Analyst', 'Business Intelligence Analyst'],
  },

  // ── Social & Community ───────────────────────────────────────────────────
  {
    id: '272499', title: 'Social Worker',                category: 'social',
    list: 'MLTSSL', assessing: 'VETASSESS', demand: 'Very High',
    salary: { min: 65000, max: 100000, median: 80000 },
    stateNomination: ALL_STATES,
    description: 'Assists individuals, families and communities with social and emotional challenges.',
    altTitles: ['Community Worker', 'Child Protection Worker', 'Family Support Worker'],
  },
  {
    id: '272613', title: 'Welfare Worker',               category: 'social',
    list: 'MLTSSL', assessing: 'VETASSESS', demand: 'High',
    salary: { min: 58000, max: 90000, median: 72000 },
    stateNomination: ALL_STATES,
    description: 'Provides support, guidance and case management to vulnerable people.',
    altTitles: ['Youth Worker', 'Case Manager', 'Disability Support Worker'],
  },
  {
    id: '251211', title: 'Speech Pathologist',           category: 'healthcare',
    list: 'MLTSSL', assessing: 'AHPRA', demand: 'Very High',
    salary: { min: 70000, max: 110000, median: 87000 },
    stateNomination: ALL_STATES,
    description: 'Assesses and treats communication and swallowing disorders.',
    altTitles: ['Speech Therapist', 'Speech Language Pathologist'],
  },
  {
    id: '254211', title: 'Midwife',                      category: 'healthcare',
    list: 'PMSOL', assessing: 'ANMAC', demand: 'Critical',
    salary: { min: 72000, max: 108000, median: 88000 },
    stateNomination: ALL_STATES,
    description: 'Provides care to women and newborns before, during and after childbirth.',
    altTitles: ['Registered Midwife', 'Clinical Midwife'],
  },
];

// ── Helper functions ──────────────────────────────────────────────────────

export function searchOccupations(query, category = 'all') {
  const q = query.toLowerCase().trim();
  return OCCUPATIONS.filter(occ => {
    const matchCategory = category === 'all' || occ.category === category;
    if (!matchCategory) return false;
    if (!q) return true;
    return (
      occ.title.toLowerCase().includes(q)     ||
      occ.id.includes(q)                       ||
      occ.altTitles?.some(t => t.toLowerCase().includes(q)) ||
      occ.description.toLowerCase().includes(q)
    );
  });
}

export function getOccupationBySlug(slug) {
  // slug format: "software-engineer-261313" or just "261313"
  const id = slug.split('-').pop();
  return OCCUPATIONS.find(o => o.id === id);
}

export function slugify(occ) {
  return `${occ.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${occ.id}`;
}
