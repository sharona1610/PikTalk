const mongoose = require('mongoose');

// create a schema
const modelSchema = new mongoose.Schema({
  textResult: { type: Array }
});

const Model = mongoose.model('Model', modelSchema);
module.exports = Model;
