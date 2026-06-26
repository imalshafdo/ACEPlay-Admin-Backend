import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';
import { protect } from './middleware/authMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import casinoRoutes from './routes/casinoRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';
import promotionRoutes from './routes/promotionRoutes.js';
import gameListRoutes from './routes/gameListRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import countryRoutes from './routes/countryRoutes.js';
import availabilityRoutes from './routes/availabilityRoutes.js';
import gameTypeConfigRoutes from './routes/gameTypeConfigRoutes.js';
import siteSettingsRoutes from './routes/siteSettingsRoutes.js';
import navItemRoutes from './routes/navItemRoutes.js';
import bigWinRoutes from './routes/bigWinRoutes.js';
import popularGameRoutes from './routes/popularGameRoutes.js';
import adminRoutes from './routes/admin.js';
import publicRoutes from './routes/publicRoutes.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'ACEPlay Admin API is running',
    auth: '/api/auth',
    admin: '/api/admin',
    public: '/api/public',
  });
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);

const adminRouter = express.Router();
adminRouter.use(protect);
adminRouter.use('/site-settings', siteSettingsRoutes);
adminRouter.use('/navigation', navItemRoutes);
adminRouter.use('/big-wins', bigWinRoutes);
adminRouter.use('/popular-games', popularGameRoutes);
adminRouter.use('/casinos', casinoRoutes);
adminRouter.use('/banners', bannerRoutes);
adminRouter.use('/promotions', promotionRoutes);
adminRouter.use('/games', gameListRoutes);
adminRouter.use('/content', contentRoutes);
adminRouter.use('/countries', countryRoutes);
adminRouter.use('/availability', availabilityRoutes);
adminRouter.use('/game-types', gameTypeConfigRoutes);
adminRouter.use(adminRoutes);

app.use('/api/admin', adminRouter);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`ACEPlay Admin API running at http://localhost:${PORT}`);
  console.log("🚨 CODE UPDATE VERIFIED AT:", new Date().toLocaleTimeString());
});
