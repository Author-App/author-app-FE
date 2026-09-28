import {
  formatPagesLeft,
  formatTimeLeft,
  percentageToDecimal,
  getInitials,
  formatDuration,
  formatDurationCompact,
  formatTime12h,
  formatEventDisplay,
  formatLastRead,
  resolveEventStart,
  getJoinStatus,
  isWithinJoinWindow,

} from '../helper';

describe('formatPagesLeft', () => {
  it('returns an empty string when the total page count is unknown', () => {
    expect(formatPagesLeft(10, 0)).toBe('');
  });

  it('counts the remaining pages mid-book', () => {
    expect(formatPagesLeft(30, 100)).toBe('70 pages left');
  });

  it('says Completed on the last page', () => {
    expect(formatPagesLeft(100, 100)).toBe('Completed');
  });

  // A stale progress record can put the current page past the end.
  it('says Completed when the current page is past the end', () => {
    expect(formatPagesLeft(120, 100)).toBe('Completed');
  });
});

describe('formatTimeLeft', () => {
  it('says Completed when nothing is left', () => {
    expect(formatTimeLeft(100, 100)).toBe('Completed');
    expect(formatTimeLeft(120, 100)).toBe('Completed');
  });

  it('avoids saying 0 min left for under a minute', () => {
    expect(formatTimeLeft(0, 30)).toBe('Less than a minute left');
  });

  it('shows whole minutes under an hour', () => {
    expect(formatTimeLeft(0, 300)).toBe('5 min left');
  });

  it('shows hours and minutes over an hour', () => {
    expect(formatTimeLeft(0, 5400)).toBe('1h 30m left');
  });

  it('drops the minutes when the remainder is exactly zero', () => {
    expect(formatTimeLeft(0, 7200)).toBe('2h left');
  });
});

describe('percentageToDecimal', () => {
  it('converts a percentage to a 0-to-1 decimal', () => {
    expect(percentageToDecimal(50)).toBe(0.5);
    expect(percentageToDecimal(0)).toBe(0);
    expect(percentageToDecimal(100)).toBe(1);
  });

  // The result drives a progress bar, which breaks visually outside 0-1.
  it('clamps values outside the range', () => {
    expect(percentageToDecimal(150)).toBe(1);
    expect(percentageToDecimal(-20)).toBe(0);
  });

  it('returns 0 for NaN', () => {
    expect(percentageToDecimal(NaN)).toBe(0);
  });
});

describe('getInitials', () => {
  it('takes the first letter of the first two words', () => {
    expect(getInitials('John Doe')).toBe('JD');
  });

  it('uses one letter for a single word', () => {
    expect(getInitials('Cher')).toBe('C');
  });

  it('stops at two letters for longer names', () => {
    expect(getInitials('Mary Jane Watson Parker')).toBe('MJ');
  });

  it('uppercases lowercase input', () => {
    expect(getInitials('john doe')).toBe('JD');
  });

  it('ignores extra whitespace', () => {
    expect(getInitials('  John   Doe  ')).toBe('JD');
  });

  it('returns an empty string when there is no name', () => {
    expect(getInitials('')).toBe('');
    expect(getInitials(null)).toBe('');
    expect(getInitials(undefined)).toBe('');
  });
});

describe('formatDuration', () => {
  it('formats as mm:ss under an hour', () => {
  expect(formatDuration(65)).toBe('01:05');
  expect(formatDuration(5)).toBe('00:05');
  expect(formatDuration(600)).toBe('10:00');
});

it('adds an hours part once past an hour', () => {
  expect(formatDuration(3665)).toBe('1:01:05');
  expect(formatDuration(3600)).toBe('1:00:00');
});

it('truncates fractional seconds', () => {
  expect(formatDuration(65.7)).toBe('01:05');
});
});

describe('formatDurationCompact', () => {
  it('shows minutes only when under an hour', () => {
    expect(formatDurationCompact(300)).toBe('5 min');
  });

  it('shows hours and minutes when over an hour', () => {
    expect(formatDurationCompact(5400)).toBe('1h 30m');
  });

  it('keeps the minutes part at zero on a whole hour', () => {
    expect(formatDurationCompact(7200)).toBe('2h 0m');
  });

  it('falls back to 0 min for zero and negative input', () => {
    expect(formatDurationCompact(0)).toBe('0 min');
    expect(formatDurationCompact(-5)).toBe('0 min');
  });
});

describe('formatTime12h', () => {
  it('converts afternoon hours to PM', () => {
    expect(formatTime12h('13:00')).toBe('1 PM');
    expect(formatTime12h('19:30')).toBe('7:30 PM');
  });

  it('converts morning hours to AM', () => {
    expect(formatTime12h('09:15')).toBe('9:15 AM');
  });

  it('shows midnight as 12 AM', () => {
    expect(formatTime12h('00:00')).toBe('12 AM');
  });

  it('shows noon as 12 PM', () => {
    expect(formatTime12h('12:00')).toBe('12 PM');
  });

  it('omits the minutes when they are zero', () => {
    expect(formatTime12h('15:00')).toBe('3 PM');
  });

  it('returns an empty string for an out-of-range time', () => {
    expect(formatTime12h('25:00')).toBe('');
    expect(formatTime12h('12:99')).toBe('');
  });

  it('returns an empty string for unparseable input', () => {
    expect(formatTime12h('')).toBe('');
    expect(formatTime12h('not-a-time')).toBe('');
  });
});

describe('formatEventDisplay', () => {
  it('uses eventStartUtc for absolute display in the viewer timezone and retains the original timezone label', () => {
    const result = formatEventDisplay(
      {
        eventStartUtc: '2025-07-15T23:30:00Z',
        eventDate: '2025-07-15',
        eventTime: '19:30:00',
        timezone: 'America/New_York',
      },
      'America/Los_Angeles'
    );

    expect(result.dateLabel).toBe('Jul 15, 2025');
    expect(result.timeLabel).toBe('4:30 PM');
    expect(result.timezoneLabel).toBe('EDT');
    expect(result.badgeDay).toBe(15);
    expect(result.badgeMonthLabel).toBe('Jul');
  });

  it('preserves legacy behavior when eventStartUtc is null', () => {
    const result = formatEventDisplay({
      eventStartUtc: null,
      eventDate: '2025-07-15',
      eventTime: '23:30:00',
    });

    expect(result.dateLabel).toBe('Jul 15, 2025');
    expect(result.timeLabel).toBe('11:30 PM');
    expect(result.timezoneLabel).toBeUndefined();
    expect(result.badgeDay).toBe(15);
    expect(result.badgeMonthLabel).toBe('Jul');
  });
});

describe('clock-dependent helpers', () => {
  const NOW = '2025-12-19T12:00:00.000Z';

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(NOW));
  });

  afterEach(() => {
    // Leaked fake timers break unrelated test files.
    jest.useRealTimers();
  });

  describe('formatLastRead', () => {
    it('says Just now under a minute', () => {
      expect(formatLastRead('2025-12-19T11:59:30.000Z')).toBe('Just now');
    });

    it('counts minutes under an hour', () => {
      expect(formatLastRead('2025-12-19T11:15:00.000Z')).toBe('45m ago');
    });

    it('counts hours under a day', () => {
      expect(formatLastRead('2025-12-19T07:00:00.000Z')).toBe('5h ago');
    });

    it('says Yesterday at one day', () => {
      expect(formatLastRead('2025-12-18T10:00:00.000Z')).toBe('Yesterday');
    });

    it('counts days under a week', () => {
      expect(formatLastRead('2025-12-16T12:00:00.000Z')).toBe('3d ago');
    });

    it('returns an empty string rather than NaN for a broken timestamp', () => {
      expect(formatLastRead('not-a-date')).toBe('');
      expect(formatLastRead('')).toBe('');
    });

    // Device clock skew, otherwise the user sees "-3m ago".
    it('says Just now for a future timestamp', () => {
      expect(formatLastRead('2025-12-19T13:00:00.000Z')).toBe('Just now');
    });
  });

  describe('resolveEventStart', () => {
    it('prefers eventStartUtc over the legacy fields', () => {
      const { instant, isAbsolute } = resolveEventStart({
        eventStartUtc: '2025-12-19T11:00:00.000Z',
        eventDate: '2020-01-01T00:00:00.000Z',
        eventTime: '00:00:00',
      });

      expect(isAbsolute).toBe(true);
      expect(instant?.toISOString()).toBe('2025-12-19T11:00:00.000Z');
    });

    it('falls back to the legacy fields when eventStartUtc is absent', () => {
      const { instant, isAbsolute } = resolveEventStart({
        eventStartUtc: null,
        eventDate: '2025-12-19T00:00:00.000Z',
        eventTime: '11:30:00',
      });

      expect(isAbsolute).toBe(false);
      // Legacy events stay on the stored calendar day at the stored wall time.
      expect(instant?.getFullYear()).toBe(2025);
      expect(instant?.getMonth()).toBe(11);
      expect(instant?.getDate()).toBe(19);
      expect(instant?.getHours()).toBe(11);
      expect(instant?.getMinutes()).toBe(30);
    });

    it('falls back when eventStartUtc is present but unparseable', () => {
      const { instant, isAbsolute } = resolveEventStart({
        eventStartUtc: 'garbage',
        eventDate: '2025-12-19T00:00:00.000Z',
        eventTime: '11:00:00',
      });

      expect(isAbsolute).toBe(false);
      expect(instant?.getHours()).toBe(11);
    });

    it('returns no instant when there is nothing usable', () => {
      expect(resolveEventStart({}).instant).toBeNull();
      expect(resolveEventStart({ eventStartUtc: null, eventDate: null }).instant).toBeNull();
      expect(resolveEventStart({ eventDate: 'garbage' }).instant).toBeNull();
    });
  });

  describe('getJoinStatus', () => {
    const at = (eventStartUtc: string) => getJoinStatus({ eventStartUtc });

    it('is upcoming more than ten minutes before the start', () => {
      expect(at('2025-12-19T13:00:00.000Z')).toBe('upcoming');
      expect(at('2025-12-19T12:11:00.000Z')).toBe('upcoming');
    });

    it('is live once the ten minute early window opens', () => {
      expect(at('2025-12-19T12:09:00.000Z')).toBe('live');
    });

    it('is live during the event', () => {
      expect(at('2025-12-19T11:00:00.000Z')).toBe('live');
    });

    it('is live at the two hour end boundary', () => {
      expect(at('2025-12-19T10:00:00.000Z')).toBe('live');
    });

    it('is ended past two hours', () => {
      expect(at('2025-12-19T09:59:00.000Z')).toBe('ended');
    });

    // A join button pointing at a dead meeting is worse than no button.
    it('treats an unusable event as ended, not upcoming', () => {
      expect(getJoinStatus({})).toBe('ended');
      expect(getJoinStatus({ eventStartUtc: null, eventDate: null })).toBe('ended');
      expect(getJoinStatus({ eventDate: 'garbage' })).toBe('ended');
    });
  });

  describe('isWithinJoinWindow', () => {
    it('is true only while getJoinStatus says live', () => {
      const live = { eventStartUtc: '2025-12-19T11:00:00.000Z' };
      const ended = { eventStartUtc: '2025-12-19T09:00:00.000Z' };
      const upcoming = { eventStartUtc: '2025-12-19T15:00:00.000Z' };

      expect(isWithinJoinWindow(live)).toBe(true);
      expect(isWithinJoinWindow(ended)).toBe(false);
      expect(isWithinJoinWindow(upcoming)).toBe(false);
    });

    // These two used to disagree: 24 hours here, 2 hours in getJoinStatus.
    it('does not stay open for hours after the event ends', () => {
      const threeHoursAgo = { eventStartUtc: '2025-12-19T09:00:00.000Z' };

      expect(getJoinStatus(threeHoursAgo)).toBe('ended');
      expect(isWithinJoinWindow(threeHoursAgo)).toBe(false);
    });
  });
});