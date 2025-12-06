
import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { graphqlHTTP } from 'express-graphql';

import authRoutes from './routes/authRoutes';
import propertyRoutes from './routes/propertyRoutes';
import uploadRoutes from './routes/uploadRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import apiRoutes from './routes/apiRoutes'; // Legacy REST
import { schema } from './graphql/schema';
import { rootValue } from './graphql/resolvers';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ultrareal_crm';

// --- WebSocket Setup ---
const wss = new WebSocketServer({ server, path: '/ws/notifications' });

wss.on('connection', (ws: WebSocket) => {
  console.log('🔌 Client connected to WebSocket');
  ws.send(JSON.stringify({ type: 'CONNECTED', message: 'Real-time updates active' }));
});

export const broadcastNotification = (data: any) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// --- Middleware ---
// Allow all origins for demo purposes to prevent CORS issues in cloud IDEs
app.use(cors() as any);
app.use(express.json() as any);
app.use(cookieParser() as any);

// --- GraphQL ---
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: rootValue,
  graphiql: true, // Enable GraphiQL UI
}) as any);

// --- Routes ---
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/health', (req, res) => { res.send('OK'); });

// --- DB & Server Start ---
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    console.log('⚠️ Starting server in SQL-Mock-Only mode...');
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  });

export default app;
