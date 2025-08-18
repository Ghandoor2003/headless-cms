const slugify = require('slugify');
const { customAlphabet } = require('nanoid');
const { v4: uuidv4 } = require('uuid');

// NanoID generator for short unique IDs
const nano = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 8);

module.exports = {
  /**
   * Generate URL-friendly slug from a string
   * @param {string} text
   * @returns {string} slug
   */
  generateSlug: (text) => {
    return slugify(text, { lower: true, strict: true });
  },

  /**
   * Generate a short random alphanumeric ID
   * @param {number} length
   * @returns {string} short ID
   */
  generateRandomId: (length = 8) => {
    return customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', length)();
  },

  /**
   * Generate a globally unique identifier (UUID v4)
   * @returns {string} uuid
   */
  generateUUID: () => {
    return uuidv4();
  },

  /**
   * Generate a collision-safe slug (optionally check DB)
   * @param {string} text
   * @param {function} existsFn - async function to check if slug exists in DB
   * @returns {string} unique slug
   */
  generateUniqueSlug: async (text, existsFn) => {
    let slug = slugify(text, { lower: true, strict: true });
    let attempt = 1;
    while (existsFn && await existsFn(slug)) {
      slug = `${slug}-${attempt}`;
      attempt++;
    }
    return slug;
  }
};
