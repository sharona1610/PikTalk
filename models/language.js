const mongoose = require('mongoose');

// create a schema
const languageSchema = new mongoose.Schema({
  langName: {type: String},
  code: {type: String}
});

const Language = mongoose.model('Language', languageSchema);
module.exports = Language;
