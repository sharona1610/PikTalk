const mongoose = require('mongoose')
const Schema = mongoose.Schema

// create a schema
const textSchema = new mongoose.Schema({
  imageUrl: {type: String},
  textDetect: {type: String},
  textTranslate: {type: String},
  ttsCode: {type: String},
  user_id: {type: Schema.Types.ObjectId, ref: 'User'}
})

const Text = mongoose.model('Text', textSchema)
module.exports = Text
