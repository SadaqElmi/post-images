"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";

const users = [
  { id: 1, role: "Admin", username: "john_doe", email: "john@example.com" },
  { id: 2, role: "User", username: "jane_smith", email: "jane@example.com" },
  { id: 3, role: "Admin", username: "mike_jones", email: "mike@example.com" },
  { id: 4, role: "User", username: "linda_brown", email: "linda@example.com" },
];

const AllUsers = () => {
  return (
    <div className="flex justify-center items-center px-4 py-4">
      <div className="w-full max-w-4xl">
        <Table>
          <TableCaption>A list of all registered users.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="text-right flex gap-2 justify-end">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Pencil size={18} />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5} className="text-right font-medium">
                {users.length} Users
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default AllUsers;
