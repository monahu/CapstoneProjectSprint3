const postQueries = require("./postQueries");
const postMutations = require("./postMutations");
const postFieldResolvers = require("./postFieldResolvers");

const postResolvers = {
  Query: postQueries,
  Mutation: postMutations,
  Post: postFieldResolvers,
};
