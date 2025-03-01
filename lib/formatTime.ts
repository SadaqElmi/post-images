import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";

/**
 * Format a timestamp like Facebook:
 * - Just now
 * - 5 minutes ago
 * - 2 hours ago
 * - Yesterday at 6:00 PM
 * - October 8 at 6:00 PM
 * - 1 year ago
 */
export function formatPostTime(dateString: string): string {
  const date = new Date(dateString);

  const now = new Date();

  if (isToday(date)) {
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 1) {
      return "Isla Hadda";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} daqiiqo${diffInMinutes > 1 ? "s" : ""} Kahor`;
    } else {
      return format(date, "h:mm a"); // e.g., 4:30 PM
    }
  }

  if (isYesterday(date)) {
    return `Shalay waqtiga ${format(date, "h:mm a")}`; // e.g., Yesterday at 4:30 PM
  }

  const diffInDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffInDays < 7) {
    return formatDistanceToNow(date, { addSuffix: true }); // e.g., 3 days ago
  }

  if (date.getFullYear() === now.getFullYear()) {
    return format(date, "MMMM d 'at' h:mm a"); // e.g., October 8 at 6:00 PM
  }

  return format(date, "MMMM d, yyyy 'at' h:mm a"); // e.g., October 8, 2024 at 6:00 PM
}
