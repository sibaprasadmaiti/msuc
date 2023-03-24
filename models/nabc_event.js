/* jshint indent: 2 */
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "event",
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
      eventCategoryId: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      slag: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      short_description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      event_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      time: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      ticket_number: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      event_type: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("upcoming", "active", "delayed", "archive"),
        allowNull: true,
      },
      banner: {
        type: DataTypes.ENUM("yes", "no"),
        allowNull: true,
      },
      homePage: {
        type: DataTypes.ENUM("yes", "no"),
        allowNull: true,
      },
      seat: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      capacity: {
        type: DataTypes.STRING(100),
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
      tableName: "event",
      comment: "event Table",
    }
  );
};