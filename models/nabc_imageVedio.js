/* jshint indent: 2 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
      "image_vedio",
      {
        id: {
          type: DataTypes.INTEGER(11),
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        relatedId: {
            type: DataTypes.INTEGER(10),
            allowNull: true,
        },
        image_video_url: {
           type: DataTypes.STRING(255),
           allowNull: true,
         },
         image_type: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        status: {
          type: DataTypes.ENUM("upcoming","active","delayed","archive"),
          allowNull: true,
        },
        table_name: {
         type: DataTypes.STRING(255),
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
        tableName: "image_vedio",
        comment:"image_vedio Table",
      }
    );
  };