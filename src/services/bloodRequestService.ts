import type { BloodRequest, RequestStatus } from "../types/BloodRequest";
import api from "./api";

export async function getBloodRequests(): Promise<BloodRequest[]> {
  const response = await api.get<BloodRequest[]>("/blood-requests");
  return response.data;
}

export async function getBloodRequestsByStatus(
  status: RequestStatus,
): Promise<BloodRequest[]> {
  const response = await api.get<BloodRequest[]>("/blood-requests", {
    params: { status },
  });

  return response.data;
}