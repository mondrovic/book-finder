const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    /*
    Checks if context (authMiddlware) has .user data.
    If it does
      assign userData based on context.user._id
    If it doesn't
      throw an auth error telling user is not logged in
    */
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ id: context.user._id })
          .select("-__v -password")
          .populate("books");

        return userData;
      }

      throw new AuthenticationError("Not logged in");
    },
  },

  Mutation: {
    /*
      assigns user to a new User object created with passed in args
      signs the user's token then returns both token and user
    */
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },

    /*
      Checks if user's email exists and throws an auth error if it doesn't
      If email and password are correct
    */
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Invalid credentials. Please try again.");
      }

      const validPw = await user.isCorrectPassword(password);
      if (!validPw) {
        throw new AuthenticationError("Invalid credentials. Please try again.");
      }

      const token = signToken(user);
      return { token, user };
    },

    /*
      saveBook will check if context.user exists and if it does
        _id: set to context.user._id
        $addToSet instead of push so only unique entries can be added
        savedBooks: args.input because we're using an input typeDef
    */
    saveBook: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: args.input } },
          { new: true }
        );

        return user;
      }

      throw new AuthenticationError(
        "You need to be logged in to perform this action."
      );
    },

    /*
      remove book will check if context.user exists and if it does
        _id: set to context.user._id
        $pull will remove the item from savedBooks where bookId = args.bookId
    */
    removeBook: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: args.bookId } } },
          { new: true }
        );

        return user;
      }

      throw new AuthenticationError(
        "You need to be logged in to perform this action."
      );
    },
  },
};

module.exports = resolvers;
