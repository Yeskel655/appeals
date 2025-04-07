import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { registerAppealRoutes } from './routes/appealRoutes.js';
import { registerAppealTopicRoutes } from './routes/appelTopicRoutes.js';
import { registerAppealStatusRoutes } from './routes/appealStatus.js';

const app = express();

app.use(cors({
  origin: 'http://127.0.0.1:5173'
}));

app.use(bodyParser.json());


registerAppealRoutes(app);
registerAppealTopicRoutes(app);
registerAppealStatusRoutes(app);


  

app.listen(3001, () => console.log('Server started on http://localhost:3001'));