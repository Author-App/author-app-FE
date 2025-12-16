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

export const formatDuration = (durationSec: number): string => {
  if (!durationSec || durationSec < 0) return '00:00';

  const minutes = Math.floor(durationSec / 60);
  const seconds = durationSec % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const formatDuration2 = (seconds: number) => {
  if (!seconds || seconds <= 0) return '0 sec';

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  if (mins > 0 && secs > 0) {
    return `${mins} min ${secs} sec`;
  } else if (mins > 0) {
    return `${mins} min`;
  } else {
    return `${secs} sec`;
  }
};


export const formatTime12h = (time24: string) => {
  if (!time24) return '';

  const [hourStr, minuteStr] = time24.split(':');
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';

  hour = hour % 12;
  if (hour === 0) hour = 12;

  return `${hour}${minute > 0 ? `:${minute.toString().padStart(2, '0')}` : ''} ${ampm}`;
};


