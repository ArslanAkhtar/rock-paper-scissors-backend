import express from "express";
import cors from "cors";
import compression from "compression";
import bodyParser from "body-parser";

import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/typeDefs";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

import { createServer } from "http";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

const app = express();
app.use(cors());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const httpServer = createServer(app);

const schema = makeExecutableSchema({ typeDefs, resolvers });

// Creating the WebSocket server
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

// Hand in the schema we just created and have the
// WebSocketServer start listening.
const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
  schema,
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            console.log("Server starting up!");
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

const PORT = 4000;

const startServer = async () => {
  try {
    await server.start();
    app.use(
      "/graphql",
      cors<cors.CorsRequest>(),
      bodyParser.json(),
      expressMiddleware(server)
    );

    const PORT = 4000;
    // Now that our HTTP server is fully set up, we can listen to it.
    httpServer.listen(PORT, () => {
      console.log(`Server is now running on http://localhost:${PORT}/graphql`);
      console.log(
        `🚀 Subscription endpoint ready at ws://localhost:${PORT}/graphql`
      );
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
