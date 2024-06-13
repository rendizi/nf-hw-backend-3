import 'dotenv/config';
import express from 'express';
import { logger } from './logger';
import fetchDevPosts, {StructuredData} from "./fetch";
import cron from "node-cron";
import {AnalysisResult, analyzeData} from "./analyze";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(logger);
app.use(express.json());

let data: AnalysisResult;
let fetchData: StructuredData[]

cron.schedule('0 */6 * * *', async () => {
  console.log('Running fetchData every 6 hours');
  try {
    const newData = await fetchDevPosts();
    data = analyzeData(newData);
    fetchData = newData
  } catch (error) {
    console.error('Error fetching data via cron job:', error);
  }
});

app.get('/devto/data', (req, res) => {
  res.status(200).json(fetchData);
});

app.get('/devto/analyze', (req, res) => {
    res.status(200).json(data);
});

app.listen(PORT, () => {
  fetchDevPosts()
      .then(posts => {
        data = analyzeData(posts);
        fetchData = posts
      })
      .catch(error => {
        console.error('Error fetching data on server start:', error);
      });
  console.log(`Server runs at http://localhost:${PORT}`);
});
