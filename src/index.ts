import 'dotenv/config';
import express from 'express';
import { logger } from './logger';
import fetchDevPosts, {StructuredData} from "./fetch";
import cron from "node-cron";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(logger);
app.use(express.json());

let data: StructuredData[] = [];

cron.schedule('*/5 * * * * *', async () => {
  console.log('Running fetchData every 5 seconds');
  try {
    const newData = await fetchDevPosts();
    data = newData;
  } catch (error) {
    console.error('Error fetching data via cron job:', error);
  }
});

app.get('/devto/data', (req, res) => {
  res.status(200).json(data);
});

app.listen(PORT, () => {
  fetchDevPosts()
      .then(posts => {
        data = posts;
      })
      .catch(error => {
        console.error('Error fetching data on server start:', error);
      });
  console.log(`Server runs at http://localhost:${PORT}`);
});
