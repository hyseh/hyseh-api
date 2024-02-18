import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';

import quotesRoutes from './routes/api/quotes.js';

const swaggerOptions = {
  definition: {
    info: {
      title: 'Hyseh API',
      version: '1.0.0',
    },
  },
  apis: ['./routes/api/*.js'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

const port = process.env.PORT || 3001;
const app = express();
app.use(express.json());
app.use(cors({ methods: 'GET, POST, PATCH, DELETE' }));

app.use('/api/quotes', quotesRoutes);
app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.listen(port, () => {
  console.log(`Server is running on port: http://localhost:${port}`);
});
