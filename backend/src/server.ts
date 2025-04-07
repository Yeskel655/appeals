import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

import { registerAppealRoutes } from './routes/appealRoutes.js';
import { registerAppealTopicRoutes } from './routes/appelTopicRoutes.js';
import { registerAppealStatusRoutes } from './routes/appealStatus.js';
registerAppealRoutes(app);
registerAppealTopicRoutes(app);
registerAppealStatusRoutes(app);

app.listen(3001, () => console.log('Server started on http://localhost:3001'));