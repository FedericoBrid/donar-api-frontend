export interface User {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  gender: string;
  bloodTypeId: number;
  bloodTypeName: string;
  rhFactorId: number;
  rhFactorName: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  roles: string[];
}