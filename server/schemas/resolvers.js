const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (_, _, { user }) => {
      if (user) {
        return await User.findOne({ _id: user._id }).select('-__v -password');
      }
      throw new AuthenticationError('Not logged in');
    },
  },
  Mutation: {
    addUser: async (_, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { user, token };
    },
    login: async (_, { email, password }) => {
      const user = User.findOne({ email });

      if (!user) throw new AuthenticationError('Email not found');

      const correctPw = await user.isCorrectPassword(password)
    },
  },
};
