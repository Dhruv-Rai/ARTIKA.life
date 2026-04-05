const Reminder = require("../Model/Reminder");

// ─────────────────────────────────────────────────────────────────────────────
//  REMINDER CONTROLLERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @desc    Create a new medication reminder
 * @route   POST /api/reminders
 * @body    { memberId, medication, duration, frequency, times[] }
 * @access  Public
 */
const createReminder = async (req, res) => {
  try {
    const { memberId, medication, duration, frequency, times } = req.body;

    const reminder = new Reminder({
      memberId,
      medication,
      duration,
      frequency,
      times,
    });

    const saved = await reminder.save();
    res.status(201).json({ success: true, message: "Reminder created", data: saved });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all reminders for a specific member
 * @route   GET /api/reminders/member/:memberId
 * @access  Public
 */
const getRemindersByMember = async (req, res) => {
  try {
    const reminders = await Reminder.find({ memberId: req.params.memberId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: reminders.length, data: reminders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all reminders (from all members)
 * @route   GET /api/reminders
 * @access  Public
 */
const getAllReminders = async (req, res) => {
  try {
    // Populate memberId to also return the linked member's name
    const reminders = await Reminder.find()
      .populate("memberId", "name relation category")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reminders.length, data: reminders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update a reminder
 * @route   PUT /api/reminders/:id
 * @access  Public
 */
const updateReminder = async (req, res) => {
  try {
    const updated = await Reminder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Reminder not found" });
    }

    res.status(200).json({ success: true, message: "Reminder updated", data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete a reminder
 * @route   DELETE /api/reminders/:id
 * @access  Public
 */
const deleteReminder = async (req, res) => {
  try {
    const deleted = await Reminder.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Reminder not found" });
    }
    res.status(200).json({ success: true, message: "Reminder deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createReminder,
  getRemindersByMember,
  getAllReminders,
  updateReminder,
  deleteReminder,
};
