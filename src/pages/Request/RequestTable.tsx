
import { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { Chip, Paper } from "@mui/material";

import type { BloodRequest } from "../../types/BloodRequest";
import {
  formatDate,
  getStatusLabel,
  getUrgencyLabel,
} from "../../utils/bloodRequestUtils";

interface RequestTableProps {
  requests: BloodRequest[];
}

function RequestTable({ requests }: RequestTableProps) {
  const columns = useMemo<MRT_ColumnDef<BloodRequest>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 70,
      },
      {
        accessorFn: (row) =>
          `${row.bloodTypeName} ${row.rhFactorName}`,
        id: "bloodType",
        header: "Grupo sanguíneo",
        Cell: ({ cell }) => (
          <Chip
            label={cell.getValue<string>()}
            color="error"
            variant="outlined"
            size="small"
          />
        ),
      },
      {
        accessorKey: "bloodCenterName",
        header: "Hemocentro",
      },
      {
        accessorKey: "bloodCenterAddress",
        header: "Dirección",
      },
      {
        accessorFn: (row) => getUrgencyLabel(row.urgency),
        id: "urgency",
        header: "Urgencia",
        Cell: ({ row }) => {
          const color =
            row.original.urgency === "CRITICAL"
              ? "error"
              : row.original.urgency === "HIGH"
                ? "warning"
                : row.original.urgency === "MEDIUM"
                  ? "info"
                  : "success";

          return (
            <Chip
              label={getUrgencyLabel(row.original.urgency)}
              color={color}
              size="small"
              variant="outlined"
            />
          );
        },
      },
      {
        accessorFn: (row) => getStatusLabel(row.status),
        id: "status",
        header: "Estado",
        Cell: ({ row }) => (
          <Chip
            label={getStatusLabel(row.original.status)}
            color={row.original.status === "ACTIVE" ? "success" : "default"}
            size="small"
          />
        ),
      },
      {
        accessorKey: "expirationDate",
        header: "Vencimiento",
        Cell: ({ cell }) => formatDate(cell.getValue<string>()),
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: requests,
    localization: MRT_Localization_ES,
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
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        border: "1px solid #e5e7eb",
        borderRadius: 3,
        overflow: "hidden",
      },
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "#f8fafc",
        fontWeight: 700,
      },
    },
    muiTableBodyRowProps: {
      sx: {
        "&:hover": {
          backgroundColor: "#fff5f5",
        },
      },
    },
  });

  return (
    <Paper elevation={0} className="requests-table-container">
      <MaterialReactTable table={table} />
    </Paper>
  );
}

export default RequestTable;
