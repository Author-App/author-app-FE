export const roundPercentage = (value: number): number => {
  return Math.round(value);
};

export const formatPagesLeft = (currentPage: number, totalPages: number): string => {
  if (!totalPages) return '';
  
  const pagesLeft = totalPages - currentPage;
  if (pagesLeft <= 0) return 'Completed';
  return `${pagesLeft} pages left`;
};

export const formatLastRead = (lastReadAt: string): string => {
  const date = new Date(lastReadAt);
  if (Number.isNaN(date.getTime())) return '';

  const now = Date.now();
  const diffMs = now - date.getTime();
  if (diffMs < 0) return 'Just now';

  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const formatTimeLeft = (currentSec: number, totalSec: number): string => {
  const leftSec = totalSec - currentSec;
  if (leftSec <= 0) return 'Completed';

  const mins = Math.floor(leftSec / 60);
  if (mins < 1) return 'Less than a minute left';
  if (mins < 60) return `${mins} min left`;

  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return remainingMins > 0 ? `${hours}h ${remainingMins}m left` : `${hours}h left`;
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

const JOIN_WINDOW_MINUTES = 10;
const EVENT_DURATION_HOURS = 2;

export interface EventTimeInput {
  eventStartUtc?: string | null;
  eventDate?: string | null;
  eventTime?: string;
  timezone?: string;
}

export interface ResolvedEventStart {
  instant: Date | null;
  isAbsolute: boolean;
}

export const resolveEventStart = (event: EventTimeInput): ResolvedEventStart => {
  if (event.eventStartUtc) {
    const instant = new Date(event.eventStartUtc);
    if (!Number.isNaN(instant.getTime())) {
      return { instant, isAbsolute: true };
    }
  }

  if (!event.eventDate) {
    return { instant: null, isAbsolute: false };
  }

  const dateOnlyMatch = event.eventDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
  const localDate = dateOnlyMatch
    ? new Date(Number(dateOnlyMatch[1]), Number(dateOnlyMatch[2]) - 1, Number(dateOnlyMatch[3]))
    : new Date(event.eventDate);

  if (Number.isNaN(localDate.getTime())) {
    return { instant: null, isAbsolute: false };
  }

  if (event.eventTime) {
    const [hourStr, minuteStr, secondStr] = event.eventTime.split(':');
    const hour = Number(hourStr);
    const minute = Number(minuteStr);
    const second = Number(secondStr ?? 0);

    if (!Number.isNaN(hour) && !Number.isNaN(minute)) {
      localDate.setHours(hour, minute, second, 0);
    }
  }

  return { instant: localDate, isAbsolute: false };
};

export const formatDate = (isoDate: string): string => {
  if (!isoDate) return '';

  const dateOnlyMatch = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const date = dateOnlyMatch
    ? new Date(Number(dateOnlyMatch[1]), Number(dateOnlyMatch[2]) - 1, Number(dateOnlyMatch[3]))
    : new Date(isoDate);

  if (Number.isNaN(date.getTime())) return '';

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  };

  return date.toLocaleDateString('en-US', options);
};

export const formatDuration = (durationSec: number): string => {
  if (!durationSec || durationSec < 0) return '00:00';

  const hours = Math.floor(durationSec / 3600);
  const minutes = Math.floor((durationSec % 3600) / 60);
  const seconds = Math.floor(durationSec % 60);

  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');

  // Hours only appear once needed, so short audio stays as mm:ss.
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
};

/**
 * Format duration in compact form (e.g., "2h 30m" or "45 min")
 * Used for audiobooks, videos, etc.
 */
export const formatDurationCompact = (seconds: number): string => {
  if (!seconds || seconds <= 0) return '0 min';

  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);

  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins} min`;
};


export const formatTime12h = (time24: string): string => {
  if (!time24) return '';

  const [hourStr, minuteStr] = time24.split(':');
  const hour24 = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  // Nonsense input renders as nothing rather than a plausible wrong time.
  if (Number.isNaN(hour24) || Number.isNaN(minute)) return '';
  if (hour24 < 0 || hour24 > 23) return '';
  if (minute < 0 || minute > 59) return '';

  const ampm = hour24 >= 12 ? 'PM' : 'AM';
  const hour = hour24 % 12 === 0 ? 12 : hour24 % 12;

  return `${hour}${minute > 0 ? `:${minute.toString().padStart(2, '0')}` : ''} ${ampm}`;
};

const getDateOnlyLocal = (eventDate: string | null): Date | null => {
  if (!eventDate) return null;

  const match = eventDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;

  const [, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
};

export const formatEventDisplay = (
  event: EventTimeInput,
  viewerTimeZone?: string
): {
  dateLabel: string;
  timeLabel: string;
  timezoneLabel?: string;
  badgeDay: number | null;
  badgeMonthLabel: string;
} => {
  const resolved = resolveEventStart(event);

  if (!event.eventDate) {
    return {
      dateLabel: '',
      timeLabel: event.timezone ? '' : formatTime12h(event.eventTime || ''),
      timezoneLabel: undefined,
      badgeDay: null,
      badgeMonthLabel: '',
    };
  }

  if (!resolved.instant || !resolved.isAbsolute) {
    const parsedDate = getDateOnlyLocal(event.eventDate) ?? new Date(event.eventDate);
    const badgeMonthLabel = Number.isNaN(parsedDate.getTime())
      ? ''
      : parsedDate.toLocaleString('en-US', { month: 'short' });

    return {
      dateLabel: formatDate(event.eventDate),
      timeLabel: formatTime12h(event.eventTime || ''),
      timezoneLabel: undefined,
      badgeDay: Number.isNaN(parsedDate.getTime()) ? null : parsedDate.getDate(),
      badgeMonthLabel,
    };
  }

  const resolvedViewerTimeZone = viewerTimeZone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const viewerDateFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: resolvedViewerTimeZone,
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });

  const viewerTimeFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: resolvedViewerTimeZone,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  let timezoneLabel: string | undefined;
  if (event.timezone) {
    const timezoneFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: event.timezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short',
    });

    const formattedPart = timezoneFormatter.formatToParts(resolved.instant)
      .find((part) => part.type === 'timeZoneName');

    timezoneLabel = formattedPart?.value ? formattedPart.value : undefined;
  }

  return {
    dateLabel: viewerDateFormatter.format(resolved.instant),
    timeLabel: viewerTimeFormatter.format(resolved.instant),
    timezoneLabel,
    badgeDay: Number(new Intl.DateTimeFormat('en-US', { timeZone: resolvedViewerTimeZone, day: 'numeric' }).format(resolved.instant)),
    badgeMonthLabel: new Intl.DateTimeFormat('en-US', { timeZone: resolvedViewerTimeZone, month: 'short' }).format(resolved.instant),
  };
};

export const isWithinJoinWindow = (event: EventTimeInput): boolean => {
  return getJoinStatus(event) === 'live';
};

export const getJoinStatus = (event: EventTimeInput): "upcoming" | "live" | "ended" => {
  const { instant } = resolveEventStart(event);
  if (!instant) {
    // A broken event date is more harmful than a hidden button, so treat it as already ended.
    return 'ended';
  }

  const now = new Date();

  const joinWindowStart = new Date(instant);
  joinWindowStart.setMinutes(joinWindowStart.getMinutes() - JOIN_WINDOW_MINUTES);

  const eventEnd = new Date(instant);
  eventEnd.setHours(eventEnd.getHours() + EVENT_DURATION_HOURS);

  if (now < joinWindowStart) return 'upcoming';
  if (now >= joinWindowStart && now <= eventEnd) return 'live';
  return 'ended';
};




