
import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { createHandler } from 'graphql-http/lib/use/express';

import propertyRoutes from './routes/propertyRoutes';
import uploadRoutes from './routes/uploadRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import apiRoutes from './routes/apiRoutes'; // Legacy REST
import schema from './graphql/schema/index';
import { rootValue } from './graphql/resolvers/index';
import { verifyAccessToken } from './utils/jwt';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

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

// Attach user from Authorization bearer token (for GraphQL context)
app.use('/graphql', (req: any, _res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      req.user = verifyAccessToken(token);
    } catch (err) {
      // ignore invalid token; resolvers will reject if unauthenticated
    }
  }
  next();
});

// --- GraphQL ---
// Serve GraphiQL UI on GET requests
app.get('/graphql', (req, res) => {
  res.type('html');
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>GraphiQL - RealLex API</title>
  <link rel="stylesheet" href="https://unpkg.com/graphiql@3.0.10/graphiql.min.css" />
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/graphiql@3.0.10/graphiql.min.js"></script>
  <style>
    body { margin: 0; height: 100vh; overflow: hidden; }
    #graphiql { height: 100vh; }
  </style>
</head>
<body>
  <div id="graphiql">Loading...</div>
  <script>
    const fetcher = GraphiQL.createFetcher({ url: '/graphql' });
    const root = ReactDOM.createRoot(document.getElementById('graphiql'));
    root.render(
      React.createElement(GraphiQL, { fetcher: fetcher })
    );
  </script>
</body>
</html>
  `);
});

// Handle GraphQL POST requests
app.post('/graphql', (async (req: any, res: any, next) => {
  console.log('🔐 GraphQL request received');
  
  // Extract and verify token
  const headerAuth = req.headers?.authorization || req.headers?.Authorization;
  
  console.log('📍 GraphQL request authorization:', { 
    hasAuth: !!headerAuth,
    method: req.method,
    headers: Object.keys(req.headers || {})
  });
  
  let user = req.user;

  // Fallback decode in case middleware did not attach user
  if (!user && typeof headerAuth === 'string') {
    const match = headerAuth.match(/^Bearer\s+(.*)$/i);
    if (match?.[1]) {
      try {
        user = verifyAccessToken(match[1]);
        console.log('✅ GraphQL: User authenticated from Bearer token:', { userId: user?.userId, role: user?.role });
      } catch (err) {
        console.error('❌ GraphQL: Failed to verify token:', err instanceof Error ? err.message : err);
      }
    } else {
      console.warn('⚠️ GraphQL: No Bearer token found in Authorization header');
    }
  } else if (user) {
    console.log('✅ GraphQL: User already attached from middleware:', { userId: user?.userId, role: user?.role });
  } else {
    console.warn('⚠️ GraphQL: No authorization header or user found');
  }

  const userId = (user as any)?.userId || null;
  const vendorId = (user as any)?.vendorId || null;
  
  console.log('✅ GraphQL context prepared:', { user: !!user, userId, vendorId, userRole: user?.role });
  
  // Add subscription to context
  const { addSubscriptionToContext } = await import('./middleware/subscription');
  const baseContext = { user, userId, vendorId, req };
  const context = await addSubscriptionToContext(baseContext);
  
  // Use createHandler with inline context
  return createHandler({
    schema: schema,
    rootValue: rootValue,
    context: () => context
  })(req, res, next);
}) as any);

// --- Routes ---
// app.use('/api', apiRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/analytics', analyticsRoutes);
app.get('/health', (req, res) => { res.send('OK'); });

// --- DB & Server Start ---
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    server.listen(PORT, () => {
      console.log('\n🚀 Server is running!\n');
      console.log('📍 Endpoints:');
      console.log(`   Health Check:  http://localhost:${PORT}/health`);
      console.log(`   GraphQL API:   http://localhost:${PORT}/graphql`);
      console.log(`   REST API:      http://localhost:${PORT}/api`);
      console.log(`   WebSocket:     ws://localhost:${PORT}/ws/notifications\n`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    console.log('⚠️ Starting server in SQL-Mock-Only mode...');
    server.listen(PORT, () => {
      console.log('\n🚀 Server is running (Mock Mode)!\n');
      console.log('📍 Endpoints:');
      console.log(`   Health Check:  http://localhost:${PORT}/health`);
      console.log(`   GraphQL API:   http://localhost:${PORT}/graphql`);
      console.log(`   REST API:      http://localhost:${PORT}/api`);
      console.log(`   WebSocket:     ws://localhost:${PORT}/ws/notifications\n`);
    });
  });

export default app;
