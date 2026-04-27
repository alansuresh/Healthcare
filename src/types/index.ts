export type PatientStatus = 'critical' | 'stable' | 'recovering' | 'discharged';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F' | 'Other';
  condition: string;
  department: string;
  doctor: string;
  room: string;
  admittedAt: string; // ISO date
  status: PatientStatus;
  avatarHue: number; // for deterministic gradient avatar
  bloodType?: string;
}

export interface ActivityRecord {
  id: string;
  type: 'admission' | 'discharge' | 'alert' | 'appointment' | 'payment';
  message: string;
  patient?: string;
  timestamp: string;
  severity?: 'info' | 'warning' | 'critical' | 'success';
}

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role?: 'admin' | 'physician' | 'staff';
}

export type ViewMode = 'grid' | 'list';

export interface NotificationPayload {
  title: string;
  body?: string;
  tag?: string;
  url?: string;
  icon?: string;
}
