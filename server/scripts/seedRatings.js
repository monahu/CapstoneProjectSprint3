// Script to seed the Rating collection with default types
const mongoose = require('mongoose');
const Rating = require('../models/Rating');
require('dotenv').config();

const ratings = [
  { type: 'RECOMMENDED', description: 'Highly recommended place' },
  { type: 'NEW', description: 'Newly added place' },
  { type: 'SO-SO', description: 'Average or so-so place' },
];

async function seedRatings() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const rating of ratings) {
    const exists = await Rating.findOne({ type: rating.type });
    if (!exists) {
      await Rating.create(rating);
      console.log(`Inserted rating: ${rating.type}`);
    } else {
      console.log(`Rating already exists: ${rating.type}`);
    }
  }
  await mongoose.disconnect();
  console.log('Done seeding ratings.');
}

seedRatings().catch(err => {
  console.error(err);
  process.exit(1);
});
