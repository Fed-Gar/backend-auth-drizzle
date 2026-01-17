import 'dotenv/config';
import express from 'express';
import routes from './routes';
import { errorHandler } from '../middlewares/error';

const app = express();
app.use(express.json());
app.use(routes);
app.use(errorHandler);

const port = Number(process.env.PORT) || 3002;

app.listen(port, () => console.log(`AUTH listening on ${port}`));
