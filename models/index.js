'use strict';
var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.json')[env];
var db        = {};
if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}
fs.readdirSync(__dirname).filter(function(file) {
  return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
}).forEach(function(file) {
  var model = sequelize['import'](path.join(__dirname, file));
  db[model.name] = model;
});
Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;
/*Associate Start*/
/*Associate Relation with admin and Store*/
db.stores.hasMany(db.admins);

db.admins.belongsTo(db.stores);
/*Associate Relation with Category and Store*/
db.stores.hasMany(db.categories);
db.categories.belongsTo(db.stores);

/*Associate Relation with Role and Store*/
db.stores.hasMany(db.roles);
db.roles.belongsTo(db.stores);

/*Associate Relation with Users and Store*/
db.stores.hasMany(db.users);
db.users.belongsTo(db.stores);
/*Associate Relation with Site Setting and Store*/
db.stores.hasMany(db.siteSettings);
db.siteSettings.belongsTo(db.stores);
/*Associate Relation with site Setting  and site Setting Group */
db.siteSettingsGroups.hasMany(db.siteSettings);
db.siteSettings.belongsTo(db.siteSettingsGroups);
/*Associate Relation with site Setting Group and Store*/
db.stores.hasMany(db.siteSettingsGroups);
db.siteSettingsGroups.belongsTo(db.stores);
db.stores.hasMany(db.pages);
db.pages.belongsTo(db.stores);
/*Associate Relation with Brand and Store*/
db.stores.hasMany(db.brands);
db.brands.belongsTo(db.stores);
/*Associate Relation with Brand Iso Image and Store*/
db.stores.hasMany(db.brandsIsoImage);
db.brandsIsoImage.belongsTo(db.stores);
/*Associate Relation with Brand Iso Image and Brand*/
db.brands.hasMany(db.brandsIsoImage);
db.brandsIsoImage.belongsTo(db.brands);

/*Associate Relation with Role and Store*/
db.roles.belongsTo(db.stores, { foreignKey: 'storeId', targetKey: 'id', onDelete: 'cascade' });
//*****Permission Table
db.permissions.belongsTo(db.stores, { foreignKey: 'storeId', targetKey: 'id', onDelete: 'cascade' });
//*****Role Has Permissions Table
db.roleHasPermissions.belongsTo(db.stores, { foreignKey: 'storeId', targetKey: 'id', onDelete: 'cascade' });
db.roleHasPermissions.belongsTo(db.permissions, { foreignKey: 'permissionId', targetKey: 'id', onDelete: 'cascade' });
db.roleHasPermissions.belongsTo(db.roles, { foreignKey: 'roleId', targetKey: 'id', onDelete: 'cascade' });
//*****Model Has Roles Table
db.modelHasRoles.belongsTo(db.stores, { foreignKey: 'storeId', targetKey: 'id', onDelete: 'cascade' });
db.modelHasRoles.belongsTo(db.roles, { foreignKey: 'roleId', targetKey: 'id', onDelete: 'cascade' });
db.modelHasRoles.belongsTo(db.admins, { foreignKey: 'userId', targetKey: 'id', onDelete: 'cascade' });
//***/
db.admins.belongsTo(db.admins, { foreignKey: 'parentId', targetKey: 'id', onDelete: 'cascade' });

/*Associate Relation with CMS and Store*/
db.stores.hasMany(db.cms, { foreignKey: 'storeId', onDelete: 'cascade' });

/*Associate Relation with BannerSection and Store*/
db.stores.hasMany(db.bannersection, { foreignKey: 'storeId', onDelete: 'cascade' });

/*Associate Relation with BannerDisplay and Store*/
db.stores.hasMany(db.bannerdisplay, { foreignKey: 'storeId', onDelete: 'cascade' });

/*Associate Relation with Banner and Store*/
db.stores.hasMany(db.banner, { foreignKey: 'storeId', onDelete: 'cascade' });


db.stores.hasMany(db.permissionLog, { foreignKey: 'storeId', onDelete: 'cascade' });
db.permissionGroup.hasMany(db.permissionLog, { foreignKey: 'permissionGroupId', onDelete: 'cascade' });
db.stores.hasMany(db.imageResize, { foreignKey: 'storeId', onDelete: 'cascade' });
db.stores.hasMany(db.razorpay, { foreignKey: 'storeId', onDelete: 'cascade' });
db.chatUsers.hasMany(db.chatMessages, { foreignKey: 'chatUserId' })
db.chatMessages.belongsTo(db.chatUsers, { foreignKey: 'id' })
/*Associate End*/

///////////////////*********** Nabc models start */
db.stores.hasMany(db.eventCategory, { foreignKey: 'storeId', onDelete: 'cascade', onUpdate: 'cascade' });
db.stores.hasMany(db.event, { foreignKey: 'storeId', onDelete: 'cascade', onUpdate: 'cascade' });
//db.eventCategory.belongsTo(db.event, { foreignKey: 'eventCategoryId', onDelete: 'cascade', onUpdate: 'cascade' });
//db.event.hasMany(db.eventCategory, { foreignKey: 'eventCategoryId', onDelete: 'cascade', onUpdate: 'cascade' });

module.exports = db;
