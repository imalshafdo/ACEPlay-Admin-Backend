import SiteSettings from '../models/SiteSettings.js';
import NavItem from '../models/NavItem.js';
import Banner from '../models/Banner.js';
import BigWin from '../models/BigWin.js';
import PopularGame from '../models/PopularGame.js';
import Promotion from '../models/Promotion.js';
import asyncHandler from '../utils/asyncHandler.js';

const published = { status: 'published' };
const sort = { sortOrder: 1, createdAt: -1 };

export const getHomepage = asyncHandler(async (req, res) => {
  const { countryGroup } = req.query;
  const countryFilter = countryGroup ? { countryGroup } : {};

  const [
    siteSettings,
    navigation,
    heroBanners,
    bigWins,
    popularGames,
    exclusivePromotions,
    exclusiveBanners,
  ] = await Promise.all([
    SiteSettings.findOne({ ...published, siteKey: 'default' }),
    NavItem.find({ ...published, ...countryFilter }).sort(sort),
    Banner.find({ ...published, placement: 'hero', ...countryFilter }).sort(sort),
    BigWin.find({ ...published, ...countryFilter }).sort(sort),
    PopularGame.find({ ...published, ...countryFilter }).sort(sort),
    Promotion.find({ ...published, ...countryFilter }).sort(sort),
    Banner.find({ ...published, placement: 'exclusive', ...countryFilter }).sort(sort),
  ]);

  res.json({
    success: true,
    data: {
      siteSettings,
      navigation,
      heroBanners,
      bigWins,
      popularGames,
      exclusivePromotions,
      exclusiveBanners,
    },
  });
});
