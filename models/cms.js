/* jshint indent: 2 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
      "cms",
      {
        id: {
          type: DataTypes.INTEGER(10),
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        storeId: {
         type: DataTypes.INTEGER(10),
         allowNull: true,
        },
        menuId: {
          type: DataTypes.INTEGER(10),
          allowNull: true,
         },
        title:{
          type: DataTypes.TEXT,
          allowNull: true,
        },
        slug:{
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        content:{
          type: DataTypes.TEXT,
          allowNull: true,
        },
        shortDescription:{
          type: DataTypes.TEXT,
          allowNull: true,
        },
        status: {
          type: DataTypes.ENUM("Yes","No"),
          allowNull: true,
        },
        vedioLink:{
          type: DataTypes.TEXT,
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
        tableName: "cms",
        comment:"CMS Table",
      }
    );
  };