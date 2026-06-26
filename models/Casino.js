import mongoose from 'mongoose';

const CasinoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  siteKey: { type: String },
  currency: { type: String, default: "৳" },
  system: { type: String, default: "OCMS" },
  description: { type: String, default: "" },
  launchYear: { type: String },
  language: [{ type: String }],
  countryGroup: { type: String, required: true, lowercase: true }, // e.g. "bangladesh", "thailand"
  status: { type: String, enum: ['draft', 'published'], default: 'published' },
  tier: { type: String, default: "1" },                            // from casinos.json mapping
  network: { type: String, default: "act" },                       // from casinos.json mapping
  url: {
    main: String,
    referral: String,
    query: String,
    backup: [String],
    promotion: String,
    logo: String,
    game: {
      slot: String, fishing: String, crash: String, live: String,
      sports: String, bingo: String, cockFighting: String, lottery: String, others: String
    },
    socialMedia: { line: String, telegram: String, facebook: String, instagram: String, x: String }
  },
  keyFeatures: [String],
  payment: {
    minDepositPerTime: Number, maxDepositPerTime: Number, maxDepositPerDay: { type: mongoose.Schema.Types.Mixed, default: "No Limit" },
    minWithdrawalPerTime: Number, maxWithdrawalPerTime: Number, maxWithdrawalPerDay: { type: mongoose.Schema.Types.Mixed, default: "No Limit" },
    channel: [String]
  },
  welcomeBonus: {
    title: String, subTitle: String, description: String,
    deposit: String, bonus: String, turnover: String, netwin: String,
    maxWithdrawal: String, gameTypes: [String], url: String, image: String
  },
  topGame: {
    gameName: String, gamePlatform: String, rtp: Number, url: String,
    highestWon: { date: String, time: String, betAmount: Number, winAmount: Number, image: { cover: String, winLists: [String] } }
  },
  bigWinHistory: [{
    date: String, time: String, gameName: String, gamePlatform: String, betAmount: Number, winAmount: Number, url: String,
    image: { cover: String, winLists: [String] }
  }],
  topGames: [{
    gameName: String, gamePlatform: String,
    highestWon: { date: String, time: String, betAmount: Number, winAmount: Number, image: { cover: String, winLists: [String] } }
  }],
  promotions: [{
    name: String, tag: String, image: String, deposit: String, bonus: String, turnover: String,
    netwin: String, gameTypes: [String], maxWithdrawal: String, availability: String, url: String
  }],
  certified: {
    gc: { name: { type: String, default: "Gaming Curacao" }, status: { type: Boolean, default: true } },
    gli: { name: { type: String, default: "Gaming Laboratories International" }, status: { type: Boolean, default: true } },
    iTech: { name: { type: String, default: "iTech Labs" }, status: { type: Boolean, default: true } }
  }
}, { timestamps: true });

CasinoSchema.index({ name: 1, ownerId: 1 }, { unique: true });

const Casino = mongoose.model('Casino', CasinoSchema);

// Drop legacy global index on name if it exists to allow per-tenant duplicates
Casino.collection.dropIndex('name_1').catch(() => {});

export default Casino;