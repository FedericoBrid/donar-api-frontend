
import api from "./api";

export interface CreateDonationRequest {
  bloodRequestId: number;
}

export interface MyDonation {
  donationId: number;
  bloodRequestId: number;
  bloodTypeName: string;
  rhFactorName: string;
  urgency: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  requestStatus: "ACTIVE" | "FULFILLED" | "EXPIRED" | "CANCELLED";
  donationStatus: "REGISTERED" | "COMPLETED" | "CANCELLED";
  expirationDate: string;
  bloodCenterId: number;
  bloodCenterName: string;
  bloodCenterAddress: string;
  bloodCenterPhone: string;
  bloodCenterEmail: string;
  registeredAt: string;
  donatedAt: string | null;
  updatedAt: string | null;
}

export async function registerDonation(
  bloodRequestId: number,
): Promise<void> {
  await api.post("/donations", {
    bloodRequestId,
  } satisfies CreateDonationRequest);
}

export async function getMyDonations(): Promise<MyDonation[]> {
  const response = await api.get<MyDonation[]>("/donations/my");

  return response.data;
}

export async function cancelDonation(
  donationId: number,
): Promise<void> {
  await api.patch(`/donations/${donationId}/cancel`);
}
