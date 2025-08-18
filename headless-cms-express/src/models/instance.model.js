const mongoose = require('mongoose');

const relationSchema = new mongoose.Schema({
  fieldName: { type: String, required: true },
  instance: { type: mongoose.Schema.Types.ObjectId, ref: 'Instance', required: true }
}, { _id: false });

const metaDataSchema = new mongoose.Schema({
  description: String,
  tags: [String]
}, { _id: false });

const instanceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  data: { type: Object, default: {} , required: true},
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  relations: { type: [relationSchema], default: [] },
  metaData: { type: metaDataSchema, default: {} },
  //createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Instance' }, // staff/user who created
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Instance' },
  deleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Instance', instanceSchema);
