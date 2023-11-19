const { production, developtment } = require("./src/postcss");

/**
 * Optimized config
 */
module.exports = (process.env.NODE_ENV === "production" && production) || developtment;
