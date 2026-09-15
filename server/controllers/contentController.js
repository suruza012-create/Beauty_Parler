const Gallery = require('../models/Gallery');
const Video = require('../models/Video');
const ContactMessage = require('../models/ContactMessage');
const SiteSettings = require('../models/SiteSettings');

exports.getGallery = async (req, res) => {
  try {
    const gallery = await Gallery.find().sort({ createdAt: -1 });
    res.json({ success: true, gallery });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json({ success: true, videos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email and message are required' });
    }
    const contact = await ContactMessage.create({ name, email, message });
    res.status(201).json({ success: true, message: 'Message sent successfully', contact });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getSettings = async (req, res) => {
  const settings = await SiteSettings.findOneAndUpdate({ key: 'main' }, {}, { upsert: true, new: true, setDefaultsOnInsert: true });
  res.json({ success: true, settings });
};

exports.updateSettings = async (req, res) => {
  const settings = await SiteSettings.findOneAndUpdate({ key: 'main' }, req.body, { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true });
  res.json({ success: true, settings });
};

exports.getContactMessages = async (req, res) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  res.json({ success: true, messages });
};

exports.updateContactMessage = async (req, res) => {
  const message = await ContactMessage.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
  if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
  res.json({ success: true, message });
};

exports.createGallery = async (req, res) => {
  const gallery = await Gallery.create(req.body);
  res.status(201).json({ success: true, gallery });
};

exports.deleteGallery = async (req, res) => {
  await Gallery.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};

exports.createVideo = async (req, res) => {
  const video = await Video.create(req.body);
  res.status(201).json({ success: true, video });
};

exports.deleteVideo = async (req, res) => {
  await Video.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
