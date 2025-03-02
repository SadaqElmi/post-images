"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

export interface IReport {
  _id: string;
  postId: {
    _id: string;
    description: string;
  };
  reportedBy: {
    _id: string;
    name: string;
  };
  reason: string;
  status: "pending" | "resolved";
  adminAction?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminReports() {
  const [reports, setReports] = useState<IReport[]>([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data } = await axios.get<IReport[]>("/api/reports");
      setReports(data);
    } catch (error) {
      console.error("Failed to fetch reports", error);
    } finally {
    }
  };

  const handleAdminAction = async (
    reportId: string,
    action: string,
    hours?: number
  ) => {
    try {
      await axios.post("/api/admin/actions", {
        reportId,
        action,
        banDurationHours: hours,
      });
      fetchReports();
    } catch (error) {
      console.error("Failed to perform action", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Reported Posts</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Post Content</TableHead>
            <TableHead>Report Reason</TableHead>
            <TableHead>Reported By</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report._id}>
              <TableCell>
                {report.postId?.description?.slice(0, 50)}...
              </TableCell>
              <TableCell>{report.reason}</TableCell>
              <TableCell>{report.reportedBy?.name}</TableCell>
              <TableCell>{report.status}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => handleAdminAction(report._id, "delete")}
                    >
                      Delete Post and Report
                    </DropdownMenuItem>

                    {/* New delete report only option */}
                    <DropdownMenuItem
                      onClick={() =>
                        handleAdminAction(report._id, "deleteReport")
                      }
                    >
                      Delete Report Only
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAdminAction(report._id, "ban", 1)}
                    >
                      Ban User (1 hour)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAdminAction(report._id, "ban", 10)}
                    >
                      Ban User (10 hours)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAdminAction(report._id, "unban")}
                    >
                      Unban User
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAdminAction(report._id, "ignore")}
                    >
                      Ignore Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
