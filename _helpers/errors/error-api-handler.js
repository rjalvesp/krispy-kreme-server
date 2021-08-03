const R = require("ramda");

const ERRORS = require("./errors");

/*
  error notation: ${Module}.${FolderType}.${FoundInSequence}
  tag: Label used by frontend i18n system
  httpCode: HTTP based code for response.
*/

const maybeAssignTag = (tag) => (topicError) =>
  R.ifElse(
    Boolean,
    (forcedTag) => R.assoc("tag", forcedTag, topicError),
    R.always(topicError)
  )(tag);

const throwError = ({ error, context, tag, errorCode }) => {
  console.error(errorCode, context, error);
  return R.pipe(
    R.path(errorCode.split(".")),
    R.assoc("description", error.message || error.description || error),
    maybeAssignTag(tag)
  )(ERRORS);
};

const getHttpCode = (err, httpCode) =>
  R.unless(R.is(Number), R.always(err.httpCode), httpCode);

module.exports = (req, res, next) => {
  res.handleError = (httpCode) => (error) =>
    R.pipe(
      throwError,
      res.type("application/json").status(getHttpCode(err, httpCode)).json(err)
    )(error);
  next();
};
