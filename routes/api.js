var express = require("express");
var router = express.Router();
var authController = require("../controllers/api/authController");

var brandsController = require("../controllers/api/brandsController");
const bannerController = require("../controllers/api/bannerController");
const razorPayController = require('../controllers/api/razorPayController');
const nabc_EventController=require('../controllers/api/nabc_eventController');
const nabc_registrationController=require('../controllers/api/nabc_registrationController');
const nabc_sponsorshipController=require('../controllers/api/nabc_sponsorshipController');
const nabc_cmsController = require('../controllers/api/nabc_cmsController');

var models = require("../models");
var passport = require("passport");
var bcrypt = require("bcrypt-nodejs");
var csrf = require("csurf");
var csrfProtection = csrf({ cookie: true });
var app = express();
var url = require("url");
//const authMiddleware = require("../middlewares/auth.middleware");
//**** Api auth routes start ****//
router.post("/auth/signin", authController.signin);
router.post("/auth/verify-otp", authController.verifyOtp);
router.post("/auth/signup", authController.signup);
router.post("/auth/registration", authController.registration);
router.post("/auth/emailLogin", authController.emailLogin);
//**** Api auth routes end ****//


//**** Api brands routes start ****//
router.post("/brand/list", brandsController.list);
router.post("/brand/details", brandsController.details);
router.post("/brand/search", brandsController.searchList);
//**** Api brands routes end ****//

//**** Api banner routes start ****//
router.post("/banner/bannerlist", bannerController.bannerlist);
//**** Api banner routes end ****//

/****************************razorPayController start *****************************/
router.post("/razorpayInformation", razorPayController.razorpayInformationSave);
router.post("/razorpayDetails", razorPayController.razorpayInformationList);
/****************************razorPayController end *****************************/

// nabc start

router.post("/nabc/eventCategoryList",nabc_EventController.categoryList);
router.post("/nabc/categoryWiseEvents",nabc_EventController.categoryWiseEvent);
router.post("/nabc/homeView",nabc_EventController.homeView);
router.post("/nabc/eventDetails",nabc_EventController.eventDetails);
router.post("/nabc/registrationSave", nabc_registrationController.registrationSave);
router.post("/nabc/sponsorshipSave", nabc_sponsorshipController.sponsorshipSave);
router.post("/nabc/menuList", nabc_EventController.menuList);
router.post("/nabc/eventList", nabc_EventController.eventList);

router.post("/nabc/categoryWiseCms",nabc_cmsController.categoryWiseCms);
// nabc end
module.exports = router;
