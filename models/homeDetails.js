/* jshint indent: 2 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
      "homeDetails",
      {
        id: {
          type: DataTypes.INTEGER(11),
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        link:{
         type: DataTypes.STRING(255),
         allowNull: true,
        },
        firstNotice:{
         type: DataTypes.TEXT(),
         allowNull: true,
        },
        secondNotice:{
          type: DataTypes.TEXT(),
          allowNull: true,
         },         
        image:{
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        sneakPeek: {
          type: DataTypes.TEXT(),
          allowNull: true,
        },
        organizationPartner: {
          type: DataTypes.TEXT(),
          allowNull: true,
        },
        sequence:{
          type: DataTypes.INTEGER(10),
          allowNull: true,
        },
        status: {
          type: DataTypes.ENUM("Yes","No"),
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
        tableName: "homeDetails",
        comment:"homeDetails Table",
      }
    );
  };