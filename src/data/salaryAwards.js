// ── Fair Work Award Rates — July 2026 ───────────────────────────────────
// Source: Fair Work Commission — fwc.gov.au
// National Minimum Wage: $26.44/hr | $1,004.90/week (effective 1 July 2026)
// Casual loading: 25% on top of base rate
// Always verify current rates at: fairwork.gov.au/pay-and-wages

export const NATIONAL_MINIMUM = {
  hourly:  26.44,
  weekly:  1004.90,
  annual:  52254.80,
  asOf:    '1 July 2026',
  casual:  33.05, // 25% loading
};

export const CASUAL_LOADING = 0.25; // 25%

export const OVERTIME_RATES = {
  first2hrs:   1.5,  // Time-and-a-half
  after2hrs:   2.0,  // Double time
  sunday:      2.0,  // Double time
  publicHoliday: 2.5,
};

export const LEAVE_ENTITLEMENTS = {
  annualLeave:  '4 weeks per year (full-time)',
  sickLeave:    '10 days per year (personal/carer\'s leave)',
  parentalLeave:'Up to 18 weeks paid (government) + employer entitlements',
  publicHolidays: '11 national public holidays + state/territory holidays',
  longService:  'Typically after 7-10 years (varies by state)',
};

// ── Modern Awards ─────────────────────────────────────────────────────────

export const AWARDS = [
  {
    id: 'hospitality',
    name: 'Hospitality Industry (General) Award 2020',
    shortName: 'Hospitality Award',
    description: 'Covers employees in hotels, motels, catering, cafes, restaurants and related industries.',
    classifications: [
      { level: 'Level 1 — Food and beverage attendant, kitchen hand',  hourly: 26.44, weekly: 1004.90 },
      { level: 'Level 2 — Barista, waiter, room attendant',            hourly: 27.15, weekly: 1031.70 },
      { level: 'Level 3 — Senior food and beverage attendant',         hourly: 27.90, weekly: 1060.20 },
      { level: 'Level 4 — Experienced chef, food & beverage supervisor',hourly: 29.15, weekly: 1107.70 },
      { level: 'Level 5 — Chef de partie, restaurant supervisor',       hourly: 31.05, weekly: 1179.90 },
      { level: 'Level 6 — Sous Chef, senior supervisor',               hourly: 33.85, weekly: 1286.30 },
    ],
    notes: 'Penalty rates apply on weekends and public holidays. Casual loading of 25% applies to casual employees.',
  },
  {
    id: 'restaurant',
    name: 'Restaurant Industry Award 2020',
    shortName: 'Restaurant Award',
    description: 'Covers most restaurant employees separately from the general Hospitality Award.',
    classifications: [
      { level: 'Food and Beverage Grade 1 — entry level',               hourly: 26.44, weekly: 1004.90 },
      { level: 'Food and Beverage Grade 2 — trained all-rounder',       hourly: 27.52, weekly: 1045.76 },
      { level: 'Food and Beverage Grade 3 — experienced/specialist',    hourly: 28.63, weekly: 1087.94 },
      { level: 'Cook Grade 1 — apprentice/new cook',                    hourly: 26.44, weekly: 1004.90 },
      { level: 'Cook Grade 2 — commis chef',                            hourly: 27.90, weekly: 1060.20 },
      { level: 'Cook Grade 3 — chef de partie',                         hourly: 30.48, weekly: 1158.24 },
      { level: 'Cook Grade 4 — sous chef, head chef (small operation)', hourly: 33.85, weekly: 1286.30 },
    ],
    notes: 'Penalty rates on Saturdays (25% loading), Sundays (50%), public holidays (250%).',
  },
  {
    id: 'retail',
    name: 'General Retail Industry Award 2020',
    shortName: 'Retail Award',
    description: 'Covers retail sales workers, retail managers and visual merchandisers.',
    classifications: [
      { level: 'Retail Employee Grade 1 — new to retail',               hourly: 26.44, weekly: 1004.90 },
      { level: 'Retail Employee Grade 2 — cashier, customer service',   hourly: 26.91, weekly: 1022.58 },
      { level: 'Retail Employee Grade 3 — trade qualified',             hourly: 28.30, weekly: 1075.40 },
      { level: 'Retail Employee Grade 4 — senior, specialist',          hourly: 29.16, weekly: 1108.08 },
      { level: 'Retail Employee Grade 5 — team leader, coordinator',    hourly: 30.21, weekly: 1147.98 },
      { level: 'Retail Supervisor',                                       hourly: 31.58, weekly: 1200.04 },
    ],
    notes: 'Weekend penalties: Saturday +25%, Sunday +100%.',
  },
  {
    id: 'building',
    name: 'Building and Construction General On-site Award 2020',
    shortName: 'Construction Award',
    description: 'Covers construction workers, tradespeople and labourers on building sites.',
    classifications: [
      { level: 'CW1 — Labourer, general worker',                        hourly: 28.55, weekly: 1084.90 },
      { level: 'CW2 — Trades assistant, machine operator',              hourly: 29.82, weekly: 1133.16 },
      { level: 'CW3 — Tradesperson (electrician, plumber, carpenter)',   hourly: 36.98, weekly: 1405.24 },
      { level: 'CW4 — Leading hand (up to 3 workers)',                   hourly: 38.58, weekly: 1466.04 },
      { level: 'CW5 — Advanced tradesperson',                            hourly: 40.10, weekly: 1523.80 },
      { level: 'CW6 — Specialist tradesperson / supervisor',             hourly: 41.62, weekly: 1581.56 },
    ],
    notes: 'FWWH (Fair Work Weekly Hours) = 38 hrs. Overtime after 10 hrs/day at 150%. Travel allowances may apply.',
  },
  {
    id: 'nursing',
    name: 'Nurses Award 2020',
    shortName: 'Nurses Award',
    description: 'Covers registered nurses, enrolled nurses and midwives.',
    classifications: [
      { level: 'Enrolled Nurse Grade 1 — Year 1',                       hourly: 32.05, weekly: 1217.90 },
      { level: 'Enrolled Nurse Grade 2 — Years 2–3',                    hourly: 33.52, weekly: 1273.76 },
      { level: 'Registered Nurse Grade 1 — Year 1',                     hourly: 37.24, weekly: 1415.12 },
      { level: 'Registered Nurse Grade 2 — Years 2–3',                  hourly: 38.98, weekly: 1481.24 },
      { level: 'Registered Nurse Grade 3 — Years 4–5',                  hourly: 40.76, weekly: 1548.88 },
      { level: 'Registered Nurse Grade 4 — Clinical Nurse Specialist',   hourly: 42.36, weekly: 1609.68 },
      { level: 'Registered Nurse Grade 5 — Clinical Nurse Consultant',   hourly: 47.88, weekly: 1819.44 },
    ],
    notes: 'After-hours penalties apply. Shift allowances for night duty, afternoon shifts.',
  },
  {
    id: 'cleaning',
    name: 'Cleaning Services Award 2020',
    shortName: 'Cleaning Award',
    description: 'Covers commercial, industrial and domestic cleaning workers.',
    classifications: [
      { level: 'Grade 1 — Cleaner level 1',                              hourly: 26.44, weekly: 1004.90 },
      { level: 'Grade 2 — Cleaner level 2 (specialist tasks)',           hourly: 26.91, weekly: 1022.58 },
      { level: 'Grade 3 — Cleaner level 3 / supervisor',                 hourly: 27.52, weekly: 1045.76 },
      { level: 'Team Leader — up to 5 workers',                          hourly: 28.22, weekly: 1072.36 },
      { level: 'Supervisor — 6+ workers',                                hourly: 29.64, weekly: 1126.32 },
    ],
    notes: 'Early morning, evening and weekend penalties apply.',
  },
  {
    id: 'transport',
    name: 'Road Transport and Distribution Award 2020',
    shortName: 'Transport Award',
    description: 'Covers drivers, forklift operators and transport workers.',
    classifications: [
      { level: 'Grade 1 — Driver, car, van or light vehicle',            hourly: 27.20, weekly: 1033.60 },
      { level: 'Grade 2 — Driver, rigid truck (GVM >4.5t)',              hourly: 28.06, weekly: 1066.28 },
      { level: 'Grade 3 — Driver, semi-trailer, B-double',               hourly: 29.06, weekly: 1104.28 },
      { level: 'Grade 4 — Forklift operator',                            hourly: 28.06, weekly: 1066.28 },
      { level: 'Grade 5 — Leading hand, team supervisor',                hourly: 30.55, weekly: 1160.90 },
    ],
    notes: 'Fatigue management laws apply. Long-distance allowances and overnight stay allowances may apply.',
  },
  {
    id: 'professional',
    name: 'Professional Employees Award 2020',
    shortName: 'Professional Award',
    description: 'Covers engineers, ICT professionals, scientists and some other professionals.',
    classifications: [
      { level: 'Level 1 — Graduate / entry level',                       hourly: 35.55, weekly: 1350.90 },
      { level: 'Level 2 — Experienced professional (2–3 years)',         hourly: 38.42, weekly: 1459.96 },
      { level: 'Level 3 — Senior professional (4–6 years)',              hourly: 43.11, weekly: 1638.18 },
      { level: 'Level 4 — Principal / specialist professional',          hourly: 50.22, weekly: 1908.36 },
    ],
    notes: 'Many ICT and engineering roles are above award. The award sets a minimum floor only.',
  },
  {
    id: 'aged_care',
    name: 'Aged Care Award 2010',
    shortName: 'Aged Care Award',
    description: 'Covers workers in residential aged care, home care and flexible care services.',
    classifications: [
      { level: 'Care Service Employee Grade 1 — personal care worker',   hourly: 27.65, weekly: 1050.70 },
      { level: 'Care Service Employee Grade 2 — experienced PCW',        hourly: 28.49, weekly: 1082.62 },
      { level: 'Care Service Employee Grade 3 — cert III qualified',     hourly: 30.18, weekly: 1146.84 },
      { level: 'Registered Nurse Grade 1',                               hourly: 37.24, weekly: 1415.12 },
    ],
    notes: 'Government wage supplement applies from October 2024 under the Fair Work Commission order.',
  },
  {
    id: 'childcare',
    name: 'Children\'s Services Award 2010',
    shortName: 'Childcare Award',
    description: 'Covers educators and workers in long day care, kindergartens and outside school hours care.',
    classifications: [
      { level: 'Children\'s Services Employee Level 1 — unqualified assistant', hourly: 26.44, weekly: 1004.90 },
      { level: 'Level 2 — Cert III-qualified educator',                  hourly: 28.06, weekly: 1066.28 },
      { level: 'Level 3 — Diploma-qualified educator',                   hourly: 30.55, weekly: 1160.90 },
      { level: 'Level 4 — Room leader, degree-qualified',                hourly: 34.22, weekly: 1300.36 },
      { level: 'Level 5 — Educational Leader / Director',                hourly: 38.20, weekly: 1451.60 },
    ],
    notes: 'Government childcare wage subsidy top-up applies for eligible services.',
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────

export function computeSalary(hourlyRate, { hoursPerWeek = 38, casual = false, overtime = 0 } = {}) {
  const base = casual ? hourlyRate * (1 + CASUAL_LOADING) : hourlyRate;
  const weeklyBase   = base * hoursPerWeek;
  const overtimeAmt  = hourlyRate * OVERTIME_RATES.first2hrs * Math.min(overtime, 2) +
                       hourlyRate * OVERTIME_RATES.after2hrs * Math.max(overtime - 2, 0);
  const weekly       = weeklyBase + overtimeAmt;
  return {
    hourly:           base,
    weeklyBase:       weeklyBase,
    weeklyWithOT:     weekly,
    annualBase:       weeklyBase * 52,
    annualWithLeave:  weeklyBase * 52 * (1 + 4 / 48), // approx with annual leave loading
    annualWithOT:     weekly * 52,
  };
}
