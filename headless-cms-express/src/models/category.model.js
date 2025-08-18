const mongoose = require('mongoose');

const dataFieldSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: {
        type: String,
        enum: ['string', 'number', 'boolean', 'date', 'richtext', 'image', 'relation'],
        required: true
    },
    required: { type: Boolean, default: false },
    unique: { type: Boolean, default: false },
    validation: { type: String }, // e.g., "email", "url", regex pattern
    defaultValue: { type: mongoose.Schema.Types.Mixed },
    relationCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' } // for relation type
}, { _id: false });

const metaDataSchema = new mongoose.Schema({
    description: String,
    tags: [String],
    seoKeywords: [String]
}, { _id: false });

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    dataFields: { type: [dataFieldSchema], default: [] },
    unique: { type: Boolean, default: false },   // only one instance allowed
    deletable: { type: Boolean, default: true },
    changable: { type: Boolean, default: true },
    system: { type: Boolean, default: false },   // system category (User, Staff, Media)
    permissions: {
        create: { type: [String], default: ['admin'] },
        read: { type: [String], default: ['admin', 'staff'] },
        update: { type: [String], default: ['admin'] },
        delete: { type: [String], default: ['admin'] }
    },
    metaData: { type: metaDataSchema, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
