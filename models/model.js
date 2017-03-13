const mongoose = require('mongoose')
const Schema = mongoose.Schema

// create a schema
const modelSchema = new mongoose.Schema({
  imageUrl: {type: String},
  textDetect: {type: String},
  textTranslate: {type: String},
  user_id: {type: Schema.Types.ObjectId, ref: 'User'}
})

const Model = mongoose.model('Model', modelSchema)
module.exports = Model
