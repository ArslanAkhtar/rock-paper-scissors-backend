"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../utils/constants");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const pubsub = new graphql_subscriptions_1.PubSub();
const resolvers = {
    Query: {
        currentNumberArray() {
            return constants_1.currentNumberArray;
        },
    },
    Subscription: {
        numberIncremented: {
            subscribe: () => pubsub.asyncIterator(["NUMBER_INCREMENTED"]),
        },
    },
};
exports.default = resolvers;
//# sourceMappingURL=resolvers.js.map