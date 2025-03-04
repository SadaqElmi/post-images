"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ShieldAlertIcon } from "lucide-react";

export function ReportDialog({
  postId,
  onReport,
}: {
  postId: string;
  onReport: (reason: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  const handleSubmit = async () => {
    try {
      await onReport(reason);
      setOpen(false);
      setReason("");
      console.log(postId);
    } catch (error) {
      console.log(error);
      alert("Failed to submit report. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-red-500 text-xs flex gap-2">
          <ShieldAlertIcon size={16} />
          Report User
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Post</DialogTitle>
        </DialogHeader>
        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Please explain the reason for reporting..."
          className="mb-4"
        />
        <Button onClick={handleSubmit} disabled={!reason.trim()}>
          Submit Report
        </Button>
      </DialogContent>
    </Dialog>
  );
}
