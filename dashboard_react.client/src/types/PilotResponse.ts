export interface PilotResponse {
  id?: string;
  name: string;
  lastName: string;
  fullName: string;
  license: string;
  phone: string;
  email: string;
  state: number;
  createdAt: string | null;
  updatedAt?: string | null;
  createdBy: string | null;
  updatedBy?: string | null;
}
