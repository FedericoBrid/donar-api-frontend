export type RequestUrgency = 
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "CRITICAL";   

export type RequestStatus =
    | "ACTIVE"
    | "FULFILLED"
    | "EXPIRED"
    | "CANCELLED";

export interface BloodRequest {
    id: number;
    
    bloodCenterId: number;
    bloodCenterName: string;
    bloodCenterAddress: string;
    bloodCenterPhone: string;
    bloodCenterEmail: string;

    bloodTypeId: number;
    bloodTypeName: string;

    rhFactorId: number;
    rhFactorName: string;

    urgency: RequestUrgency;
    status: RequestStatus;

    expirationDate: string;
    createdAt: string;
    updatedAt: string | null;
}      