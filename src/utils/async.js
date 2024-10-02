const { asyncify, mapLimit } = require('async');

const asyncMapLimit = async (items, limit, func) => mapLimit(items, limit, asyncify(async (item) => func(item)));

module.exports = {
  asyncMapLimit,
};
