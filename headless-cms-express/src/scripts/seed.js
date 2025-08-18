const mongoose = require('mongoose');
const Category = require('../models/category.model');
const Instance = require('../models/instance.model');
require('dotenv').config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  const systemCategories = [
    {
      name: 'User',
      system: true,
      deletable: false,
      changable: false,
      dataFields: [
        { name: 'username', type: 'string', required: true, unique: true },
        { name: 'email', type: 'string', required: true, unique: true, validation: 'email' },
        { name: 'password', type: 'string', required: true },
        { name: 'status', type: 'string', defaultValue: 'active' }
      ]
    },
    {
      name: 'Staff',
      system: true,
      deletable: false,
      changable: false,
      dataFields: [
        { name: 'username', type: 'string', required: true, unique: true },
        { name: 'email', type: 'string', required: true, unique: true, validation: 'email' },
        { name: 'password', type: 'string', required: true },
        { name: 'role', type: 'string', required: true },
        { name: 'permissions', type: 'string' }
      ]
    },
    {
      name: 'Media',
      system: true,
      deletable: false,
      changable: false,
      dataFields: [
        { name: 'fileName', type: 'string', required: true },
        { name: 'fileType', type: 'string', required: true },
        { name: 'url', type: 'string', required: true, validation: 'url' },
        { name: 'size', type: 'number' }
      ]
    },
    {
      name: 'Setting',
      system: true,
      deletable: false,
      changable: false,
      dataFields: [
        { name: 'key', type: 'string', required: true, unique: true },
        { name: 'value', type: 'string', required: true },
      ]
    },
    {
      name: 'StaticPage',
      system: true,
      deletable: false,
      changable: false,
      dataFields: [
        { name: 'title', type: 'string', required: true },
        { name: 'slug', type: 'string', required: true, unique: true },
        { name: 'content', type: 'richtext', required: true },
      ]
    },
    {
      name: 'GeneralMetadata',
      system: true,
      deletable: false,
      changable: false,
      dataFields: [
        { name: 'siteName', type: 'string', required: true },
        { name: 'seoDescription', type: 'string' },
        { name: 'keywords', type: 'string' }
      ]
    }
  ];

  for (const cat of systemCategories) {
    let category = await Category.findOne({ name: cat.name });
    if (!category) {
      category = await Category.create(cat);
      console.log(`Created system category: ${cat.name}`);

      // Default admin staff
      if (cat.name === 'Staff') {
        const hashed = await bcrypt.hash('admin123', 10);
        const adminStaff = new Instance({
          name: 'System Admin',
          category: category._id,
          data: {
            username: 'admin',
            email: 'admin@example.com',
            password: hashed,
            role: 'admin',
            permissions: ['*']
          }
        });
        await adminStaff.save();
        console.log('Created default admin staff');
      }
    }
  }

  console.log('Seeding complete!');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  mongoose.disconnect();
});
