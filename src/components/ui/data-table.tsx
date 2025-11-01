"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  useReactTable,
} from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchableColumnId?: string;
  initialPageSize?: number;
  showViewOptions?: boolean;
  ToolbarSlot?: React.ComponentType<{
    table: ReturnType<typeof useReactTable<TData>>;
  }>;
  getRowId?: (row: TData, index: number, parent?: any) => string;
  maxPageButtons?: number;
  showPagination?: boolean;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  searchableColumnId,
  initialPageSize = 10,
  showViewOptions = true,
  ToolbarSlot,
  getRowId,
  maxPageButtons = 7,
  showPagination = true,
}: DataTableProps<TData, TValue>) {
  const t = useTranslations("table");

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getRowId,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: { pageSize: initialPageSize, pageIndex: 0 },
    },
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  });

  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();

  function getPageNumbers() {
    const pages: number[] = [];
    const total = pageCount;
    if (total <= maxPageButtons) {
      for (let i = 0; i < total; i++) pages.push(i);
      return pages;
    }
    const half = Math.floor(maxPageButtons / 2);
    let start = Math.max(0, pageIndex - half);
    const end = Math.min(total - 1, start + maxPageButtons - 1);
    if (end - start + 1 < maxPageButtons) {
      start = Math.max(0, end - maxPageButtons + 1);
    }
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  const pages = getPageNumbers();
  const showStartEllipsis = pages.length && pages[0] > 0;
  const showEndEllipsis =
    pages.length && pages[pages.length - 1] < pageCount - 1;

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 py-4">
        {searchableColumnId ? (
          <Input
            placeholder={t("searchPlaceholder")}
            value={
              (table
                .getColumn(searchableColumnId)
                ?.getFilterValue() as string) ?? ""
            }
            onChange={(e) =>
              table
                .getColumn(searchableColumnId)
                ?.setFilterValue(e.target.value)
            }
            className="max-w-sm"
            aria-label={t("searchAria")}
          />
        ) : null}

        {ToolbarSlot ? <ToolbarSlot table={table} /> : null}

        {showViewOptions ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto h-8">
                {t("columnsButton")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((c) => c.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(v) => column.toggleVisibility(!!v)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t("noResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {showPagination ? (
        <div className="flex items-center justify-between gap-3 py-4">
          <div className="text-muted-foreground text-sm">
            {table.getFilteredSelectedRowModel().rows.length} {t("of")}{" "}
            {table.getFilteredRowModel().rows.length} {t("selectedRows")}
          </div>

          <Pagination aria-label={t("paginationAria")}>
            <PaginationContent>
              <PaginationItem>
                <PaginationLink
                  aria-label={t("prevAria")}
                  onClick={() => table.previousPage()}
                  data-disabled={!table.getCanPreviousPage()}
                  className={
                    !table.getCanPreviousPage()
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                  href="#"
                >
                  <ChevronLeft className="size-4" />
                  <span className="sr-only">{t("prev")}</span>
                </PaginationLink>
              </PaginationItem>

              {showStartEllipsis ? (
                <>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={() => table.setPageIndex(0)}
                      isActive={pageIndex === 0}
                      aria-label={t("goToPage", { page: 1 })}
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis aria-label={t("morePages")} />
                  </PaginationItem>
                </>
              ) : null}

              {pages.map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    href="#"
                    isActive={p === pageIndex}
                    onClick={() => table.setPageIndex(p)}
                    aria-label={t("goToPage", { page: p + 1 })}
                  >
                    {p + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {showEndEllipsis ? (
                <>
                  <PaginationItem>
                    <PaginationEllipsis aria-label={t("morePages")} />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={() => table.setPageIndex(pageCount - 1)}
                      isActive={pageIndex === pageCount - 1}
                      aria-label={t("goToPage", { page: pageCount })}
                    >
                      {pageCount}
                    </PaginationLink>
                  </PaginationItem>
                </>
              ) : null}

              <PaginationItem>
                <PaginationLink
                  aria-label={t("nextAria")}
                  onClick={() => table.nextPage()}
                  data-disabled={!table.getCanNextPage()}
                  className={
                    !table.getCanNextPage()
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                  href="#"
                >
                  <span className="sr-only">{t("next")}</span>
                  <ChevronRight className="size-4" />
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      ) : null}
    </div>
  );
}
