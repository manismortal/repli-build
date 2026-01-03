import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

export default function AdminUsers() {
  const { data: users, isLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-heading font-bold">User Management</h1>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username (Mobile)</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>{user.name || "-"}</TableCell>
                <TableCell>৳{Number(user.balance).toLocaleString()}</TableCell>
                <TableCell>
                  {user.isAdmin ? (
                    <Badge variant="default">Admin</Badge>
                  ) : (
                    <Badge variant="secondary">User</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
