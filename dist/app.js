"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const body_parser_1 = __importDefault(require("body-parser"));
// import router from "./router/router";
const resolvers_1 = __importDefault(require("./graphql/resolvers"));
const typeDefs_1 = __importDefault(require("./graphql/typeDefs"));
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, compression_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
//app.use("/", router);
const httpServer = http_1.default.createServer(app);
const server = new server_1.ApolloServer({
    typeDefs: typeDefs_1.default,
    resolvers: resolvers_1.default,
    plugins: [(0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer })],
});
const startServer = async () => {
    await server.start();
    app.use("/", (0, cors_1.default)(), body_parser_1.default.json(), (0, express4_1.expressMiddleware)(server, {
        context: async ({ req }) => ({ token: req.headers.token }),
    }));
    await new Promise((resolve) => httpServer.listen({ port: 3000 }, resolve));
    console.log(`🚀 Server ready at http://localhost:3000/`);
};
startServer();
//# sourceMappingURL=app.js.map