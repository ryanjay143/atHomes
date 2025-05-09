export function formatDateToMMDDYYYYDateRegistred(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long", // Use "short" for three-letter month abbreviation
      day: "2-digit",
      year: "numeric",
    });
  }

  export function formatDateToMMDDYYYYDateApproved(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long", // Use "short" for three-letter month abbreviation
      day: "2-digit",
      year: "numeric",
    });
  }


  export function formatDateToMMDDYYYY(dateString: string): string {
    if (dateString === "N/A") {
      return "N/A";
    }
  
    // Split the date string into components
    const [day, month, year] = dateString.split("-");
  
    // Create a new Date object using the parsed components
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  
    // Format the date to "Month day, year"
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    });
  }