import { books } from "../utils/constants";
const resolvers = {
  Query: {
    books: () => books,
  },
};

export default resolvers;
