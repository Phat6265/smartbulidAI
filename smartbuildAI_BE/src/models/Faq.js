const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    // category/tag nếu sau này muốn nhóm FAQ
    category: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Faq', faqSchema);

