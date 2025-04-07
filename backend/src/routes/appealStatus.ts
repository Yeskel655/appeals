import express, { Request, Response } from 'express';
import { getAppealStatues } from '../models/appealStatus.js';

const router = express.Router();

export function registerAppealStatusRoutes(app: express.Application): void {
    app.use('/api/appeal-status', router);

    router.get('/', async (req: Request, res: Response) => {
        try {
            const topics = await getAppealStatues();
            res.json(topics);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при получении статусов обращений' });
        }
    });
}