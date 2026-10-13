import type { RequestStatus, RequestUrgency } from "../types/BloodRequest";

export function getUrgencyLabel(urgency: RequestUrgency): string{
    const labels: Record<RequestUrgency, string> = {
        LOW: "Baja",
        MEDIUM: "Media",
        HIGH: "Alta",
        CRITICAL: "Crítica",
    };
    return labels[urgency];
}

export function getStatusLabel(status: RequestStatus): string {
    const labels: Record<RequestStatus, string> = {
        ACTIVE: "Activa",
        FULFILLED: "Completada",
        EXPIRED: "Vencida",
        CANCELLED: "Cancelada",
    };
    return labels[status];
}

export function formatDate(date: string): string {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
}