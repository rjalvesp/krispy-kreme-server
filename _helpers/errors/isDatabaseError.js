const R = require("ramda");

const errorData = {
  ECONNREFUSED: {
    ECONNREFUSED: {
      error: "NotDBConnections",
      errorCode: "DB.NO_CONNECTION",
    }
  },
  ArangoError: {
    "404": {
      error: "CollectionNotFound",
      errorCode: "DB.NOT_FOUND",
    },
  }
};

const process = (name, code) => R.pathOr(null, [name, code], errorData);

module.exports = ({ name, code }) => process(name, code);
