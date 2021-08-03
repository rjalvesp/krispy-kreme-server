const R = require("ramda");

const calculatePage = ({ offset = 370, limit = 10 }) =>
  parseInt(offset / limit, 10) + 1;

const calculatePages = ({ limit = 10 }, { filteredTotal = 0, total = 0 }) => {
  if (!total) {
    return 1;
  }
  if (filteredTotal) {
    return parseInt(filteredTotal / limit, 10) + 1;
  }
  return parseInt((total || 1) / limit, 10) + 1;
};

module.exports = (query) => (value) =>
  R.pipe(
    (data) => R.assoc("page", calculatePage(query), data),
    (data) => R.assoc("pages", calculatePages(query, data), data)
  )(value);
