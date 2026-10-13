
import { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";

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
      },
      {
        accessorFn: (row) => getStatusLabel(row.status),
        id: "status",
        header: "Estado",
      },
      {
        accessorKey: "expirationDate",
        header: "Vencimiento",
        Cell: ({ cell }) =>
          formatDate(cell.getValue<string>()),
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: requests,
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

  return <MaterialReactTable table={table} />;
}

export default RequestTable;