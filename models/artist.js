module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        "artist",
        {
            id: {
                type: DataTypes.INTEGER(11),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            storeId: {
                type: DataTypes.INTEGER(11),
                allowNull: true,
            },
            slug: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            artistName: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            designation: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            image: {
                type: DataTypes.STRING(250),
                allowNull: true,
            },
            
            facebookLink: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            
            instaLink: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            
            twitterLink: {
                type: DataTypes.TEXT,
                allowNull: true,
            }, 
            linkedinLink: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
             whatsappLink: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            status: {
                type: DataTypes.ENUM('active','inactive'),
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
            tableName: "artist",
            comment: "artist Table",
        }
    );
};