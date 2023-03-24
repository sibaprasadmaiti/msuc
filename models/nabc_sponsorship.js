/* jshint indent: 2 */
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "sponsorship",
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      storeId: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
      },
      sponsorship_category: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      sponsorship_type: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      slag: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      f_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      l_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      primary_phone: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      organization_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      address_one: {
        type: DataTypes.STRING(256),
        allowNull: true,
      },
      address_two: {
        type: DataTypes.STRING(256),
        allowNull: true,
      },
      street: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      zip: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      registered_adult_no: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
      },
      adult_information_json: {
        type: DataTypes.STRING(256),
        allowNull: true,
      },
      registered_child_no: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
      },
      child_information_json: {
        type: DataTypes.STRING(256),
        allowNull: true,
      },
      spouse_f_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      spouse_l_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      check_in_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      check_out_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      no_of_night: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
      },
      no_of_room: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
      },
      room_preference: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      term_condition: {
        type: DataTypes.ENUM("Y", "N"),
        allowNull: true,
      },
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      updatedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "sponsorship",
      comment: "sponsorship Table",
    }
  );
};