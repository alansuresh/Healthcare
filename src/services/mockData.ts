import type { ActivityRecord, Patient } from '../types';

const firstNames = [
  'Amelia', 'Olivia', 'Liam', 'Noah', 'Emma', 'Ava', 'Sophia', 'Mia',
  'Ethan', 'Mason', 'Lucas', 'Harper', 'Evelyn', 'Logan', 'Aiden', 'Isabella',
  'Carter', 'Riley', 'Chloe', 'Layla', 'Daniel', 'Henry', 'Sebastian', 'Zoe',
  'Aanya', 'Ravi', 'Priya', 'Arjun', 'Yuki', 'Hiroshi', 'Mateo', 'Sofia',
];

const lastNames = [
  'Carter', 'Bennett', 'Mitchell', 'Hughes', 'Patel', 'Khan', 'Rivera', 'Nguyen',
  'Williams', 'Thompson', 'Foster', 'Reed', 'Brooks', 'Sanchez', 'Coleman', 'Park',
  'Anderson', 'Walker', 'Lewis', 'Hall', 'Martinez', 'Garcia', 'Wright', 'Tanaka',
];

const conditions = [
  'Post-op recovery',
  'Acute pneumonia',
  'Cardiac arrhythmia',
  'Type 2 diabetes',
  'Hypertension',
  'Migraine cluster',
  'Fractured tibia',
  'COPD exacerbation',
  'Sepsis observation',
  'Pre-natal monitoring',
  'Stroke rehabilitation',
  'Renal insufficiency',
];

const departments = [
  'Cardiology',
  'Neurology',
  'Oncology',
  'Pediatrics',
  'Orthopedics',
  'Emergency',
  'ICU',
  'Maternity',
  'Pulmonology',
  'Nephrology',
];

const doctors = [
  'Dr. Eliza Hart',
  'Dr. Marcus Vale',
  'Dr. Priya Rao',
  'Dr. Jonas Reyes',
  'Dr. Aiko Tanaka',
  'Dr. Felix Romero',
  'Dr. Hannah Cole',
  'Dr. Samir Khanna',
  'Dr. Olivia Park',
  'Dr. Daniel Brooks',
];

const statuses: Patient['status'][] = ['critical', 'stable', 'recovering', 'discharged'];

const bloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

// Deterministic PRNG so the demo data is stable across reloads.
function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(42);

const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)];

export const PATIENTS: Patient[] = Array.from({ length: 48 }, (_, i) => {
  const first = pick(firstNames);
  const last = pick(lastNames);
  const status = pick(statuses);
  const admittedDays = Math.floor(rand() * 28);
  const admit = new Date();
  admit.setDate(admit.getDate() - admittedDays);
  return {
    id: `MS-${(10240 + i).toString()}`,
    name: `${first} ${last}`,
    age: 12 + Math.floor(rand() * 75),
    gender: rand() > 0.52 ? 'F' : 'M',
    condition: pick(conditions),
    department: pick(departments),
    doctor: pick(doctors),
    room: `${pick(['A', 'B', 'C', 'D', 'E'])}-${100 + Math.floor(rand() * 320)}`,
    admittedAt: admit.toISOString(),
    status,
    avatarHue: Math.floor(rand() * 360),
    bloodType: pick(bloodTypes),
  };
});

export const ACTIVITY: ActivityRecord[] = [
  {
    id: 'act-001',
    type: 'admission',
    message: 'New admission to ICU',
    patient: 'Aanya Patel',
    timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    severity: 'info',
  },
  {
    id: 'act-002',
    type: 'alert',
    message: 'Critical vitals alert · Bed C-204',
    patient: 'Marcus Bennett',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    severity: 'critical',
  },
  {
    id: 'act-003',
    type: 'discharge',
    message: 'Discharge approved',
    patient: 'Olivia Foster',
    timestamp: new Date(Date.now() - 1000 * 60 * 33).toISOString(),
    severity: 'success',
  },
  {
    id: 'act-004',
    type: 'appointment',
    message: 'Surgery scheduled · OR-3',
    patient: 'Hiroshi Tanaka',
    timestamp: new Date(Date.now() - 1000 * 60 * 47).toISOString(),
    severity: 'info',
  },
  {
    id: 'act-005',
    type: 'payment',
    message: 'Insurance claim approved · $24,800',
    patient: 'Sofia Rivera',
    timestamp: new Date(Date.now() - 1000 * 60 * 88).toISOString(),
    severity: 'success',
  },
  {
    id: 'act-006',
    type: 'alert',
    message: 'Lab results delayed · Hematology',
    timestamp: new Date(Date.now() - 1000 * 60 * 124).toISOString(),
    severity: 'warning',
  },
  {
    id: 'act-007',
    type: 'admission',
    message: 'Pediatric admission · Room B-118',
    patient: 'Layla Brooks',
    timestamp: new Date(Date.now() - 1000 * 60 * 156).toISOString(),
    severity: 'info',
  },
];

export const monthlyPatients = [
  { month: 'Jan', total: 1820, new: 412, returning: 1408 },
  { month: 'Feb', total: 1780, new: 388, returning: 1392 },
  { month: 'Mar', total: 1992, new: 470, returning: 1522 },
  { month: 'Apr', total: 2104, new: 526, returning: 1578 },
  { month: 'May', total: 2230, new: 612, returning: 1618 },
  { month: 'Jun', total: 2188, new: 580, returning: 1608 },
  { month: 'Jul', total: 2350, new: 648, returning: 1702 },
  { month: 'Aug', total: 2470, new: 702, returning: 1768 },
  { month: 'Sep', total: 2412, new: 660, returning: 1752 },
  { month: 'Oct', total: 2588, new: 740, returning: 1848 },
  { month: 'Nov', total: 2702, new: 810, returning: 1892 },
  { month: 'Dec', total: 2840, new: 880, returning: 1960 },
];

export const revenueTrend = [
  { month: 'Jan', revenue: 412_000, expenses: 268_000 },
  { month: 'Feb', revenue: 398_000, expenses: 264_000 },
  { month: 'Mar', revenue: 451_000, expenses: 282_000 },
  { month: 'Apr', revenue: 478_000, expenses: 290_000 },
  { month: 'May', revenue: 512_000, expenses: 302_000 },
  { month: 'Jun', revenue: 498_000, expenses: 298_000 },
  { month: 'Jul', revenue: 540_000, expenses: 312_000 },
  { month: 'Aug', revenue: 569_000, expenses: 320_000 },
  { month: 'Sep', revenue: 553_000, expenses: 318_000 },
  { month: 'Oct', revenue: 602_000, expenses: 332_000 },
  { month: 'Nov', revenue: 638_000, expenses: 344_000 },
  { month: 'Dec', revenue: 681_000, expenses: 358_000 },
];

export const departmentPerformance = [
  { department: 'Cardiology', cases: 312, satisfaction: 92 },
  { department: 'Neurology', cases: 248, satisfaction: 88 },
  { department: 'Oncology', cases: 196, satisfaction: 90 },
  { department: 'Pediatrics', cases: 388, satisfaction: 95 },
  { department: 'Orthopedics', cases: 274, satisfaction: 87 },
  { department: 'Emergency', cases: 521, satisfaction: 81 },
  { department: 'Maternity', cases: 203, satisfaction: 96 },
];

export const bedOccupancy = [
  { name: 'Occupied', value: 312, color: '#1d75f5' },
  { name: 'Reserved', value: 64, color: '#06c4ad' },
  { name: 'Available', value: 84, color: '#cbd5e1' },
];

export const appointmentTrends = Array.from({ length: 14 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (13 - i));
  return {
    date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    scheduled: 60 + Math.floor(rand() * 60),
    completed: 50 + Math.floor(rand() * 55),
    cancelled: Math.floor(rand() * 12),
  };
});

export const patientDemographics = [
  { range: '0–17', male: 84, female: 92 },
  { range: '18–34', male: 162, female: 188 },
  { range: '35–54', male: 210, female: 224 },
  { range: '55–74', male: 184, female: 196 },
  { range: '75+', male: 96, female: 118 },
];
