/* jshint indent: 2 */
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "eventCategory",
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
      categoryType:{
        type: DataTypes.ENUM("parent","child"),
        allowNull: true,
      },
      parent_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      slag: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      categoryName: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      sequence: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("active", "inactive", "archive"),
        allowNull: true,
      },
      category_type: {
        type: DataTypes.ENUM("event", "registration", "schedule"),
        allowNull: false,
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
      tableName: "eventCategory",
      comment: "eventCategory Table",
    }
  );
};