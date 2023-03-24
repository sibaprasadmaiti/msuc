var express = require('express');
var router = express.Router();
var authController = require('../controllers/auth/authController');
var dashboardController = require('../controllers/admin/dashboardController');
var categoriesController = require('../controllers/admin/categoriesController');
var siteSettingsGroups = require('../controllers/admin/siteSettingGroupController');
var siteSettings = require('../controllers/admin/siteSettingController');
var pages = require('../controllers/admin/pagesController');
var brandsController = require('../controllers/admin/brandsController');
var rolesController = require('../controllers/admin/rolesController');
var galleryController = require('../controllers/admin/galleryController');
const bannerController = require('../controllers/admin/bannerController');
const bannerDisplayController = require('../controllers/admin/bannerDisplayController');
const bannerSectionController = require('../controllers/admin/bannerSectionController');
const cmsController = require('../controllers/admin/cmsController');
const permissionController = require("../controllers/admin/permissionController")
const imageResizeController = require("../controllers/admin/imageResizeController")
// nabc start
const categoryController=require("../controllers/admin/nabc_categoriesController");
const eventsController=require("../controllers/admin/nabc_eventsController");
var adminUserController = require('../controllers/admin/adminUserController');
var partnerOrganizationController = require('../controllers/admin/partnerOrganizationController');
var homeDetailsController = require('../controllers/admin/homeDetailsController');
const nabc_artistController = require('../controllers/admin/artistController');

// nabc stop
var models = require('../models');
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });
var app = express();
var url = require('url');
var expressValidator = require('express-validator');
router.use(expressValidator())
router.get('/',function(req, res) {
  res.redirect('/admin/dashboard');
  //console.log(req.baseUrl, req.url);
  //res.end();
});
function checkAuthentication(req,res,next){
  if(req.session.token){
    //if user is looged in, req.isAuthenticated() will return true 
    next();
  } else {
    res.redirect("/auth/signin");
  }
}
function middleHandler(req,res,next){
  models.admins.findOne({ where: { email: req.session.user.email } }).then(async function(user) {
    if(user) {
      res.locals.firstName = user ? user.firstName : "";
      res.locals.lastName = user ? user.lastName : "";
      res.locals.username = user ? user.username : "";
      res.locals.email = user ? user.email : "";
      res.locals.phone = user ? user.phone : "";
      res.locals.storeId = user ? user.storeId : "";
      res.locals.usercreatedBy = user ? user.id : "";
      res.locals.userimage = user ? user.image : "";
      
      res.locals.permissions = req.session.permissions;
      res.locals.role = req.session.role;
      res.locals.store = req.session.store;
      res.locals.reportingIds = req.session.reportingIds;
      next();
    } else {
      req.logout();
      res.redirect('/auth/signin');
    }
  });
}
//**** logout routes start ****//
router.get("/logout", function(req, res) {
  req.logout();
  req.session.destroy();
  return res.redirect("/auth/signin");
});
//**** logout routes end ****//
//**** dashboard routes start ****//
router.get('/dashboard',checkAuthentication,middleHandler,dashboardController.dashboard);
//**** dashboard routes end ****//


//2.***** role routes start
router.get("/roles", checkAuthentication, middleHandler, rolesController.list);
router.get("/roles/view/:id?", checkAuthentication, middleHandler, rolesController.view);
router.post("/roles/addOrUpdate", checkAuthentication, middleHandler, rolesController.addOrUpdate);
router.get("/roles/delete/:id?", checkAuthentication, middleHandler, rolesController.delete);
//***** role routes end

//**** categories routes start ****//
router.get("/categories/:id?",  checkAuthentication,  middleHandler,  categoriesController.loadPage);
router.post("/categories/statusChange", checkAuthentication,  middleHandler,  categoriesController.statusChange);
router.post("/categories/includeMenuChange", checkAuthentication,  middleHandler,  categoriesController.includeMenuChange);
router.post("/categories/contentAdd", checkAuthentication,  middleHandler,  categoriesController.contentAdd);
router.post("/categories/addSEO", checkAuthentication,  middleHandler,  categoriesController.addSEO);
router.post("/categories/saveNew", checkAuthentication,  middleHandler,  categoriesController.saveNew);
router.post("/categories/addOther", checkAuthentication,  middleHandler,  categoriesController.addOther);
router.post("/categories/includeFooterChange", checkAuthentication,  middleHandler,  categoriesController.includeFooterChange);
router.post("/categories/includeHomeChange", checkAuthentication,  middleHandler,  categoriesController.includeHomeChange);
router.post("/categories/includeAnchorChange", checkAuthentication,  middleHandler,  categoriesController.includeAnchorChange);

// router.get("/categories", checkAuthentication, middleHandler, categoriesController.categoryList);
// router.get("/categories/addedit/:id?", checkAuthentication, middleHandler, categoriesController.addeditCategory);
// router.post("/categories/add", checkAuthentication, middleHandler, categoriesController.addCategory);
// router.get("/categories/delete/:id?", checkAuthentication, middleHandler, categoriesController.deleteCategory);

//**** categories routes end ****//
//**** site settings group routes start ****//
router.get("/sitesettingsgroup/list/:page",checkAuthentication,middleHandler,siteSettingsGroups.list);
router.get("/sitesettingsgroup/view/:id?",checkAuthentication,middleHandler,siteSettingsGroups.view);
router.post("/sitesettingsgroup/addOrUpdate",checkAuthentication,middleHandler,siteSettingsGroups.addOrUpdate);
router.get("/sitesettingsgroup/delete/:id?",checkAuthentication,middleHandler,siteSettingsGroups.delete);
//**** site settings group routes end ****//
//**** site settings routes start ****//
router.get("/sitesettings/list/:page",checkAuthentication,middleHandler,siteSettings.list);
router.get("/sitesettings/view/:id?",checkAuthentication,middleHandler,siteSettings.view);
router.post("/sitesettings/addOrUpdate",checkAuthentication,middleHandler,siteSettings.addOrUpdate);
router.get("/sitesettings/delete/:id?",checkAuthentication,middleHandler,siteSettings.delete);
//**** site settings routes end ****//
//*** pages routes start ***/
router.get("/pages/list/:page",checkAuthentication,middleHandler,pages.list);
router.get("/pages/view/:id?",checkAuthentication,middleHandler,pages.view);
router.post("/pages/addOrUpdate",checkAuthentication,middleHandler,pages.addOrUpdate);
router.get("/pages/delete/:id?",checkAuthentication,middleHandler,pages.delete);
//*** pages routes end***/

//*** labs routes start ***/
router.get("/brands/list/:page",checkAuthentication,middleHandler,brandsController.list);
router.get("/brands/view/:id?",checkAuthentication,middleHandler,brandsController.view);
router.post("/brands/addOrUpdate",checkAuthentication,middleHandler,brandsController.addOrUpdate);
router.get("/brands/delete/:id?",checkAuthentication,middleHandler,brandsController.delete);
router.post("/brands/addIsoImage",checkAuthentication,middleHandler,brandsController.addIsoImage);
router.get("/brands/removeIsoImages/:brandId?/:imgId?",  checkAuthentication,  middleHandler,  brandsController.removeIsoImages);
router.get("/brands/download",checkAuthentication,middleHandler,brandsController.exportData);
//*** labs routes end***/


//*** Gallery routes start ***/
router.get("/gallery/list/:page",checkAuthentication,middleHandler,galleryController.list);
router.get("/gallery/view/:id?",checkAuthentication,middleHandler,galleryController.view);
router.post("/gallery/addOrUpdate",checkAuthentication,middleHandler,galleryController.addOrUpdate);
router.get("/gallery/delete/:id?",checkAuthentication,middleHandler,galleryController.delete);
//*** Gallery routes end***/

/**** banner routes start ****/
router.get("/banner/list/:page",checkAuthentication,middleHandler,bannerController.list);
router.get("/banner/view/:id?",checkAuthentication,middleHandler,bannerController.view);
router.post("/banner/addOrUpdate",checkAuthentication,middleHandler,bannerController.addOrUpdate);
router.get("/banner/delete/:id?",checkAuthentication,middleHandler,bannerController.delete);
//**** banner routes end ****//

//**** bannerdisplay routes start ****//
router.get("/bannerDiaplay/list/:page",checkAuthentication,middleHandler,bannerDisplayController.list);
router.get("/bannerDiaplay/view/:id?",checkAuthentication,middleHandler,bannerDisplayController.view);
router.post("/bannerDiaplay/addOrUpdate",checkAuthentication,middleHandler,bannerDisplayController.addOrUpdate);
router.get("/bannerDiaplay/delete/:id?",checkAuthentication,middleHandler,bannerDisplayController.delete);
//**** bannerdisplay routes end ****//

//**** bannersection routes start ****//
router.get("/bannerSection/list/:page",checkAuthentication,middleHandler,bannerSectionController.list);
router.get("/bannerSection/view/:id?",checkAuthentication,middleHandler,bannerSectionController.view);
router.post("/bannerSection/addOrUpdate",checkAuthentication,middleHandler,bannerSectionController.addOrUpdate);
router.get("/bannerSection/delete/:id?",checkAuthentication,middleHandler,bannerSectionController.delete);
//**** bannersection routes end ****//


router.get("/permission-group/list",checkAuthentication,middleHandler,permissionController.gropuList);
router.get("/permission-group/view/:id?",checkAuthentication,middleHandler,permissionController.groupView)
router.post("/permission-group/addOrUpdate",checkAuthentication,middleHandler,permissionController.groupAddOrUpdate);
router.get("/assign-permission/list",checkAuthentication,middleHandler,permissionController.logList);
router.get("/assign-permission/view/:id?",checkAuthentication,middleHandler,permissionController.logView)
router.post("/assign-permission/addOrUpdate",checkAuthentication,middleHandler,permissionController.logAddOrUpdate)

router.get("/image-resize/list", checkAuthentication, middleHandler, imageResizeController.storeList);
router.get("/image-resize/configuration/:id",checkAuthentication,middleHandler,imageResizeController.imageSettingView);
router.post("/image-resize/configuration/addedit",checkAuthentication,middleHandler,imageResizeController.imageSettingAddOrUpdate);


// nabc start
router.get("/category/:page",checkAuthentication,middleHandler,categoryController.categoryList);
router.get("/category/addedit/:id?", checkAuthentication, middleHandler, categoryController.addeditCategory);
router.post("/category/add", checkAuthentication, middleHandler, categoryController.addCategory);
router.get("/category/delete/:id?", checkAuthentication, middleHandler, categoryController.deleteCategory);

router.get("/events/list/:page",checkAuthentication,middleHandler,eventsController.list);
router.get("/events/view/:id?", checkAuthentication, middleHandler, eventsController.view);
router.post("/events/addOrUpdate", checkAuthentication, middleHandler, eventsController.addOrUpdate);
router.get("/events/delete/:id?", checkAuthentication, middleHandler, eventsController.delete);

// router.get("/contactus/list/:page", checkAuthentication, middleHandler, contactUsController.list);
// router.get("/contactus/view/:id?",checkAuthentication,middleHandler,contactUsController.view);
// router.post("/contactus/addOrUpdate",  checkAuthentication,  middleHandler,  contactUsController.addOrUpdate);
// router.get("/contactus/delete/:id?",checkAuthentication,middleHandler,contactUsController.delete);

//**** cms routes start ****//
router.get("/cms/list/:page",checkAuthentication,middleHandler,cmsController.list);
router.get("/cms/view/:id?",checkAuthentication,middleHandler,cmsController.view);
router.post("/cms/addOrUpdate",checkAuthentication,middleHandler,cmsController.addOrUpdate);
router.get("/cms/delete/:id?",checkAuthentication,middleHandler,cmsController.delete);
router.get("/cms/removeImages/:cmsId?/:imgId?",checkAuthentication,middleHandler,cmsController.removeImages);
//**** cms routes end ****//

//3.*****Admin User Create Start
router.get("/adminUser", checkAuthentication, middleHandler, adminUserController.list);
router.get("/adminUser/view/:id?", checkAuthentication, middleHandler, adminUserController.view);
router.post("/adminUser/addOrUpdate", checkAuthentication, middleHandler, adminUserController.addOrUpdate);
router.get("/adminUser/delete/:id?", checkAuthentication, middleHandler, adminUserController.delete);
router.post("/adminUser/getRole", checkAuthentication, middleHandler, adminUserController.getRoleStoreWise);
//*****Admin User Create End

//*** labs routes start ***/
router.get("/partnerOrganization/list/:page",checkAuthentication,middleHandler,partnerOrganizationController.list);
router.get("/partnerOrganization/view/:id?",checkAuthentication,middleHandler,partnerOrganizationController.view);
router.post("/partnerOrganization/addOrUpdate",checkAuthentication,middleHandler,partnerOrganizationController.addOrUpdate);
router.get("/partnerOrganization/delete/:id?",checkAuthentication,middleHandler,partnerOrganizationController.delete);
router.post("/partnerOrganization/addIsoImage",checkAuthentication,middleHandler,partnerOrganizationController.addIsoImage);
router.get("/partnerOrganization/removeIsoImages/:brandId?/:imgId?",  checkAuthentication,  middleHandler,  partnerOrganizationController.removeIsoImages);
router.get("/partnerOrganization/download",checkAuthentication,middleHandler,partnerOrganizationController.exportData);
//*** labs routes end***/

//*** homeDetails routes start ***/
router.get("/homeDetails/list/:page",checkAuthentication,middleHandler,homeDetailsController.list);
router.get("/homeDetails/view/:id?",checkAuthentication,middleHandler,homeDetailsController.view);
router.post("/homeDetails/addOrUpdate",checkAuthentication,middleHandler,homeDetailsController.addOrUpdate);
router.get("/homeDetails/delete/:id?",checkAuthentication,middleHandler,homeDetailsController.delete);
//*** homeDetails routes end***/
//** Artist routes start */
router.get('/artist/:page',checkAuthentication,middleHandler,nabc_artistController.artistList);
router.get('/artist/:page/view/:id?',checkAuthentication,middleHandler,nabc_artistController.view);
router.post('/artist/:page/addOrUpdate',checkAuthentication,middleHandler,nabc_artistController.addOrUpdate);
//** artist routes end **//

// nabc end

module.exports = router;
