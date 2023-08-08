import { currentNumberArray } from "../utils/constants";
import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();
const resolvers = {
  Query: {
    currentNumberArray() {
      return currentNumberArray;
    },
  },
  Subscription: {
    numberIncremented: {
      subscribe: () => pubsub.asyncIterator(["NUMBER_INCREMENTED"]),
    },
  },
};

export default resolvers;
