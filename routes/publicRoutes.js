import express from 'express';
import { createCrudHandlers } from '../utils/crudFactory.js';
import Casino from '../models/Casino.js';
import Banner from '../models/Banner.js';
import Promotion from '../models/Promotion.js';
import GameList from '../models/GameList.js';
import Content from '../models/Content.js';
import CasinoAvailability from '../models/CasinoAvailability.js';
import GameTypeConfig from '../models/GameTypeConfig.js';
import Country from '../models/Country.js';
import NavItem from '../models/NavItem.js';
import BigWin from '../models/BigWin.js';
import PopularGame from '../models/PopularGame.js';
import Admin from '../models/Admin.js';
import SiteSettings from '../models/SiteSettings.js';
import { getHomepage } from '../controllers/homepageController.js';

const router = express.Router();
const published = { status: 'published' };

// ─── Casinos (explicit route — public, published-only, sensitive fields excluded) ───
const CASINO_EXCLUDE = { __v: 0, createdAt: 0, updatedAt: 0 };

router.get('/casinos', async (req, res) => {
  try {
    const { countryGroup, tier, network } = req.query;

    const admins = await Admin.find({});
    const clientIds = admins.filter(a => a.role === 'client').map(a => a._id);

    const filter = { ...published, ownerId: { $in: clientIds } };
    if (tier)         filter.tier         = tier;
    if (network)      filter.network      = network;

    const casinos = await Casino.find(filter, CASINO_EXCLUDE).sort({ sortOrder: 1, createdAt: -1 });
    const siteSettingsList = await SiteSettings.find({});
    const banners = await Banner.find({ status: 'published', placement: 'exclusive' });
    
    const mergedCasinos = casinos.map(c => {
      const casinoObj = c.toObject ? c.toObject() : c;
      if (c.ownerId) {
        const settings = siteSettingsList.find(s => 
          (c.siteKey && s.siteKey === c.siteKey) || 
          (!c.siteKey && s.ownerId?.toString() === c.ownerId.toString())
        );
        if (settings) {
          if (settings.siteName) casinoObj.name = settings.siteName;
          if (settings.launchYear) casinoObj.launchYear = settings.launchYear;
          if (settings.countryGroup) casinoObj.countryGroup = settings.countryGroup;
          if (settings.logoUrl) {
            casinoObj.url = casinoObj.url || {};
            casinoObj.url.logo = settings.logoUrl;
          }
          if (settings.tagline) {
            casinoObj.welcomeBonus = casinoObj.welcomeBonus || {};
            casinoObj.welcomeBonus.title = settings.tagline;
          }
          if (settings.depositMin) {
            const minDepVal = parseInt(settings.depositMin.replace(/[^0-9]/g, ''), 10);
            if (!isNaN(minDepVal)) {
              casinoObj.payment = casinoObj.payment || {};
              casinoObj.payment.minDepositPerTime = minDepVal;
            }
          }
          if (settings.depositMax) {
            const maxDepVal = parseInt(settings.depositMax.replace(/[^0-9]/g, ''), 10);
            if (!isNaN(maxDepVal)) {
              casinoObj.payment = casinoObj.payment || {};
              casinoObj.payment.maxDepositPerTime = maxDepVal;
            }
          }
        }
      }

      // Merge matching exclusive banner welcome bonus details
      const matchingBanner = banners.find(b => 
        (c.siteKey && b.siteKey === c.siteKey) ||
        (!c.siteKey && b.ownerId && c.ownerId && b.ownerId.toString() === c.ownerId.toString())
      );
      if (matchingBanner) {
        casinoObj.welcomeBonus = casinoObj.welcomeBonus || {};
        if (matchingBanner.deposit !== undefined && matchingBanner.deposit !== null) {
          casinoObj.welcomeBonus.deposit = matchingBanner.deposit;
        }
        if (matchingBanner.bonus !== undefined && matchingBanner.bonus !== null) {
          casinoObj.welcomeBonus.bonus = matchingBanner.bonus;
        }
        if (matchingBanner.turnover !== undefined && matchingBanner.turnover !== null) {
          casinoObj.welcomeBonus.turnover = matchingBanner.turnover;
        }
        if (matchingBanner.withdraw !== undefined && matchingBanner.withdraw !== null) {
          casinoObj.welcomeBonus.maxWithdrawal = matchingBanner.withdraw;
        }
        if (matchingBanner.image) {
          casinoObj.welcomeBonus.image = matchingBanner.image;
        }
        if (matchingBanner.link) {
          casinoObj.welcomeBonus.url = matchingBanner.link;
        }
      }

      return casinoObj;
    });

    let finalCasinos = mergedCasinos;
    if (countryGroup) {
      finalCasinos = mergedCasinos.filter(c => {
        if (countryGroup === 'philippinespg' || countryGroup === 'philippines') {
          return c.countryGroup === 'philippines' || c.countryGroup === 'philippinespg';
        }
        return c.countryGroup === countryGroup;
      });
    }

    res.json({ success: true, data: finalCasinos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/casinos/:id', async (req, res) => {
  try {
    const admins = await Admin.find({});
    const clientIds = admins.filter(a => a.role === 'client').map(a => a._id);

    const casino = await Casino.findOne({ _id: req.params.id, ...published, ownerId: { $in: clientIds } }, CASINO_EXCLUDE);
    if (!casino) return res.status(404).json({ success: false, message: 'Casino not found' });
    
    const casinoObj = casino.toObject ? casino.toObject() : casino;
    if (casinoObj.ownerId) {
      const settings = (casinoObj.siteKey ? await SiteSettings.findOne({ siteKey: casinoObj.siteKey }) : null) || 
                       await SiteSettings.findOne({ ownerId: casinoObj.ownerId });
      if (settings) {
        if (settings.siteName) casinoObj.name = settings.siteName;
        if (settings.launchYear) casinoObj.launchYear = settings.launchYear;
        if (settings.countryGroup) casinoObj.countryGroup = settings.countryGroup;
        if (settings.logoUrl) {
          casinoObj.url = casinoObj.url || {};
          casinoObj.url.logo = settings.logoUrl;
        }
        if (settings.tagline) {
          casinoObj.welcomeBonus = casinoObj.welcomeBonus || {};
          casinoObj.welcomeBonus.title = settings.tagline;
        }
        if (settings.depositMin) {
          const minDepVal = parseInt(settings.depositMin.replace(/[^0-9]/g, ''), 10);
          if (!isNaN(minDepVal)) {
            casinoObj.payment = casinoObj.payment || {};
            casinoObj.payment.minDepositPerTime = minDepVal;
          }
        }
        if (settings.depositMax) {
          const maxDepVal = parseInt(settings.depositMax.replace(/[^0-9]/g, ''), 10);
          if (!isNaN(maxDepVal)) {
            casinoObj.payment = casinoObj.payment || {};
            casinoObj.payment.maxDepositPerTime = maxDepVal;
          }
        }
      }
    }

    // Merge matching exclusive banner welcome bonus details
    const matchingBanner = casinoObj.siteKey
      ? await Banner.findOne({ siteKey: casinoObj.siteKey, status: 'published', placement: 'exclusive' })
      : await Banner.findOne({ ownerId: casinoObj.ownerId, status: 'published', placement: 'exclusive' });
    if (matchingBanner) {
      casinoObj.welcomeBonus = casinoObj.welcomeBonus || {};
      if (matchingBanner.deposit !== undefined && matchingBanner.deposit !== null) {
        casinoObj.welcomeBonus.deposit = matchingBanner.deposit;
      }
      if (matchingBanner.bonus !== undefined && matchingBanner.bonus !== null) {
        casinoObj.welcomeBonus.bonus = matchingBanner.bonus;
      }
      if (matchingBanner.turnover !== undefined && matchingBanner.turnover !== null) {
        casinoObj.welcomeBonus.turnover = matchingBanner.turnover;
      }
      if (matchingBanner.withdraw !== undefined && matchingBanner.withdraw !== null) {
        casinoObj.welcomeBonus.maxWithdrawal = matchingBanner.withdraw;
      }
      if (matchingBanner.image) {
        casinoObj.welcomeBonus.image = matchingBanner.image;
      }
      if (matchingBanner.link) {
        casinoObj.welcomeBonus.url = matchingBanner.link;
      }
    }

    res.json({ success: true, data: casinoObj });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── Custom Banners Routes (merging Casino welcome bonus details and SiteSettings tagline) ───
router.get('/banners', async (req, res) => {
  try {
    const filters = {};
    const allowedFilters = ['countryGroup', 'placement', 'siteKey'];
    for (const key of allowedFilters) {
      if (req.query[key] !== undefined && req.query[key] !== '') {
        filters[key] = req.query[key];
      }
    }
    filters.status = 'published';

    const banners = await Banner.find(filters).sort({ sortOrder: 1, createdAt: -1 });
    const casinos = await Casino.find({});
    const siteSettingsList = await SiteSettings.find({});

    const mergedBanners = banners.map(b => {
      const bannerObj = b.toObject ? b.toObject() : b;
      
      const casino = casinos.find(c => 
        (b.siteKey && c.siteKey === b.siteKey) ||
        (!b.siteKey && b.ownerId && c.ownerId && c.ownerId.toString() === b.ownerId.toString())
      );
      
      const settings = siteSettingsList.find(s =>
        (b.siteKey && s.siteKey === b.siteKey) ||
        (!b.siteKey && b.ownerId && s.ownerId && s.ownerId.toString() === b.ownerId.toString())
      );

      if (casino) {
        if (casino.welcomeBonus) {
          if (casino.welcomeBonus.title) bannerObj.title = casino.welcomeBonus.title;
          if (casino.welcomeBonus.subTitle) bannerObj.subtitle = casino.welcomeBonus.subTitle;
          if (casino.welcomeBonus.deposit !== undefined && casino.welcomeBonus.deposit !== null) {
            bannerObj.deposit = casino.welcomeBonus.deposit;
          }
          if (casino.welcomeBonus.bonus !== undefined && casino.welcomeBonus.bonus !== null) {
            bannerObj.bonus = casino.welcomeBonus.bonus;
          }
          if (casino.welcomeBonus.turnover !== undefined && casino.welcomeBonus.turnover !== null) {
            bannerObj.turnover = casino.welcomeBonus.turnover;
          }
          if (casino.welcomeBonus.maxWithdrawal !== undefined && casino.welcomeBonus.maxWithdrawal !== null) {
            bannerObj.withdraw = casino.welcomeBonus.maxWithdrawal;
          }
          if (casino.welcomeBonus.image) {
            bannerObj.image = casino.welcomeBonus.image;
          }
          if (casino.welcomeBonus.url) {
            bannerObj.link = casino.welcomeBonus.url;
          }
        }
      }

      if (settings) {
        if (settings.tagline) bannerObj.title = settings.tagline;
        if (settings.logoUrl && !bannerObj.image) bannerObj.image = settings.logoUrl;
        if (settings.playNowUrl) bannerObj.link = settings.playNowUrl;
      }

      if (bannerObj.deposit !== undefined && bannerObj.bonus !== undefined) {
        const depNum = Number(bannerObj.deposit) || 0;
        const bonNum = Number(bannerObj.bonus) || 0;
        bannerObj.getAmount = String(depNum + bonNum);
      }

      return bannerObj;
    });

    res.json({ success: true, count: mergedBanners.length, data: mergedBanners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/banners/:id', async (req, res) => {
  try {
    const banner = await Banner.findOne({ _id: req.params.id, status: 'published' });
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });

    const bannerObj = banner.toObject ? banner.toObject() : banner;

    const casino = await Casino.findOne({
      $or: [
        { siteKey: bannerObj.siteKey },
        { ownerId: bannerObj.ownerId }
      ]
    });

    const settings = await SiteSettings.findOne({
      $or: [
        { siteKey: bannerObj.siteKey },
        { ownerId: bannerObj.ownerId }
      ]
    });

    if (casino) {
      if (casino.welcomeBonus) {
        if (casino.welcomeBonus.title) bannerObj.title = casino.welcomeBonus.title;
        if (casino.welcomeBonus.subTitle) bannerObj.subtitle = casino.welcomeBonus.subTitle;
        if (casino.welcomeBonus.deposit !== undefined && casino.welcomeBonus.deposit !== null) {
          bannerObj.deposit = casino.welcomeBonus.deposit;
        }
        if (casino.welcomeBonus.bonus !== undefined && casino.welcomeBonus.bonus !== null) {
          bannerObj.bonus = casino.welcomeBonus.bonus;
        }
        if (casino.welcomeBonus.turnover !== undefined && casino.welcomeBonus.turnover !== null) {
          bannerObj.turnover = casino.welcomeBonus.turnover;
        }
        if (casino.welcomeBonus.maxWithdrawal !== undefined && casino.welcomeBonus.maxWithdrawal !== null) {
          bannerObj.withdraw = casino.welcomeBonus.maxWithdrawal;
        }
        if (casino.welcomeBonus.image) {
          bannerObj.image = casino.welcomeBonus.image;
        }
        if (casino.welcomeBonus.url) {
          bannerObj.link = casino.welcomeBonus.url;
        }
      }
    }

    if (settings) {
      if (settings.tagline) bannerObj.title = settings.tagline;
      if (settings.logoUrl && !bannerObj.image) bannerObj.image = settings.logoUrl;
      if (settings.playNowUrl) bannerObj.link = settings.playNowUrl;
    }

    if (bannerObj.deposit !== undefined && bannerObj.bonus !== undefined) {
      const depNum = Number(bannerObj.deposit) || 0;
      const bonNum = Number(bannerObj.bonus) || 0;
      bannerObj.getAmount = String(depNum + bonNum);
    }

    res.json({ success: true, data: bannerObj });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── All other public resources (generic loop, unchanged) ────────────────────
const publicResources = [
  { path: 'site-settings',  Model: SiteSettings,        name: 'Site settings',       filters: ['ownerId', 'siteKey'] },
  { path: 'promotions',     Model: Promotion,           name: 'Promotion',           filters: ['countryGroup', 'casino', 'siteKey'] },
  { path: 'games',          Model: GameList,            name: 'Game',                filters: ['countryGroup', 'gameType', 'featured'] },
  { path: 'content',        Model: Content,             name: 'Content',             filters: ['countryGroup', 'type', 'slug'] },
  { path: 'availability',   Model: CasinoAvailability,  name: 'Casino availability', filters: ['code'] },
  { path: 'game-types',     Model: GameTypeConfig,      name: 'Game type config',    filters: ['key'] },
  { path: 'countries',      Model: Country,             name: 'Country',             filters: ['code', 'status'] },
  { path: 'navigation',     Model: NavItem,             name: 'Navigation item',     filters: ['countryGroup', 'key', 'siteKey'] },
  { path: 'big-wins',       Model: BigWin,              name: 'Big win',             filters: ['countryGroup', 'siteKey'] },
  { path: 'popular-games',  Model: PopularGame,         name: 'Popular game',        filters: ['countryGroup', 'siteKey'] },
];

router.get('/homepage', getHomepage);

for (const { path, Model, name, filters } of publicResources) {
  const handlers = createCrudHandlers(Model, {
    resourceName: name,
    filterable: filters,
    publishedFilter: published,
    defaultSort: { sortOrder: 1, createdAt: -1 },
  });

  router.get(`/${path}`, handlers.getAll);
  router.get(`/${path}/:id`, handlers.getById);
}

export default router;