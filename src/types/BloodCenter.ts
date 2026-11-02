
export interface BloodCenter {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  isPublic: boolean;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBloodCenterRequest {
  name: string;
  address: string;
  phone: string;
  email: string;
  isPublic: boolean;
}

export interface UpdateBloodCenterRequest {
  name: string;
  address: string;
  phone: string;
  email: string;
  isPublic: boolean;
}
