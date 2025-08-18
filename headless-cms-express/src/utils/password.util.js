const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

module.exports = {
  hashPassword: async (plainPassword) => {
    return await bcrypt.hash(plainPassword, SALT_ROUNDS);
  },

  comparePassword: async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
};
