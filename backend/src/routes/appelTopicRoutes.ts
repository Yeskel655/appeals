import express, { Request, Response } from 'express';
import { getAppealTopics, createAppealTopic, updateAppealTopic, deleteAppealTopic } from '../models/appealTopic.js';

const router = express.Router();

export function registerAppealTopicRoutes(app: express.Application): void {
    app.use('/api/appeal-topics', router);

    router.get('/', async (req: Request, res: Response) => {
        try {
            const topics = await getAppealTopics();
            res.json(topics);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при получении тем обращений' });
        }
    });

    router.post('/', async (req: Request, res: Response) => {
        try {
            const topicData = req.body;
            const newTopic = await createAppealTopic(topicData);
            res.status(201).json(newTopic);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при создании темы обращения' });
        }
    });

    router.put('/:id', async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id, 10);
            const updateData = req.body;
            const updatedTopic = await updateAppealTopic(id, updateData);
            if (updatedTopic) {
                res.json(updatedTopic);
            } else {
                res.status(404).json({ error: 'Тема обращения не найдена' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при обновлении темы обращения' });
        }
    });

    router.delete('/:id', async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id, 10);
            const deletedTopic = await deleteAppealTopic(id);
            res.json(deletedTopic);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при удалении темы обращения' });
        }
    });
}
