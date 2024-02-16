import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import quotesRoutes from './routes/api/quotes.js';

const port = process.env.PORT || 3001;
const app = express();
app.use(express.json());
app.use(cors({ methods: 'GET, POST, PATCH, DELETE' }));

app.use('/api/quotes', quotesRoutes);

app.listen(port, () => {
  console.log(`Server is running on port: http://localhost:${port}`);
});
