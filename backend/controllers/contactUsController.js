const ContactUs = require("../models/Contactus");

// ✅ Create Contact Message
exports.createContactMessage = async (req, res) => {
  try {
    const { fullName, email, message } = req.body;

    // validation
    if (!fullName || !email || !message) {
      return res.status(400).json({
        message: "Full Name, Email and Message are required ❌",
      });
    }

    // create message
    const contact = await ContactUs.create({
      fullName,
      email,
      message,
    });

    res.status(201).json({
      message: "Contact message sent successfully ✅",
      data: contact,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ✅ Get All Contact Messages
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await ContactUs.find().sort({ createdAt: -1 });

    res.status(200).json({
      total: messages.length,
      data: messages,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ✅ Delete Contact Message
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMessage = await ContactUs.findByIdAndDelete(id);

    if (!deletedMessage) {
      return res.status(404).json({
        message: "Message not found ❌",
      });
    }

    res.status(200).json({
      message: "Message deleted successfully ✅",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
