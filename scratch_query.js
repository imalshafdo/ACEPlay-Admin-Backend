import mongoose from 'mongoose';
import dotenv from 'dotenv';
import SiteSettings from './models/SiteSettings.js';
import Banner from './models/Banner.js';

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB.");
  
  const siteSettings = await SiteSettings.find({});
  console.log(`\nFound ${siteSettings.length} site settings:`);
  for (const s of siteSettings) {
    console.log(`- OwnerId: ${s.ownerId}, SiteName: ${s.siteName}, SiteKey: ${s.siteKey}`);
    console.log(`  LaunchYear: ${s.launchYear}, CountryGroup: ${s.countryGroup}`);
    console.log(`  depositMin: ${s.depositMin}, depositMax: ${s.depositMax}`);
    console.log(`  Tagline: ${s.tagline}`);
  }

  const banners = await Banner.find({});
  console.log(`\nFound ${banners.length} banners:`);
  for (const b of banners) {
    console.log(`- OwnerId: ${b.ownerId}, SiteKey: ${b.siteKey}, Placement: ${b.placement}`);
    console.log(`  Deposit: ${b.deposit}, Bonus: ${b.bonus}, Turnover: ${b.turnover}`);
    console.log(`  Withdraw: ${b.withdraw}`);
  }

  await mongoose.disconnect();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

