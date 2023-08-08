import express from "express";
import http from "http";
import cors from "cors";
import compression from "compression";
import bodyParser from "body-parser";
// import router from "./router/router";

import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/typeDefs";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

const app = express();
app.use(cors());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

interface MyContext {
  token?: string;
}
//app.use("/", router);

const httpServer = http.createServer(app);
const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

const startServer = async () => {
  await server.start();

  app.use(
    "/",
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 3000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:3000/`);
};

startServer();
