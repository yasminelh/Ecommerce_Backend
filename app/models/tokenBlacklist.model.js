module.exports = (sequelize, Datatypes) => {
  const TokenBlackList = sequelize.define("TokenBlackLists", {
    token: {
      type: Datatypes.STRING,
      allowNull:false
    },
  });

  return TokenBlackList;
};
