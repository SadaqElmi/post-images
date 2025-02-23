"use client";

import { useState, useEffect } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface IUser {
  _id: string;
  role: "user" | "admin";
  name?: string;
  email: string;
  username?: string;
  avatar?: string;
}

const AllUsers = () => {
  const [users, setUsers] = useState<IUser[]>([]);

  // Fetch all users from the API
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete a user by id
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("User deleted");
        fetchUsers(); // refresh list
      } else {
        toast.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete user");
    }
  };

  // Update a user's role based on dropdown selection
  const handleRoleDropdownChange = async (
    id: string,
    newRole: "user" | "admin"
  ) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        toast.success("User role updated");
        fetchUsers(); // refresh list
      } else {
        toast.error("Failed to update role");
      }
    } catch (error) {
      console.error("Update role error:", error);
      toast.error("Failed to update role");
    }
  };

  return (
    <div className="flex justify-center items-center px-4 py-4">
      <div className="w-full max-w-4xl">
        <Table>
          <TableCaption>A list of all registered users.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={user._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="flex gap-2 items-center">
                  <Avatar>
                    {user.avatar ? (
                      <AvatarImage
                        src={user.avatar}
                        alt="Profile"
                        className="object-cover"
                      />
                    ) : (
                      <AvatarFallback>
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  {user.name || "N/A"}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <select
                    value={user.role}
                    onChange={(e) =>
                      handleRoleDropdownChange(
                        user._id,
                        e.target.value as "user" | "admin"
                      )
                    }
                    className="border border-gray-300 p-1 rounded"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </TableCell>
                <TableCell className="text-right flex gap-2 justify-end">
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(user._id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6} className="text-right font-medium">
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
