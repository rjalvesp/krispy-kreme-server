const { datatype } = require("faker");

const getRandomArrayElement = (collection) =>
  collection[datatype.number({ min: 0, max: collection.length - 1 })];

const getReference = () =>
  [...Array(8)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");

module.exports = {
  getRandomArrayElement,
  getReference,
};
