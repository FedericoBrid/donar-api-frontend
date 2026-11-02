
import { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";

import {
  completeDonation,
  getAllDonations,
  getDonationsByBloodRequest,
  type Donation,
} from "../../services/donationService";

function DonationManagement() {
  const [bloodRequestId, setBloodRequestId] = useState("");
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadDonations(requestId?: string) {
    setLoading(true);
    setError("");

    try {
      const data = requestId
        ? await getDonationsByBloodRequest(Number(requestId))
        : await getAllDonations();

      setDonations(data);
    } catch {
      setError("No se pudieron cargar las donaciones.");
      setDonations([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    async function fetchInitialDonations() {
        try {
        const data = await getAllDonations();

        if (active) {
            setDonations(data);
        }
        } catch {
        if (active) {
            setError("No se pudieron cargar las donaciones.");
        }
        } finally {
        if (active) {
            setLoading(false);
        }
        }
    }

    void fetchInitialDonations();

        return () => {
            active = false;
        };
    }, []);

  async function searchDonations() {
    const id = bloodRequestId.trim();

    setMessage("");

    if (!id) {
      await loadDonations();
      return;
    }

    const numericId = Number(id);

    if (!Number.isInteger(numericId) || numericId <= 0) {
      setError("Ingresá un ID de solicitud válido.");
      return;
    }

    await loadDonations(id);
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

      await loadDonations(bloodRequestId.trim() || undefined);
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
    [completingId],
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
          placeholder="Ingresá un ID para filtrar"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Cargando..." : "Buscar"}
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => {
            setBloodRequestId("");
            setMessage("");
            void loadDonations();
        }}
        >
        Ver todas
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
