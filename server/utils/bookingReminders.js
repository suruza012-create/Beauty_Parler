const cron = require('node-cron');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const { parseBookingTime } = require('./bookingSchedule');
const { sendEmail } = require('./mailer');

const timeZone = process.env.BOOKING_TIMEZONE || 'Asia/Dhaka';

const getLocalDateParts = date => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(date);
  return Object.fromEntries(parts.filter(part => part.type !== 'literal').map(part => [part.type, part.value]));
};

const getReminderDelayMinutes = (booking, now) => {
  const dateMatch = String(booking.bookingDate || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const timeMinutes = parseBookingTime(booking.bookingTime);
  if (!dateMatch || timeMinutes === null) return null;

  const localNow = getLocalDateParts(now);
  const currentMinute = Date.UTC(
    Number(localNow.year), Number(localNow.month) - 1, Number(localNow.day),
    Number(localNow.hour), Number(localNow.minute)
  ) / 60000;
  const bookingMinute = Date.UTC(
    Number(dateMatch[1]), Number(dateMatch[2]) - 1, Number(dateMatch[3])
  ) / 60000 + timeMinutes;
  return bookingMinute - currentMinute;
};

const runBookingReminders = async (now = new Date()) => {
  const localNow = getLocalDateParts(now);
  const today = `${localNow.year}-${localNow.month}-${localNow.day}`;
  const nextDayDate = new Date(Date.UTC(Number(localNow.year), Number(localNow.month) - 1, Number(localNow.day) + 1));
  const nextDayParts = getLocalDateParts(nextDayDate);
  const tomorrow = `${nextDayParts.year}-${nextDayParts.month}-${nextDayParts.day}`;
  const candidates = await Booking.find({
    bookingDate: { $in: [today, tomorrow] },
    status: 'confirmed',
    reminderSentAt: null
  }).populate('userId', 'email').populate('serviceId', 'name');

  for (const booking of candidates) {
    const delayMinutes = getReminderDelayMinutes(booking, now);
    if (delayMinutes === null || delayMinutes > 1440 || delayMinutes < 1200) continue;

    const claimed = await Booking.findOneAndUpdate(
      { _id: booking._id, status: 'confirmed', reminderSentAt: null },
      { $set: { reminderSentAt: now } },
      { new: true }
    );
    if (!claimed) continue;

    const serviceName = booking.serviceId?.name || 'your service';
    const message = `Reminder: your ${serviceName} appointment is scheduled for ${booking.bookingDate} at ${booking.bookingTime}.`;
    try {
      await Notification.create({
        userId: booking.userId._id,
        title: 'Appointment reminder',
        message,
        relatedId: booking._id,
        relatedType: 'booking'
      });
      if (booking.userId.email) {
        await sendEmail({ to: booking.userId.email, subject: 'Your appointment reminder', text: message });
      }
    } catch (error) {
      console.error('Appointment reminder could not be delivered:', error.message);
    }
  }
};

const startBookingReminders = () => {
  cron.schedule('*/10 * * * *', () => {
    runBookingReminders().catch(error => console.error('Booking reminder job failed:', error.message));
  }, { timezone: timeZone });
};

module.exports = { getReminderDelayMinutes, runBookingReminders, startBookingReminders };