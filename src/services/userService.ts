
import api from "./api";
import type { User } from "../types/User";

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  password: string;
  gender: string;
  bloodTypeId: number;
  rhFactorId: number;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  bloodTypeId: number;
  rhFactorId: number;
}

export interface AssignRoleRequest {
  userId: number;
  roleId: number;
}

export interface UserRole {
  id: number;
  roleId: number;
  roleName: string;
  status: boolean;
}

export async function getUsers(): Promise<User[]> {
  const response = await api.get<User[]>("/users");
  return response.data;
}

export async function getUserById(id: number): Promise<User> {
  const response = await api.get<User>(`/users/${id}`);
  return response.data;
}

export async function createUser(
  request: CreateUserRequest,
): Promise<User> {
  const response = await api.post<User>("/users", request);
  return response.data;
}

export async function updateUser(
  id: number,
  request: UpdateUserRequest,
): Promise<User> {
  const response = await api.put<User>(`/users/${id}`, request);
  return response.data;
}

export async function deactivateUser(id: number): Promise<User> {
  const response = await api.patch<User>(`/users/${id}/deactivate`);
  return response.data;
}

export async function activateUser(id: number): Promise<User> {
  const response = await api.patch<User>(`/users/${id}/activate`);
  return response.data;
}

export async function assignRole(
  userId: number,
  roleId: number
): Promise<void> {
  await api.post(`/users/${userId}/roles`, {
    roleId,
  });
}

export async function getUserRoles(
  userId: number
): Promise<UserRole[]> {
  const response = await api.get<UserRole[]>(
    `/users/${userId}/roles`
  );

  return response.data;
}

export async function deactivateRole(
  userId: number,
  roleId: number
): Promise<void> {
  await api.put(`/users/${userId}/roles/${roleId}`);
}
