import express from 'express';
import { getAppealStatues } from '../models/appealStatus.js';
const router = express.Router();
export function registerAppealStatusRoutes(app) {
    app.use('/api/appeal-status', router);
    router.get('/', async (req, res) => {
        try {
            const topics = await getAppealStatues();
            res.json(topics);
        }
        catch (error) {
            res.status(500).json({ error: 'Ошибка при получении тем обращений' });
        }
    });
}
