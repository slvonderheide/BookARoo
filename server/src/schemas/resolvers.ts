import { User } from '../models/index.js';
import { signToken, AuthenticationError } from '../services/auth.js';

// Argument types
interface SaveBookArgs {
  input: {
    bookId: string;
    authors: string[];
    description: string;
    title: string;
    image: string;
    link: string;
  };
}

interface DeleteBookArgs {
  bookId: string;
}

interface AddUserArgs {
  input: {
    username: string;
    email: string;
    password: string;
  };
}

interface LoginUserArgs {
  email: string;
  password: string;
}

const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: any) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError('Could not authenticate user.');
    },
  },

  Mutation: {
    addUser: async (_parent: any, { input }: AddUserArgs) => {
      const user = await User.create({ ...input });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    login: async (_parent: any, { email, password }: LoginUserArgs) => {
      const user = await User.findOne({ email });

      if (!user || !(await user.isCorrectPassword(password))) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user.username, user.email, user._id );
      return { token, user };
    },

    saveBook: async (_parent: any, { input }: SaveBookArgs, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('User not authenticated.');
      }

      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        {
          $addToSet: { savedBooks: input },
        },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        throw new Error('Could not save book.');
      }

      return updatedUser;
    },

    deleteBook: async (_parent: any, { bookId }: DeleteBookArgs, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('User not authenticated.');
      }

      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        {
          $pull: { savedBooks: { bookId } },
        },
        { new: true }
      );

      if (!updatedUser) {
        throw new Error('Could not delete book.');
      }

      return updatedUser;
    },
  },
};

export default resolvers;
