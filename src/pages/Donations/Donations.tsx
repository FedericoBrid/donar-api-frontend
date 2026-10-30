
import { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";

import {
  cancelDonation,
  getMyDonations,
  type MyDonation,
} from "../../services/donationService";

import {
  formatDate,
  getUrgencyLabel,
} from "../../utils/bloodRequestUtils";

function Donations() {
  const [donations, setDonations] = useState<MyDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  // Carga inicial de las donaciones
  useEffect(() => {
    let active = true;

    async function fetchDonations() {
      try {
        const data = await getMyDonations();

        if (active) {
          setDonations(data);
        }
      } catch {
        if (active) {
          setError("No se pudieron cargar tus donaciones.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void fetchDonations();

    return () => {
      active = false;
    };
  }, []);

  // Cancelación de una inscripción
  async function handleCancel(donationId: number) {
    const confirmed = window.confirm(
      "¿Estás seguro de que querés cancelar esta inscripción?",
    );

    if (!confirmed) {
      return;
    }

    setCancellingId(donationId);
    setMessage("");
    setError("");

    try {
      await cancelDonation(donationId);

      setMessage("La inscripción se canceló correctamente.");

      const data = await getMyDonations();
      setDonations(data);
    } catch {
      setError("No se pudo cancelar la inscripción.");
    } finally {
      setCancellingId(null);
    }
  }

  // Definición de las columnas
  const columns = useMemo<MRT_ColumnDef<MyDonation>[]>(
    () => [
      {
        accessorKey: "donationId",
        header: "ID",
        size: 70,
      },
      {
        accessorFn: (row) =>
          `${row.bloodTypeName} ${row.rhFactorName}`,
        id: "bloodType",
        header: "Grupo sanguíneo",
      },
      {
        accessorKey: "bloodCenterName",
        header: "Hemocentro",
      },
      {
        accessorFn: (row) => getUrgencyLabel(row.urgency),
        id: "urgency",
        header: "Urgencia",
      },
      {
        accessorFn: (row) => getRequestStatusLabel(row.requestStatus),
        id: "requestStatus",
        header: "Estado de solicitud",
      },
      {
        accessorFn: (row) => getDonationStatusLabel(row.donationStatus),
        id: "donationStatus",
        header: "Estado de donación",
      },
      {
        accessorFn: (row) =>
          formatDate(row.registeredAt.split("T")[0]),
        id: "registeredAt",
        header: "Fecha de inscripción",
      },
      {
        id: "actions",
        header: "Acciones",
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }) => {
          const donation = row.original;
          const isCancelling = cancellingId === donation.donationId;

          if (donation.donationStatus !== "REGISTERED") {
            return "Sin acciones";
          }

          return (
            <button
              type="button"
              disabled={isCancelling}
              onClick={() => void handleCancel(donation.donationId)}
            >
              {isCancelling ? "Cancelando..." : "Cancelar"}
            </button>
          );
        },
      },
    ],
    [cancellingId],
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
      <h2>Mis donaciones</h2>

      {error && <p role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}

      {!loading && donations.length === 0 ? (
        <p>Todavía no tenés donaciones registradas.</p>
      ) : (
        <MaterialReactTable table={table} />
      )}
    </section>
  );
}

// Traducción de estados de solicitud
function getRequestStatusLabel(
  status: MyDonation["requestStatus"],
): string {
  const labels = {
    ACTIVE: "Activa",
    FULFILLED: "Completada",
    EXPIRED: "Vencida",
    CANCELLED: "Cancelada",
  };

  return labels[status];
}

// Traducción de estados de donación
function getDonationStatusLabel(
  status: MyDonation["donationStatus"],
): string {
  const labels = {
    REGISTERED: "Registrada",
    COMPLETED: "Completada",
    CANCELLED: "Cancelada",
  };

  return labels[status];
}

export default Donations;
