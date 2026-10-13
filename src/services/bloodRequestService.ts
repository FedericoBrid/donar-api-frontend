import type { BloodRequest } from "../types/BloodRequest";
import api from "./api";

export async function getBloodRequests(): Promise<BloodRequest[]> {
    const response = await api.get<BloodRequest[]>("/blood-requests");
    return response.data;
}