import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB.");

  const collections = ['banners', 'promotions', 'bigwins', 'populargames', 'navitems'];
  for (const collName of collections) {
    const docs = await mongoose.connection.db.collection(collName).find({ siteKey: { $exists: false } }).toArray();
    console.log(`\n--- ${collName} without siteKey: found ${docs.length} docs ---`);
    for (const d of docs) {
      console.log(`- ID: ${d._id}, Owner: ${d.ownerId}, Title/Name: ${d.title || d.name || d.gameName || d.label}`);
    }
  }

  await mongoose.disconnect();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
