const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, Datatypes) => {
  const Role = sequelize.define("roles", {
    role_id: {
      type: Datatypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
    },
    name: {
      type: Datatypes.STRING,
    },
  });

  return Role;
};
