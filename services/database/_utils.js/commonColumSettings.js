const allowNull = true;

module.exports = {
  disallowNullString: {
    allowNull: false,
    defaultValue: "",
  },
  disallowNullNumber: {
    allowNull: false,
    defaultValue: 0,
  },
  allowNullNumber: {
    allowNull,
    defaultValue: 0,
  },
  allowNullString: {
    allowNull,
    defaultValue: "",
  },
};
