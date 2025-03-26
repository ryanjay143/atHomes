export function formatDateToMMDDYYYY(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long", // Use "short" for three-letter month abbreviation
      day: "2-digit",
      year: "numeric",
    });
  }