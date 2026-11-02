import api from "./api";
import type {
  BloodCenter,
  CreateBloodCenterRequest,
  UpdateBloodCenterRequest,
} from "../types/BloodCenter";

export async function getBloodCenters(): Promise<BloodCenter[]> {
  const response = await api.get<BloodCenter[]>("/blood-centers");
  return response.data;
}

export async function getBloodCenterById(
  id: number
): Promise<BloodCenter> {
  const response = await api.get<BloodCenter>(`/blood-centers/${id}`);
  return response.data;
}

export async function createBloodCenter(
  request: CreateBloodCenterRequest
): Promise<BloodCenter> {
  const response = await api.post<BloodCenter>(
    "/blood-centers",
    request
  );

  return response.data;
}

export async function updateBloodCenter(
  id: number,
  request: UpdateBloodCenterRequest
): Promise<BloodCenter> {
  const response = await api.put<BloodCenter>(
    `/blood-centers/${id}`,
    request
  );

  return response.data;
}


export async function activateBloodCenter(
  id: number
): Promise<BloodCenter> {
  const response = await api.patch<BloodCenter>(
    `/blood-centers/${id}/activate`
  );

  return response.data;
}

export async function deactivateBloodCenter(
  id: number
): Promise<BloodCenter> {
  const response = await api.patch<BloodCenter>(
    `/blood-centers/${id}/deactivate`
  );

  return response.data;
}

