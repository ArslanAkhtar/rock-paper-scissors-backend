"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const body_parser_1 = __importDefault(require("body-parser"));
const resolvers_1 = __importDefault(require("./graphql/resolvers"));
const typeDefs_1 = __importDefault(require("./graphql/typeDefs"));
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const http_1 = require("http");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const schema_1 = require("@graphql-tools/schema");
const ws_1 = require("ws");
const ws_2 = require("graphql-ws/lib/use/ws");
const constants_1 = require("./utils/constants");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const pubsub = new graphql_subscriptions_1.PubSub();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, compression_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
const httpServer = (0, http_1.createServer)(app);
const schema = (0, schema_1.makeExecutableSchema)({ typeDefs: typeDefs_1.default, resolvers: resolvers_1.default });
// Creating the WebSocket server
const wsServer = new ws_1.WebSocketServer({
    server: httpServer,
    path: "/graphql",
});
// Hand in the schema we just created and have the
// WebSocketServer start listening.
const serverCleanup = (0, ws_2.useServer)({ schema }, wsServer);
const server = new server_1.ApolloServer({
    schema,
    plugins: [
        // Proper shutdown for the HTTP server.
        (0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
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
    await server.start();
    app.use("/graphql", (0, cors_1.default)(), body_parser_1.default.json(), (0, express4_1.expressMiddleware)(server));
    const PORT = 4000;
    // Now that our HTTP server is fully set up, we can listen to it.
    httpServer.listen(PORT, () => {
        console.log(`Server is now running on http://localhost:${PORT}/graphql`);
        console.log(`🚀 Subscription endpoint ready at ws://localhost:${PORT}/graphql`);
    });
};
startServer();
function incrementNumber() {
    constants_1.currentNumberArray.push(1);
    pubsub.publish("NUMBER_INCREMENTED", {
        numberIncremented: constants_1.currentNumberArray,
    });
    setTimeout(incrementNumber, 1000);
}
//incrementNumber();
//# sourceMappingURL=app.js.map