"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeDefs = `#graphql
  type Query {
    currentNumberArray: [Int!]!
  }

  type Subscription {
    numberIncremented: [Int!]!
  }
`;
exports.default = typeDefs;
//# sourceMappingURL=typeDefs.js.map