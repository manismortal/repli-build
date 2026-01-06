import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface AdminTableProps<T> {
  title: string;
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  isLoading?: boolean;
  itemsPerPage?: number;
}

export function AdminTable<T extends { id: string | number }>({
  title,
  columns,
  data,
  searchPlaceholder = "Search...",
  onSearch,
  isLoading,
  itemsPerPage = 10
}: AdminTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter Data
  const filteredData = data.filter(item => {
    if (!searchQuery) return true;
    // Basic generic search on all string values of item
    return Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearch = (query: string) => {
      setSearchQuery(query);
      setCurrentPage(1); // Reset to page 1 on search
      onSearch?.(query);
  }

  // Helper to generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        if (currentPage <= 4) {
            pages.push(1, 2, 3, 4, 5, '...', totalPages);
        } else if (currentPage >= totalPages - 3) {
            pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
            pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
        }
    }
    return pages;
  };

  return (
    <Card className="border-none shadow-md">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 pb-4">
        <CardTitle className="text-lg font-heading font-bold">{title}</CardTitle>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={searchPlaceholder} 
            className="pl-9 h-9 bg-secondary/50 border-none w-full"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border overflow-hidden mb-4">
          <Table>
            <TableHeader className="bg-secondary/50">
              <TableRow>
                {columns.map((col, idx) => (
                  <TableHead key={idx} className={col.className}>
                    {col.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center h-24 text-muted-foreground">
                    Loading data...
                  </TableCell>
                </TableRow>
              ) : currentData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center h-24 text-muted-foreground">
                    No results found.
                  </TableCell>
                </TableRow>
              ) : (
                currentData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-secondary/20 transition-colors">
                    {columns.map((col, idx) => (
                      <TableCell key={idx} className={col.className}>
                        {typeof col.accessor === "function" 
                          ? col.accessor(item) 
                          : (item[col.accessor] as React.ReactNode)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent className="flex-wrap gap-2">
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(currentPage - 1)} 
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {getPageNumbers().map((page, idx) => (
                <PaginationItem key={idx}>
                  {page === '...' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink 
                      isActive={currentPage === page}
                      onClick={() => handlePageChange(Number(page))}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </CardContent>
    </Card>
  );
}