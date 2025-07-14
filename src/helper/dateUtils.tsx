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
  if (!dateString || dateString === "N/A") return "N/A";
  const [day, month, year] = dateString.split('-').map(Number);
  if (!day || !month || !year) return "N/A";
  const date = new Date(year, month - 1, day);
  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "2-digit",
    year: "numeric",
  };
  // Format: 'July 31, 2025'
  const formatted = date.toLocaleDateString("en-US", options);
  // Insert comma after month: 'July, 31, 2025'
  const [monthName, dayNum, yearNum] = formatted.replace(',', '').split(' ');
  return `${monthName}, ${dayNum}, ${yearNum}`;
}


  // export function formatDateToMMDDYYYY(dateString: string): string {
  //   if (dateString === "N/A") {
  //     return "N/A";
  //   }
  
  //   // Split the date string into components
  //   const [day, month, year] = dateString.split("-");
  
  //   // Create a new Date object using the parsed components
  //   const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  
  //   // Format the date to "Month day, year"
  //   return date.toLocaleDateString("en-US", {
  //     month: "long",
  //     day: "2-digit",
  //     year: "numeric",
  //   });
  // }