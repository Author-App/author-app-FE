export const roundPercentage = (value: number): number => {
    return Math.round(value);
};

export const percentageToDecimal = (percentage: number): number => {
    if (isNaN(percentage)) return 0;
    const value = percentage / 100;
    return Math.min(Math.max(value, 0), 1); // clamps between 0 and 1
};

export const getInitials = (name: string | null | undefined): string => {
  if (!name) return "";

  const words = name.trim().split(" ").filter(Boolean);
  const initials = words
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  return initials.slice(0, 2);
};

export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  };

  return date.toLocaleDateString('en-US', options);
};
