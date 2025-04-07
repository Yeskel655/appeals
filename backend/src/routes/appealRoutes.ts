import express, { Request, Response } from 'express';
import { appealToCancel, appealToCancelAllWork, appealToComplete, appealToWork, createAppeal, getAppealById, getAppeals } from '../models/appels.js';

const router = express.Router();

export function registerAppealRoutes(app: express.Application):void {
  app.use('/api/appeals', router);

  router.post('/', async (req: Request, res: Response) => {
    try {
      const { topicId, message } = req.body;

      const createdAppeal = await createAppeal({ topicId, message })

      res.json(createdAppeal);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при отпарвки обращения' });
    }

  });

  router.post('/:id/work', async (req: Request, res: Response) => {
    try {
      const id = Number(req.query.id);
      await appealToWork(id);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при переводе статуса обращения в статус "В работе"' });
    }

  });

  router.post('/:id/complete', async (req: Request, res: Response) => {
    try {
      const id = Number(req.query.id);
      const { resolution } = req.body;
      await appealToComplete(id, resolution)
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при переводе статуса обращения в статус "Завершено"' });
    }
  });

  router.post('/:id/cancel', async (req: Request, res: Response) => {
    try {
      const id = Number(req.query.id);
      const { reason } = req.body;
      await appealToCancel(id, reason)
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при переводе статуса обращения в статус "Отменено"' });
    }
  });

  router.get('/', async (req: Request, res: Response) => {
    try {
      const data = await getAppeals()
    res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при получении обращений' });
    }
  });

  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const id = Number(req.query.id);
      const data = await getAppealById(id)
    res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при получении обращений' });
    }
  });

  router.post('/cancel-all-in-progress', async (req: Request, res: Response) => {
    try {
      await appealToCancelAllWork();
    res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при отклонении всех обращений в статусе "В работе"' });
    }
  });
}