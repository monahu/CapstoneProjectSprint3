const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");

const dateResolvers = {
    Date: new GraphQLScalarType({
        name: "Date",
        description: "Date custom scalar type",
        serialize(value) {
            // Send to client: Convert MongoDB Date to ISO string
            if (value instanceof Date) {
                return value.toISOString();
            }
            return value;
        },
        parseValue(value) {
            // Receive from client: Convert timestamp/string to Date
            return new Date(value);
        },
        parseLiteral(ast) {
            // Parse from GraphQL query literal
            if (ast.kind === Kind.INT) {
                return new Date(parseInt(ast.value, 10));
            }
            if (ast.kind === Kind.STRING) {
                return new Date(ast.value);
            }
            return null;
        },
    }),
};

module.exports = dateResolvers;
