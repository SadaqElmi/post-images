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
import { MoreVertical } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface IUser {
  _id: string;
  role: "user" | "admin";
  name?: string;
  email: string;
  username?: string;
  avatar?: string;
  bannedUntil?: Date;
}

const AllUsers = () => {
  const [users, setUsers] = useState<IUser[]>([]);

  // Fetch all users from the API
  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/users");

      setUsers(res.data);
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
      const res = await axios.delete(`/api/users/${id}`);
      if (res) {
        toast.success("User deleted");
        fetchUsers();
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
      const res = await axios.patch(`/api/users/${id}`, {
        role: newRole,
      });

      if (res) {
        fetchUsers();
        toast.success("User role updated");
      } else {
        toast.error("Failed to update role");
      }
    } catch (error) {
      console.error("Update role error:", error);
      toast.error("Failed to update role");
    }
  };

  const handleBanUser = async (userId: string, hours: number) => {
    try {
      const res = await fetch(`/api/users/${userId}/ban`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hours }),
      });

      if (res.ok) {
        toast.success(`User banned for ${hours} hours`);
        fetchUsers();
      } else {
        toast.error("Failed to ban user");
      }
    } catch (error) {
      console.error("Ban error:", error);
      toast.error("Failed to ban user");
    }
  };

  const handleUnbanUser = async (userId: string) => {
    try {
      const res = await axios.put(`/api/users/${userId}/unban`);

      if (res) {
        toast.success("User unbanned");
        fetchUsers();
      } else {
        toast.error("Failed to unban user");
      }
    } catch (error) {
      console.error("Unban error:", error);
      toast.error("Failed to unban user");
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
              <TableHead>Role</TableHead>
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
                <TableCell>
                  {user.bannedUntil &&
                  new Date(user.bannedUntil) > new Date() ? (
                    <span className="text-red-500">Banned </span>
                  ) : (
                    <span className="text-green-500">Active</span>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => handleBanUser(user._id, 1)}
                      >
                        Ban User (1 hour)
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleBanUser(user._id, 10)}
                      >
                        Ban User (10 hours)
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleUnbanUser(user._id)}
                      >
                        Unban User
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(user._id)}>
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
