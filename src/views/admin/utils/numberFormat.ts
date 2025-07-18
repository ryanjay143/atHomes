export function formatNumberShort(num: number): string {
  if (num >= 1_000_000) {
    // Millions: two decimal places, add M
    return (num / 1_000_000).toFixed(2).replace(/\.00$/, '') + 'M';
  } else if (num >= 1_000) {
    // Thousands: up to two decimals, add K
    let shortNum = num / 1_000;
    // Remove trailing zeros after decimal
    let formatted = shortNum % 1 === 0 ? shortNum.toFixed(0) : shortNum.toFixed(2).replace(/\.?0+$/, '');
    return formatted + 'K';
  } else {
    // Less than 1,000: show as is
    return num.toString();
  }
}