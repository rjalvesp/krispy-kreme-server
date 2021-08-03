//LINKS 1
//TOPICS 2

const dbCommonsErrors = (number,  collectionName) => ({
  DB: {
    NOT_FOUND: {
      description: `System didn't found ${collectionName}`,
      errorCode: `${number}.1.1.1`,
      httpCode: 404,
      tag: "",
    },
    NO_CONNECTION: {
      description: "System was unable to reach database service",
      errorCode: `${number}.1.1.2`,
      httpCode: 500,
      tag: "",
    }
  },
});

module.exports = {
  LINKS: {
    ...dbCommonsErrors(1, "Link")
  },
  TOPICS: {
    ...dbCommonsErrors(2, "Topics")
  },
  UNKNOW: {
    ERROR: {
      description: "System failed in response",
      errorCode: "500.1.1.1",
      httpCode: 500,
      tag: "",
    }
  },
};
