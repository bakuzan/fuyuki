const defaults = {
  now: 'now',
  seconds: {
    1: 'second',
    2: 'seconds'
  },
  minutes: {
    1: 'minute',
    2: 'minutes'
  },
  hours: {
    1: 'hour',
    2: 'hours'
  },
  days: {
    1: 'day',
    2: 'days'
  },
  weeks: {
    1: 'week',
    2: 'weeks'
  },
  months: {
    1: 'month',
    2: 'months'
  },
  years: {
    1: 'year',
    2: 'years'
  }
};

function getUnit(interval: number, unit: string, opts: any) {
  let ret;

  if (typeof opts[unit] === 'string') {
    return opts[unit];
  }

  Object.keys(opts[unit]).forEach(function(key) {
    if (Number(key) <= interval) {
      ret = opts[unit][key];
    }
  });

  return ret;
}

export default function formatDateTimeAgo(
  date: Date | number | string,
  opts = defaults
) {
  const past = date instanceof Date ? date : new Date(date);
  const now = new Date();

  if (!isFinite(past.getTime()) || !date) {
    throw new TypeError('Failed to parse the date');
  }

  let seconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  let interval = Math.floor(seconds / 31536000);

  // We're not interested in future dates at the moment.
  // Review if that becomes necessary.
  if (seconds < 0) {
    seconds = 0;
    interval = 0;
  }

  if (interval >= 1) {
    return interval + ' ' + getUnit(interval, 'years', opts);
  }

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return interval + ' ' + getUnit(interval, 'months', opts);
  }

  interval = Math.floor(seconds / (86400 * 7));
  if (interval >= 1) {
    return interval + ' ' + getUnit(interval, 'weeks', opts);
  }

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval + ' ' + getUnit(interval, 'days', opts);
  }

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return interval + ' ' + getUnit(interval, 'hours', opts);
  }

  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval + ' ' + getUnit(interval, 'minutes', opts);
  }

  interval = Math.floor(seconds);
  if (interval === 0) {
    return opts.now;
  }

  return interval + ' ' + getUnit(interval, 'seconds', opts);
}
