const getDefaultError = (err) => ({
  status: err.code === "ECONNREFUSED" ? 502 : 400,
  body: `ERROR ${err.message}`,
});

const throwEntityNotFound = (entity, id) => () => {
  throw { body: `${entity} ${id} not found`, status: 404, custom: true };
};

module.exports = {
  getDefaultError,
  throwEntityNotFound,
};
