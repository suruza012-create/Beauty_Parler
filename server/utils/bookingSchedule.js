const parseBookingTime = value => {
  const match = String(value || '').trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2] || 0);
  const meridiem = match[3]?.toUpperCase();
  if (minutes > 59 || hours > 24) return null;

  if (meridiem) {
    if (hours < 1 || hours > 12) return null;
    hours %= 12;
    if (meridiem === 'PM') hours += 12;
  } else if (hours > 23) {
    return null;
  }

  return hours * 60 + minutes;
};

const getDurationMinutes = value => {
  const text = String(value || '60 minutes').toLowerCase();
  const match = text.match(/(\d+(?:\.\d+)?)/);
  if (!match) return 60;
  const amount = Number(match[1]);
  return /hour|hr/.test(text) ? Math.round(amount * 60) : Math.round(amount);
};

const intervalsOverlap = (firstStart, firstDuration, secondStart, secondDuration) => (
  firstStart < secondStart + secondDuration && secondStart < firstStart + firstDuration
);

module.exports = { parseBookingTime, getDurationMinutes, intervalsOverlap };