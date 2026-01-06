export enum Status {
  PENDING = 'PENDING', // 🔴 Belum Dikerjakan
  PROCESS = 'PROCESS', // 🟡 Sedang Proses
  DONE = 'DONE',       // 🟢 Selesai
}

export enum Priority {
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
}

export const COMPANIES = [
  "PT Padma Jarka Abadi",
  "PT Sembilan Matahari Sakti",
  "PT Semesta Mataram Sakti",
  "PT Sumber Santoso Abadi"
] as const;

export const TEKNISI = [
  "GILANG PERMANA",
  "FERI SAT QOMARUDDIN",
  "ARDIAN BEKTI PRASETYO",
  "PAUPAULINA ALDRIANTO",
  "NURUL INAYAH"
] as const;

export interface Ticket {
  id: string;
  date: string;
  company: string;
  pic: string;
  issue: string; // Kendala
  type: 'HW' | 'SW'; // Hardware or Software
  status: Status;
  priority: Priority;
  photoUrl?: string; // Bukti Foto
  notes?: string;
}

export interface UserSession {
  isLoggedIn: boolean;
  username?: string;
}
