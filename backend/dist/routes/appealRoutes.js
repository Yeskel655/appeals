import { appealToCancel, appealToCancelAllWork, appealToComplete, appealToWork, createAppeal, getAppeals } from '../models/appels.js';
export function registerAppealRoutes(app) {
    app.post('/appeals', async (req, res) => {
        const { topicId, message } = req.body;
        const createdAppeal = await createAppeal({ topicId, message });
        res.json(createdAppeal);
    });
    app.post('/appeals/:id/work', async (req, res) => {
        const id = Number(req.params.id);
        await appealToWork(id);
        res.sendStatus(200);
    });
    app.post('/appeals/:id/complete', async (req, res) => {
        const id = Number(req.params.id);
        const { resolution } = req.body;
        await appealToComplete(id, resolution);
        res.sendStatus(200);
    });
    app.post('/appeals/:id/cancel', async (req, res) => {
        const id = Number(req.params.id);
        const { reason } = req.body;
        await appealToCancel(id, reason);
        res.sendStatus(200);
    });
    app.get('/appeals', async (req, res) => {
        const data = await getAppeals();
        res.json(data);
    });
    app.post('/appeals/cancel-all-in-progress', async (req, res) => {
        await appealToCancelAllWork();
        res.sendStatus(200);
    });
}
