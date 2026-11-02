
import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";

import {
  completeDonation,
  getDonationsByBloodRequest,
  type Donation,
} from "../../services/donationService";

function DonationManagement() {
  const [bloodRequestId, setBloodRequestId] = useState("");
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(false);
  const [completingId, setCompletingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function searchDonations() {
    const id = Number(bloodRequestId);

    if (!Number.isInteger(id) || id <= 0) {
      setError("Ingresá un ID de solicitud válido.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const data = await getDonationsByBloodRequest(id);
      setDonations(data);
    } catch {
      setError("No se pudieron cargar las inscripciones.");
      setDonations([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleComplete(donationId: number) {
    const confirmed = window.confirm(
      "¿Confirmás que esta donación se realizó efectivamente?",
    );

    if (!confirmed) {
      return;
    }

    setCompletingId(donationId);
    setError("");
    setMessage("");

    try {
      await completeDonation(donationId);

      setMessage("La donación se marcó como completada.");

      const data = await getDonationsByBloodRequest(
        Number(bloodRequestId),
      );

      setDonations(data);
    } catch {
      setError(
        "No se pudo completar la donación. Verificá su estado e intentá nuevamente.",
      );
    } finally {
      setCompletingId(null);
    }
  }

  const columns = useMemo<MRT_ColumnDef<Donation>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID de donación",
        size: 120,
      },
      {
        accessorKey: "userId",
        header: "ID de usuario",
      },
      {
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        id: "donorName",
        header: "Donante",
      },
      {
        accessorKey: "email",
        header: "Correo electrónico",
      },
      {
        accessorKey: "bloodRequestId",
        header: "ID de solicitud",
      },
      {
        accessorFn: (row) => getDonationStatusLabel(row.status),
        id: "status",
        header: "Estado",
      },
      {
        accessorFn: (row) => formatDateTime(row.registeredAt),
        id: "registeredAt",
        header: "Fecha de inscripción",
      },
      {
        accessorFn: (row) =>
          row.donatedAt ? formatDateTime(row.donatedAt) : "—",
        id: "donatedAt",
        header: "Fecha de donación",
      },
      {
        id: "actions",
        header: "Acciones",
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }) => {
          const donation = row.original;
          const isCompleting = completingId === donation.id;

          if (donation.status !== "REGISTERED") {
            return "Sin acciones";
          }

          return (
            <button
              type="button"
              disabled={isCompleting}
              onClick={() => void handleComplete(donation.id)}
            >
              {isCompleting ? "Procesando..." : "Marcar completada"}
            </button>
          );
        },
      },
    ],
    [completingId, bloodRequestId],
  );

  const table = useMaterialReactTable({
    columns,
    data: donations,
    state: {
      isLoading: loading,
    },
    enableGlobalFilter: true,
    enableColumnFilters: true,
    enableSorting: true,
    enablePagination: true,
    initialState: {
      showGlobalFilter: true,
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
  });

  return (
    <section>
      <h2>Gestión de donaciones</h2>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void searchDonations();
        }}
      >
        <label htmlFor="bloodRequestId">
          ID de solicitud
        </label>

        <input
          id="bloodRequestId"
          type="number"
          min="1"
          value={bloodRequestId}
          onChange={(event) => setBloodRequestId(event.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Buscando..." : "Buscar inscripciones"}
        </button>
      </form>

      {error && <p role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}

      <MaterialReactTable table={table} />
    </section>
  );
}

function getDonationStatusLabel(status: Donation["status"]): string {
  const labels = {
    REGISTERED: "Registrada",
    COMPLETED: "Completada",
    CANCELLED: "Cancelada",
  };

  return labels[status];
}

function formatDateTime(value: string): string {
  const [date, time] = value.split("T");

  if (!date || !time) {
    return value;
  }

  const [year, month, day] = date.split("-");

  return `${day}/${month}/${year} ${time.slice(0, 5)}`;
}

export default DonationManagement;
