var models = require("../../models");
const Excel = require("exceljs");
var fs = require("fs");
var jwt = require("jsonwebtoken");
var SECRET = "nodescratch";
var multiparty = require("multiparty");
var bodyParser = require("body-parser");
const paginate = require("express-paginate");
var config = require("../../config/config.json");
var path = require("path");
var helper = require("../../helpers/helper_functions");
var Sequelize = require("sequelize");
const Op = Sequelize.Op
var sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  }
);
/**
* Description: Categories list
* Developer:Susanta Kumar Das
**/
// exports.categoryList =async function (req, res, next) {
//   var token = req.session.token;
//   var currPage = req.query.page ? req.query.page : 0;
//   var limit = req.query.limit ? req.query.limit : 10;
//   var offset = currPage != 0 ? currPage * limit - limit : 0;
//   var keyword = req.query.search ? req.query.search.trim() : "";
//   // var sessionStoreId = req.session.user.storeId;
//   var sessionStoreId = 30;
//   var sessionUserId = req.session.user.id;

//   var catFilter = req.query.filter ? req.query.filter : "";

//   //*****Permission Assign Start
//   // var userPermission='';
//   // if (sessionStoreId == null) {
//   //     userPermission=true;
//   // }else{    
//   //   userPermission = !! req.session.permissions.find(permission => { 
//   //       return permission === 'CategoryList'
//   //   })
//   // }
//   // if(userPermission==false){
//   //   req.flash('errors','Contact Your administrator for permission');
//   //     res.redirect('/admin/dashboard');
//   // }else{
//   //*****Permission Assign End
// //   var categoryImages = await models.eventCategory.findAll({
// //     attributes:['id'], 
// //     include: [{
// //       model: models.categoryImages,
// //       attributes:['id', 'file', 'isVideo', 'isPrimary', 'imageTitle', 'categoryId'],
// //       where: {
// //         id:{
// //           [Op.ne]:null
// //         }
// //       },
// //       required:false,
// //     }],
// //     where:{
// //       storeId:sessionStoreId,
// //     }
// //   }).then(categories => {
// //     const categoryList = categories.map(category => {
// //       return Object.assign(
// //         {},
// //         {
// //           categoryId : category.id,
// //           image : category.categoryImages.file,
// //           isVideo : category.categoryImages.isVideo,
// //           isPrimary : category.categoryImages.isPrimary,
// //           imageTitle : category.categoryImages.imageTitle,
// //           imageId : category.categoryImages.id,
// //           imageCategoryId : category.categoryImages.categoryId
// //         }
// //       )
// //     });
// //     return categoryList;    
// //   });

//   jwt.verify(token, SECRET, async function (err, decoded) {
//     if (err) {
//       req.flash("info", "Invalid Token");
//       res.redirect('/auth/signin');
//     } else {    
      
//       ///// category filter start ////////////

//       if (catFilter && catFilter != "" && catFilter != 0) {
//         var arrCatFilter = catFilter;
//         models.eventCategory.findAll({
//           attributes:['id'],
//           include: [{
//             model: models.eventCategory,
//             where: {
//             //   isConfigurable: {
//             //     [Op.in]:[0, null]
//             //   },
//               storeId:sessionStoreId,
//             },
            
//           }],
//           where: {
//             categoryId:catFilter,
//             storeId:sessionStoreId,
//           },
//         }).then(async categoryCount => {
//           if (categoryCount) {
//             models.eventCategory.findAll({
//               attributes:['id'],
//               include: [{
//                 model: models.eventCategory,
//                 where: {
                  
//                   storeId:sessionStoreId,
//                 },
                
//               }],
//               where: {
//                 categoryId:catFilter,
//                 storeId:sessionStoreId,
//               },
//             }).then(async value => {

//               let categoryValues = []
//               for(let categoryv of value){
//                 let pv = categoryv.dataValues
//                 let stock = await models.inventory.findAll({attributes: ['stock'], where: {categoryId: categoryv.category.id}, order: [['id', 'DESC']]})
//                 if(stock.length >= 1){
//                   pv.stock = stock[0].stock
//                 }else{
//                   pv.stock = 0
//                   // const categoryImage = await models.categoryImages.findAll({attributes: ['file'], where:{categoryId: categoryv.id},limit:1})
//                   // if(categoryImage.length >= 1){
//                   //   pv.image = categoryImage[0].file
//                   // }else{
//                   //   pv.image = ''
//                   // }
//                 }
//                 // const categoryImage = await models.categoryImages.findAll({attributes: ['file'], where:{categoryId: categoryv.category.id},limit:1})
//                 //   if(categoryImage.length >= 1){
//                 //     pv.image = categoryImage[0].file
//                 //   }else{
//                 //     pv.image = ''
//                 //   }
                
//                 categoryValues.push(pv)
//               }

// exports.addOrUpdate=async(req,res)=>{
//     let token=req.session.token;
//     await jwt.verify(token,jwtSecret, async (error,decoded)=>{
//         if(error){
//             req.flash("info","Invalid Token");
//             res.redirect("/auth/signin");
//         }else{
//             try{
//                 const form=new multiparty.Form();
//                 form.parse(req, async function(err,fields, files){
//                     const id=fields.id[0];
//                     const categoryType=fields.categoryType[0];
//                     const categoryName=fields.categoryName[0];
//                     const parentId= fields.parentId[0] ? fields.parentId[0] : 0;
//                     const description=fields.description[0];
//                     const status=fields.status[0];
//                     const isDeleted=0;
//                     const createBy=1;
//                     const createdAt=date;
//                     const updatedAt=date;

//                     const data={categoryType,categoryName,parentId,description,status,isDeleted,createBy,createdAt,updatedAt};
//                     console.log(data);
//                     if(!id){                        
//                         const categoryData=new categoryModel(data);
//                         if(categoryData.save()){
//                             req.flash("info","Successfully Category Created");
//                             return res.redirect("/category/1");
//                         }
//                     }else{
//                         const categoryUpdate = await categoryModel.findByIdAndUpdate(id,data)
//                         .then(function(){
//                             req.flash("info","Successfully Category Updated");
//                             return res.redirect("/category/1");
//                         }).catch((err)=>{
//                             res.loggers.error(error);
//                             req.flash("info","Issue Occured");
//                             res.redirect("/category/1");
//                         })
//                     }
//                 })
//             }catch(error){
//                 req.flash("info","Issue Occured");
//                 res.redirect("/category/1");
//             }
//         }
//     })

// }

// exports.delete=async(req,res)=>{
//     let token=req.session.token;
//     await jwt.verify(token,jwtSecret, async (error,decoded)=>{
//         if(error){
//             req.flash("info","Invalid Token");
//             res.redirect("/auth/signin");
//         }else{
//             try{
//                 const id=req.params.id;
//                 let categoryUpdate=await categoryModel.findByIdAndUpdate(id,{
//                     isDeleted:1
//                 });
//               });
//             })
//           }
//           } else {
//             return res.render("admin/category/list", {
//               title: "Category",
//               arrCatFilter:arrCatFilter,
//               arrSearchData:'',
//               arrData: "",
//               arrcategoryCategory: '',
//               arrCategory: '',
//               helper:helper,
//               messages: req.flash("info"),
//               errors: req.flash("errors"),
//               pageCount: 0,
//               itemCount: 0,
//             //   categoryImages:categoryImages,
//               currentPage: currPage,
//               previousPage: '',
//               startingNumber: '',
//               endingNumber: '',
//               pages: paginate.getArrayPages(req)(
//                 limit,
//                 0,
//                 currPage,
//                 keyword
//               ),
//             });
//           }
//         });

//         // /////// category filter end ///////////////
//       } else {

//         if (catFilter && catFilter != "" ) {
//             var arrCatFilter = 'all';
//           } else {
//             var arrCatFilter = '';
//           }

//         if (keyword && keyword != "") {
          
//           models.eventCategory.count({
//             where: {
//               storeId:sessionStoreId,
//               title: {
//                 [Op.like]: keyword+'%'
//               },
//             //   isConfigurable: {
//             //     [Op.in]: [0, null]
//             //   },
//               storeId:sessionStoreId,
//             },
//           }).then(categoryCount => {
//             if (categoryCount) {
//               models.eventCategory.findAll({
//                 where: {
//                   storeId:sessionStoreId,
//                   title: {
//                     [Op.like]: keyword+'%'
//                   },
                  
//                 },
//                 order: [['id', 'DESC']],
//                 offset:offset,
//                 limit : limit,
//               }).then(async(value) => {
//                 let categoryValues = []
//                 for(let categoryv of value){
//                   let pv = categoryv.dataValues
//                   let stock = await models.inventory.findAll({attributes: ['stock'], where: {categoryId: categoryv.id}, order: [['id', 'DESC']]})
//                   if(stock.length >= 1){
//                     pv.stock = stock[0].stock
//                   }else{
//                     pv.stock = 0
//                     // const categoryImage = await models.categoryImages.findAll({attributes: ['file'], where:{categoryId: categoryv.id},limit:1})
//                     // if(categoryImage.length >= 1){
//                     //   pv.image = categoryImage[0].file
//                     // }else{
//                     //   pv.image = ''
//                     // }
//                   }
//                 //   const categoryImage = await models.categoryImages.findAll({attributes: ['file'], where:{categoryId: categoryv.id},limit:1})
//                 //     if(categoryImage.length >= 1){
//                 //       pv.image = categoryImage[0].file
//                 //     }else{
//                 //       pv.image = ''
//                 //     }
                  
//                   categoryValues.push(pv)
//                 }
//                 models.eventCategory.findAll({
//                   attributes:['id', 'categoryId', 'categoryId'],
//                   include: [{
//                     attributes:['title'],
//                     model: models.categories,
//                     where:{
//                       storeId:sessionStoreId,
//                     }
//                   }],
//                 }).then(categoryCategory => {
//                   models.categories.findAll({
//                     where: { status: "Yes",storeId:30 }
//                   }).then(category => {
//                     // return res.send(arrData);
//                     const itemCount =categoryCount > 0 ? categoryCount: 0;
//                     const pageCount =categoryCount > 0 ? Math.ceil(categoryCount / limit): 1;
//                     const previousPageLink = paginate.hasNextPages(req)(pageCount);
//                     const startItemsNumber =currPage == 0 || currPage == 1 ? 1 : (currPage - 1) * limit + 1;
//                     const endItemsNumber = pageCount == currPage || pageCount == 1 ? itemCount : currPage * limit;
//                     return res.render("admin/category/list", {
//                       title: "Category",
//                       arrCatFilter:arrCatFilter,
//                       arrSearchData:keyword,
//                       arrData: categoryValues,
//                       arrCategoryCategory: categoryCategory,
//                       helper:helper,
//                       arrCategory: category,
//                       messages: req.flash("info"),
//                       errors: req.flash("errors"),
//                       pageCount,
//                       itemCount,
//                     //   categoryImages:categoryImages,
//                       currentPage: currPage,
//                       previousPage: previousPageLink,
//                       startingNumber: startItemsNumber,
//                       endingNumber: endItemsNumber,
//                       pages: paginate.getArrayPages(req)(
//                         limit,
//                         pageCount,
//                         currPage
//                       ),
//                     });
//                   });
//                 });
//               })
//             } else {
//               return res.render("admin/category/list", {
//                 title: "Category",
//                 arrCatFilter:arrCatFilter,
//                 arrSearchData:'',
//                 arrData: '',
//                 arrcategoryCategory: '',
//                 helper:helper,
//                 arrCategory: '',
//                 messages: req.flash("info"),
//                 errors: req.flash("errors"),
//                 pageCount:0,
//                 itemCount:0,
//                 // categoryImages:categoryImages,
//                 currentPage: currPage,
//                 previousPage: '',
//                 startingNumber: '',
//                 endingNumber: '',
//                 pages: paginate.getArrayPages(req)(
//                   limit,
//                   0,
//                   currPage,
//                   keyword
//                 ),
//               });
//             }
//           });
//         } else {
//           // if (catFilter && catFilter != "" ) {
//           //   var arrCatFilter = 'all';
//           // } else {
//           //   var arrCatFilter = '';
//           // }
//           models.eventCategory.count({
//             where: {
//               // title: {
//               //   [Op.like]: keyword+'%'
//               // },
//             //   isConfigurable: {
//             //     [Op.in]: [0, null]
//             //   },
//               storeId:sessionStoreId,
//             },
//           }).then(categoryCount => {
//             if (categoryCount) {
//               models.eventCategory.findAll({
//                 where: {
//                   storeId:sessionStoreId,
//                   // title: {
//                   //   [Op.like]: keyword+'%'
//                   // },
                  
//                 },
//                 order: [['id', 'DESC']],
//                 offset:offset,
//                 limit : limit,
//               }).then(async (value) => {
//                 let categoryValues = []
//                 for(let categoryv of value){
//                   let pv = categoryv.dataValues
//                   let stock = await models.inventory.findAll({attributes: ['stock'], where: {categoryId: categoryv.id}, order: [['id', 'DESC']]})
//                   if(stock.length >= 1){
//                     pv.stock = stock[0].stock
//                   }else{
//                     pv.stock = 0
//                     // const categoryImage = await models.categoryImages.findAll({attributes: ['file'], where:{categoryId: categoryv.id},limit:1})
//                     // if(categoryImage.length >= 1){
//                     //   pv.image = categoryImage[0].file
//                     // }else{
//                     //   pv.image = ''
//                     // }
//                   }
//                 //   const categoryImage = await models.categoryImages.findAll({attributes: ['file'], where:{categoryId: categoryv.id},limit:1})
//                 //   if(categoryImage.length >= 1){
//                 //     pv.image = categoryImage[0].file
//                 //   }else{
//                 //     pv.image = ''
//                 //   }
                  
//                   categoryValues.push(pv)
//                 }
                
//                 models.eventCategory.findAll({
//                   attributes:['id', 'categoryId', 'categoryId'],
//                   include: [{
//                     attributes:['title'],
//                     model: models.categories,
//                     where:{
//                       storeId:sessionStoreId,
//                     }
//                   }],
//                 }).then(categoryCategory => {
//                   models.categories.findAll({
//                     where: { status: "Yes",storeId:30 }
//                   }).then(category => {
//                     // return res.send(categoryValues);
//                     const itemCount =categoryCount > 0 ? categoryCount: 0;
//                     const pageCount =categoryCount > 0 ? Math.ceil(categoryCount / limit): 1;
//                     const previousPageLink = paginate.hasNextPages(req)(pageCount);
//                     const startItemsNumber =currPage == 0 || currPage == 1 ? 1 : (currPage - 1) * limit + 1;
//                     const endItemsNumber = pageCount == currPage || pageCount == 1 ? itemCount : currPage * limit;
//                     return res.render("admin/category/list", {
//                       title: "Category",
//                       arrCatFilter:arrCatFilter,
//                       arrSearchData:keyword,
//                       arrData: categoryValues,
//                       arrCategoryCategory: categoryCategory,
//                       helper:helper,
//                       arrCategory: category,
//                       messages: req.flash("info"),
//                       errors: req.flash("errors"),
//                       pageCount,
//                       itemCount,
//                     //   categoryImages:categoryImages,
//                       currentPage: currPage,
//                       previousPage: previousPageLink,
//                       startingNumber: startItemsNumber,
//                       endingNumber: endItemsNumber,
//                       pages: paginate.getArrayPages(req)(
//                         limit,
//                         pageCount,
//                         currPage
//                       ),
//                     });
//                   });
//                 });
//               })
//             } else {
//               return res.render("admin/category/list", {
//                 title: "Category",
//                 arrCatFilter:arrCatFilter,
//                 arrSearchData:'',
//                 arrData: '',
//                 arrcategoryCategory: '',
//                 helper:helper,
//                 arrCategory: '',
//                 messages: req.flash("info"),
//                 errors: req.flash("errors"),
//                 pageCount:0,
//                 itemCount:0,
//                 // categoryImages:categoryImages,
//                 currentPage: currPage,
//                 previousPage: '',
//                 startingNumber: '',
//                 endingNumber: '',
//                 pages: paginate.getArrayPages(req)(
//                   limit,
//                   0,
//                   currPage,
//                   keyword
//                 ),
//               });
//             }
//           });
//         }
//       }
//     }
//   });
// // }
// };




// /**
// * Description: add/edit Category
// * Developer:Susanta Kumar Das
// **/
// exports.addeditCategory = async function(req, res){

//   //*****Permission Assign Start
//   var userPermission='';
//   if (sessionStoreId == null) {
//     userPermission=true;
//   }else{
//     userPermission = !! req.session.permissions.find(permission => { 
//         return permission === 'CategoryAddEdit'
//     })
//   }
//   if(userPermission==false){
//       res.redirect('/admin/dashboard');
//   }else{
//   //*****Permission Assign End

//   var id = req.params.id;
//   var categoryMultiImage=[];
//   var allCategoryList = '';
//   var allCategoryListforUpSell ='';
//   var allCategoryListforCrossSell = '';
//   var allCategoryListforAddon = '';
//   //var allStoresId = await models.stores.findAll({attributes:['id','storeName'], where:{status:'Yes'}});
//   var allBrandsId = await models.brands.findAll({attributes:['id','title'], where:{status:'Yes',storeId:30}});
//   //var allUnits = await models.units.findAll({attributes:['id','title'], where:{status:'Yes'}});
//   // var sessionStoreId = req.session.user.storeId;
//   var sessionStoreId = 30;
//   //var sessionUserId = req.session.user.id;
//   var attr = await models.attributesetting.findAll({ where:{status:'Yes', storeId:sessionStoreId}, include: [{model: models.attributevalue, required: false }]});
//   if(attr){
//     var attrList = attr;
//   }else{
//     var attrList = '';
//   }
//   if(id !='' && id != undefined){
//     var categoryList = await models.eventCategory.findAll({
//       include: [{
//         model: models.eventCategory,
//         include:[{
//           model: models.categories,
//           attributes:['id', 'title'],
//           where:{
//             storeId:sessionStoreId
//           }
//         }],
//         required:false,
//       }],
//       where: {
//         status:'active',
//         isConfigurable:0,
//         id:{
//           [Op.notIn]:[id]
//         },
//         storeId:sessionStoreId
//       },
//       order: [['id', 'DESC']]
//     }).then(categories => {
//       const categoryList = categories.map(category => {
//         return Object.assign(
//           {},
//           {
//             categoryId : category.id,
//             title : category.title,
//             slug: category.slug,
//             url: category.url,
//             description: category.description,
//             shortDescription: category.shortDescription,
//             topNotes: category.topNotes,
//             middleNotes: category.middleNotes,
//             baseNotes: category.baseNotes,
//             searchKeywords: category.searchKeywords,
//             price: category.price,
//             specialPrice: category.specialPrice,
//             specialPriceFrom: category.specialPriceFrom,
//             specialPriceTo: category.specialPriceTo,
//             bestSellers: category.bestSellers,
//             newArrivals: category.newArrivals,
//             taxClassId: category.taxClassId,
//             weight: category.weight,
//             unitId: category.unitId,
//             isConfigurable: category.isConfigurable,
//             metaTitle: category.metaTitle, 
//             metaKey: category.metaKey,   
//             metaDescription: category.metaDescription,
//             optionTitle: category.optionTitle,  
//             optionType: category.optionType,  
//             optionValue: category.optionValue,  
//             color: category.color,      
//             size: category.size,
//             brand: category.brand,      
//             application: category.application,      
//             type: category.type,      
//             fromDate: category.fromDate,        
//             fromTime: category.fromTime,  
//             toDate: category.toDate,  
//             toTime: category.toTime,   
//             visibility: category.visibility,
//             status: category.status,
//             sequence: category.sequence,
//           }
//         )
//       });
//       return categoryList;    
//     });
//   } else {
//     var categoryList = await models.eventCategory.findAll({
//       where: {
//         status:'active',
//         isConfigurable:0,
//         storeId:sessionStoreId
//       },
//       order: [['id', 'DESC']]
//     }).then(categories => {
//       const categoryList = categories.map(category => {
//         return Object.assign(
//           {},
//           {
//             categoryId : category.id,
//             title : category.title,
//             slug: category.slug,
//             url: category.url,
//             description: category.description,
//             shortDescription: category.shortDescription,
//             topNotes: category.topNotes,
//             middleNotes: category.middleNotes,
//             baseNotes: category.baseNotes,
//             searchKeywords: category.searchKeywords,
//             price: category.price,
//             specialPrice: category.specialPrice,
//             specialPriceFrom: category.specialPriceFrom,
//             specialPriceTo: category.specialPriceTo,
//             bestSellers: category.bestSellers,
//             newArrivals: category.newArrivals,
//             taxClassId: category.taxClassId,
//             weight: category.weight,
//             unitId: category.unitId,
//             isConfigurable: category.isConfigurable,
//             metaTitle: category.metaTitle, 
//             metaKey: category.metaKey,   
//             metaDescription: category.metaDescription,
//             optionTitle: category.optionTitle,  
//             optionType: category.optionType,  
//             optionValue: category.optionValue,  
//             color: category.color,      
//             size: category.size,
//             brand: category.brand,      
//             application: category.application,      
//             type: category.type,      
//             fromDate: category.fromDate,        
//             fromTime: category.fromTime,  
//             toDate: category.toDate,  
//             toTime: category.toTime,   
//             visibility: category.visibility,
//             status: category.status,
//             sequence: category.sequence,
//           }
//         )
//       });
//       return categoryList;    
//     });
//   }
//   //For Related category//
//   // if(id !='' && id !=null){
//   //   var arrRelatedCategoryIds =[];
//   //   var relatedCategoryIds = await models.relatedCategory.findAll({attributes:['selectedCategoryId'], where:{categoryId:id,type:'Related'}});
//   //   relatedCategoryIds.forEach(function(re){
//   //     arrRelatedCategoryIds.push(re.selectedCategoryId);
//   //   });
//   //   if(arrRelatedCategoryIds.length > 0){
//   //     arrRelatedCategoryIds.push(id);
//   //     allCategoryList = await models.eventCategory.findAll({
//   //       attributes:['id', 'storeId', 'sku', 'title', 'price', 'status'],
//   //       where: {
//   //         status:'active',
//   //         isConfigurable:0,
//   //         id:{
//   //           [Op.notIn]:[arrRelatedCategoryIds]
//   //         },
//   //         storeId:sessionStoreId
//   //       },
//   //       order: [['id', 'DESC']]
//   //     }).then(categories => {
//   //       const categoryList = categories.map(category => {
//   //         return Object.assign(
//   //           {},
//   //           {
//   //             categoryId : category.id,
//   //             title : category.title,
//   //             slug: category.slug,
//   //             url: category.url,
//   //             description: category.description,
//   //             shortDescription: category.shortDescription,
//   //             topNotes: category.topNotes,
//   //             middleNotes: category.middleNotes,
//   //             baseNotes: category.baseNotes,
//   //             searchKeywords: category.searchKeywords,
//   //             price: category.price,
//   //             specialPrice: category.specialPrice,
//   //             specialPriceFrom: category.specialPriceFrom,
//   //             specialPriceTo: category.specialPriceTo,
//   //             bestSellers: category.bestSellers,
//   //             newArrivals: category.newArrivals,
//   //             taxClassId: category.taxClassId,
//   //             weight: category.weight,
//   //             unitId: category.unitId,
//   //             isConfigurable: category.isConfigurable,
//   //             metaTitle: category.metaTitle, 
//   //             metaKey: category.metaKey,   
//   //             metaDescription: category.metaDescription,
//   //             optionTitle: category.optionTitle,  
//   //             optionType: category.optionType,  
//   //             optionValue: category.optionValue,  
//   //             color: category.color,      
//   //             size: category.size,
//   //             brand: category.brand,      
//   //             application: category.application,      
//   //             type: category.type,      
//   //             fromDate: category.fromDate,        
//   //             fromTime: category.fromTime,  
//   //             toDate: category.toDate,  
//   //             toTime: category.toTime,   
//   //             visibility: category.visibility,
//   //             status: category.status,
//   //             sequence: category.sequence,
//   //           }
//   //         )
//   //       });
//   //       return categoryList;    
//   //     });
//   //   } else {
//   //     allCategoryList = categoryList;
//   //   }
//   // } else {
//   //   allCategoryList = categoryList;
//   // }

//   // if(id !='' && id !=null){
//   var arrRelatedCategory =[];

//   allCategoryList = await models.eventCategory.findAll({
//     attributes:['id', 'storeId', 'sku','slug', 'title', 'price', 'status','description','shortDescription','weight','size','sequence','specialPrice'],
//     where: {
//       status:'active',
//       isConfigurable:0,
//       storeId:30
//     },
//     order: [['id', 'DESC']]
//   });

//   if(allCategoryList.length > 0){

//     for(var j=0;j<allCategoryList.length;j++){

//       if(id !='' && id !=null){
//         var relatedCategory = await models.relatedCategory.findAll({attributes:['selectedCategoryId','id'], where:{categoryId:id,type:'Related',selectedCategoryId:allCategoryList[j].id }});
//         if(relatedCategory.length > 0){
//           var isSelected = 'yes'
//         } else {
//           var isSelected = 'no'
//         }
//       } else {
//         var isSelected = 'no'
//       }

//       arrRelatedCategory.push({
//         "id":allCategoryList[j].id,
//         "categoryId":allCategoryList[j].id,
//         "title":allCategoryList[j].title,
//         "shortDescription":allCategoryList[j].shortDescription,
//         "slug":allCategoryList[j].slug,
//         "description": allCategoryList[j].description,
//         "price": allCategoryList[j].price,
//         "specialPrice": allCategoryList[j].specialPrice,
//         "weight":allCategoryList[j].weight,
//         "size":allCategoryList[j].size,
//         "status": allCategoryList[j].status,
//         "sequence": allCategoryList[j].sequence,
//         "isSelected": isSelected
//       });

//     }

//   } 
//     // } else {
//     //   allCategoryList = categoryList;
//     // }

//   //For Related category//
//   //For Up-Sell Categories//
//   if(id !='' && id !=null){
//     var arrUpSellCategoryIds =[];
//     var upSellCategoryIds = await models.relatedCategory.findAll({attributes:['selectedCategoryId'], where:{categoryId:id,type:'Up-Sells'}});
//     upSellCategoryIds.forEach(function(re){
//       arrUpSellCategoryIds.push(re.selectedCategoryId);
//     });
//     if(upSellCategoryIds.length > 0){
//       upSellCategoryIds.push(id);
//       allCategoryListforUpSell = await models.eventCategory.findAll({
//         attributes:['id', 'storeId', 'sku', 'title', 'price', 'status'],
//         where: {
//           status:'active',
//           isConfigurable:0,
//           id:{
//             [Op.notIn]:[upSellCategoryIds]
//           },
//           storeId:sessionStoreId
//         },
//         order: [['id', 'DESC']]
//       }).then(categories => {
//         const categoryList = categories.map(category => {
//           return Object.assign(
//             {},
//             {
//               categoryId : category.id,
//               title : category.title,
//               slug: category.slug,
//               url: category.url,
//               description: category.description,
//               shortDescription: category.shortDescription,
//               topNotes: category.topNotes,
//               middleNotes: category.middleNotes,
//               baseNotes: category.baseNotes,
//               searchKeywords: category.searchKeywords,
//               price: category.price,
//               specialPrice: category.specialPrice,
//               specialPriceFrom: category.specialPriceFrom,
//               specialPriceTo: category.specialPriceTo,
//               bestSellers: category.bestSellers,
//               newArrivals: category.newArrivals,
//               taxClassId: category.taxClassId,
//               weight: category.weight,
//               unitId: category.unitId,
//               isConfigurable: category.isConfigurable,
//               metaTitle: category.metaTitle, 
//               metaKey: category.metaKey,   
//               metaDescription: category.metaDescription,
//               optionTitle: category.optionTitle,  
//               optionType: category.optionType,  
//               optionValue: category.optionValue,  
//               color: category.color,      
//               size: category.size,
//               brand: category.brand,      
//               application: category.application,      
//               type: category.type,      
//               fromDate: category.fromDate,        
//               fromTime: category.fromTime,  
//               toDate: category.toDate,  
//               toTime: category.toTime,   
//               visibility: category.visibility,
//               status: category.status,
//               sequence: category.sequence,
//               categoryId : category.category.id,
//               catTitle : category.category.title
//             }
//           )
//         });
//         return categoryList;    
//       });
//     } else {
//       allCategoryListforUpSell = categoryList;
//     }
//   } else {
//     allCategoryListforUpSell = categoryList;
//   }
//   //For Up-Sell Categories//
//   //For Cross-Sell Categories//
//   if(id !='' && id !=null){
//     var arrCrossSellsCategoryIds =[];
//     var crossSellsCategoryIds = await models.relatedCategory.findAll({attributes:['selectedCategoryId'], where:{categoryId:id,type:'Cross-Sells'}});
//     crossSellsCategoryIds.forEach(function(re){
//       arrCrossSellsCategoryIds.push(re.selectedCategoryId);
//     });
//     if(arrCrossSellsCategoryIds.length > 0){
//       arrCrossSellsCategoryIds.push(id);
//       allCategoryListforCrossSell = await models.eventCategory.findAll({
//         attributes:['id', 'storeId', 'sku', 'title', 'price', 'status'],
//         where: {
//           status:'active',
//           isConfigurable:0,
//           id:{
//             [Op.notIn]:[arrCrossSellsCategoryIds]
//           },
//           storeId:sessionStoreId
//         },
//         order: [['id', 'DESC']]
//       }).then(categories => {
//         const categoryList = categories.map(category => {
//           return Object.assign(
//             {},
//             {
//               categoryId : category.id,
//               title : category.title,
//               slug: category.slug,
//               url: category.url,
//               description: category.description,
//               shortDescription: category.shortDescription,
//               topNotes: category.topNotes,
//               middleNotes: category.middleNotes,
//               baseNotes: category.baseNotes,
//               searchKeywords: category.searchKeywords,
//               price: category.price,
//               specialPrice: category.specialPrice,
//               specialPriceFrom: category.specialPriceFrom,
//               specialPriceTo: category.specialPriceTo,
//               bestSellers: category.bestSellers,
//               newArrivals: category.newArrivals,
//               taxClassId: category.taxClassId,
//               weight: category.weight,
//               unitId: category.unitId,
//               isConfigurable: category.isConfigurable,
//               metaTitle: category.metaTitle, 
//               metaKey: category.metaKey,   
//               metaDescription: category.metaDescription,
//               optionTitle: category.optionTitle,  
//               optionType: category.optionType,  
//               optionValue: category.optionValue,  
//               color: category.color,      
//               size: category.size,
//               brand: category.brand,      
//               application: category.application,      
//               type: category.type,      
//               fromDate: category.fromDate,        
//               fromTime: category.fromTime,  
//               toDate: category.toDate,  
//               toTime: category.toTime,   
//               visibility: category.visibility,
//               status: category.status,
//               sequence: category.sequence,
//               categoryId : category.category.id,
//               catTitle : category.category.title
//             }
//           )
//         });
//         return categoryList;    
//       });
//     } else {
//       allCategoryListforCrossSell = categoryList;
//     }
//   } else {
//     allCategoryListforCrossSell = categoryList;
//   }
//   //For Cross-Sell Categories//
//   //For Add-On Categories//
//   if(id !='' && id !=null){
//     var arrAddOnCategoryIds =[];
//     var addOnCategoryIds = await models.relatedCategory.findAll({attributes:['selectedCategoryId'], where:{categoryId:id,type:'Add-on'}});
//     addOnCategoryIds.forEach(function(re){
//       arrAddOnCategoryIds.push(re.selectedCategoryId);
//     });
//     if(arrAddOnCategoryIds.length > 0){
//       arrAddOnCategoryIds.push(id);
//       allCategoryListforAddon = await models.eventCategory.findAll({
//         attributes:['id', 'storeId', 'sku', 'title', 'price', 'status'],
//         where: {
//           status:'active',
//           isConfigurable:0,
//           id:{
//             [Op.notIn]:[arrAddOnCategoryIds]
//           },
//           storeId:sessionStoreId
//         },
//         order: [['id', 'DESC']]
//       });
//     } else {
//       allCategoryListforAddon = categoryList;
//     }
//   } else {
//     allCategoryListforAddon = categoryList;
//   }
//   //For Add-On Categories//
//   var configCategories = await models.eventCategory.findAll({ attributes:['id', 'title', 'storeId','size','price','specialPrice','status'], where:{ isConfigurable:id,storeId:30 } });
//   var categoryDetails = await models.categories.findAll({ where:{status:'Yes',storeId:30}});
//   var arr=[];
//   var tree ='';
//   categoryDetails.forEach(function (cat) {
//     arr.push({
//       "id": cat.id,
//       "title": cat.title,
//       "storeId": cat.storeId,
//       "parent": cat.parentCategoryId
//     });
//   });
//   tree = unflatten(arr); 
//   if(!id){
//     return res.render("admin/category/addedit", {
//       title: "Add Category",
//       arrData: "",
//       categoryImages:'',
//       stockQuantity: '',
//       arrAllCategoryList: allCategoryList,
//       arrAllRelatedCategoryList: arrRelatedCategory,
//       arrAllCategoryListforUpSell :allCategoryListforUpSell,
//       arrAllCategoryListforCrossSell: allCategoryListforCrossSell,
//       arrAllCategoryListforAddon : allCategoryListforAddon,
//       arrConfigCategories : configCategories,
//       arrCategoryTree : JSON.stringify(tree, null, " "),
//       catid: '',
//       //allStoresId: allStoresId,
//       allBrandsId: allBrandsId,
//       attrList:attrList,
//       //allUnits: allUnits,
//       catName: '',
//       arrOption : '',
//       arrCategory : '',
//       messages: req.flash("info"),
//       errors: req.flash("errors"),
//     });
//   } else {
//     var categoryDetails = await models.eventCategory.findOne({ where:{ id:id , storeId:sessionStoreId} });
//     const stockDetails = await models.inventory.findAll({ where:{ categoryId:id , storeId:sessionStoreId}, order: [['id', 'DESC']] });
//     let stockQuantity
//     if(stockDetails.length >= 1){
//       stockQuantity = stockDetails[0].stock
//     }else{
//       stockQuantity = 0
//     }
    
//     if(categoryDetails==null){
//       res.redirect('/admin/categories');
//     }
//     var categoryImages = await models.categoryImages.findAll({ where:{ categoryId:id, id:{ [Op.ne]:null }}});
//     var categoryCategory = await models.eventCategory.findAll({attributes:['categoryId'], where:{ categoryId:id,storeId:sessionStoreId } });
//     var arrProCat = [];
//     var catid =[];
//     var catName =[];
//     var catProIds =[];
//     if(categoryCategory.length > 0){
//       categoryCategory.forEach(function(cat){
//         arrProCat.push(cat.categoryId);
//       });
//       var category = await models.categories.findAll({
//         attributes:['id', 'title','storeId'],
//         include: [{
//           model: models.eventCategory,
//           where: {
//             categoryId:{
//               [Op.in]:[arrProCat]
//             },
//             storeId:30
//           },
//         }],
//       });
//       category.forEach(function(orgcat){
//         catid.push(orgcat.id);
//         catName.push(orgcat.title);
//         catProIds.push({id:orgcat.id,storeId:orgcat.storeId});
//       });
//     }
//     //custom option//
//     var arrOption = await models.optionMaster.findAll({
//       attributes:['id','title','type','isRequired','sorting'],
//       include: [{
//         model: models.optionCategory,
//         attributes:['categoryId'],
//         required:false,
//       },{
//         model: models.optionValue,
//         attributes:['value', 'price'],
//         required:false,            
//       }],
//     }).then(arrOptions => {
//       const list = arrOptions.map(arrOption => {
//         return Object.assign(
//           {},
//           {
//             id: arrOption.id,
//             title: arrOption.title,
//             type: arrOption.type,
//             isRequired: arrOption.isRequired,
//             sorting: arrOption.sorting,
//             categoryId: arrOption.optionCategory ? arrOption.optionCategory.categoryId :null,
//             optionValue: arrOption.optionValues.map(oV => {
//               return Object.assign(
//                 {},
//                 {
//                   value:oV.value,
//                   price:oV.price,
//                 }
//               )
//             })
//           }
//         );
//       })
//       return list;
//     });
//     return res.render("admin/category/addedit", {
//       title: "Edit Category",
//       arrData: categoryDetails,
//       stockQuantity: stockQuantity,
//       arrCategoryTree : JSON.stringify(tree, null, " "),
//       arrAllCategoryList: allCategoryList,
//       arrAllRelatedCategoryList: arrRelatedCategory,
//       arrAllCategoryListforUpSell :allCategoryListforUpSell,
//       arrAllCategoryListforCrossSell: allCategoryListforCrossSell,
//       arrAllCategoryListforAddon : allCategoryListforAddon,
//       categoryImages : categoryImages,             
//       arrConfigCategories : configCategories, 
//       catid: catid,
//       //allStoresId: allStoresId,
//       allBrandsId: allBrandsId,
//       attrList:attrList,
//       //allUnits: allUnits,
//       catName: catName,
//       arrCategory: JSON.stringify(catProIds, null, " "),
//       arrOption : arrOption,
//       messages: req.flash("info"),
//       errors: req.flash("errors"),
//     });
//   }
// }
// }





// /**
// * Description: Categories add Geneneral Info
// * Developer:Susanta Kumar Das
// **/

// exports.addGenInfo = async function(req,res){
//   var form = new multiparty.Form();
//   form.parse(req,async function (err, fields, files) {
//     var categoryId = fields.updateId[0];
//     var storeIds = fields.storeIds[0];
//     // var sessionStoreId = 30;
//     console.log('store============>',storeIds);
//     var jsonHiddenCatIds = fields.hiddenCatIds[0];
//     var hiddenCatIds = jsonHiddenCatIds.split(',');
//     var hiddenStoreIds = JSON.parse(storeIds);
//     // var sessionStoreId = req.session.user.storeId;
//     var sessionStoreId = 30;
//     //var sessionUserId = req.session.user.id;
//     if(fields.status == 'active'){
//       var status = 'active';
//     } else {
//       var status = 'inactive';
//     }
//     if(fields.bestSellers == 'yes'){
//       var bestSellers = 'yes';
//     }else{
//       var bestSellers = 'no';
//     }
//     if(fields.newArrivals == 'yes'){
//       var newArrivals = 'yes';
//     }else{
//       var newArrivals = 'no';
//     }
//     if(fields.type[0] == 'Addon'){
//       var isConfigurable = null;
//     } else {
//       var isConfigurable = 0;
//     }
//     if( fields.specialPrice == '' ){
//       var specialPrice = 0.00;
//     } else {
//       var specialPrice = fields.specialPrice;
//     }
//     if(categoryId !='' && categoryId !=null){
//       models.eventCategory.update({
//         // status: status,
//         bestSellers : bestSellers,
//         newArrivals : newArrivals,
//         // storeId: 1,
//         type: fields.type[0],
//         title : fields.title[0],
//         sku : fields.sku[0],
//         slug : fields.slug[0],
//         price : fields.price[0],
//         specialPrice : specialPrice  ,
//         specialPriceFrom : fields.specialPriceFrom[0] ? fields.specialPriceFrom[0] : null,
//         specialPriceTo : fields.specialPriceTo[0] ? fields.specialPriceTo[0] : null,
//         // weight : fields.weight[0],
//         // visibility : fields.visibility[0],
//         // color : fields.color[0],
//         // size : fields.size[0],
//         brand : fields.brand ? fields.brand[0] : null,
//         isConfigurable : isConfigurable,
//         status : fields.status[0],
//         sequence : fields.sequence[0] ? fields.sequence[0] : null,
//       },{where:{id:categoryId}}).then(async function(crt){
//         if(crt){
//           // const stock = fields.stock[0] || ''
//           // await models.inventory.create({
//           //   categoryId : categoryId,
//           //   storeId : sessionStoreId,
//           //   stock : stock,
//           //   remarks : `${stock} new quantity added`
//           // })
//           if(hiddenStoreIds !=''){
//             var deletecapPro = await models.eventCategory.destroy({ where:{ categoryId:categoryId, storeId:sessionStoreId }});
//             if(deletecapPro == 0){
//               for(var i=0; i< hiddenStoreIds.length; i++){
//                 models.eventCategory.create({
//                   // storeId : hiddenStoreIds[i].storeId,
//                   storeId : sessionStoreId,
//                   categoryId : hiddenStoreIds[i].id,
//                   categoryId : categoryId,
//                   position : i
//                 })
//               }
//             } else {
//               for(var i=0; i< hiddenStoreIds.length; i++){
//                 models.eventCategory.create({
//                   storeId : hiddenStoreIds[i].storeId,
//                   storeId : sessionStoreId,
//                   categoryId : hiddenStoreIds[i].id,
//                   categoryId : categoryId,
//                   position : i
//                 })
//               }
//             }                    
//           }
//           req.flash("info", "Successfully Updated");
//           return res.redirect("/admin/category/addedit/"+categoryId);
//         } else {
//           req.flash("errors", "Something Worng! Please try again.");
//           return res.redirect("back");
//         }
//       })
//     } else {
//       models.eventCategory.create({
//         status:status,
//         bestSellers : bestSellers,
//         newArrivals : newArrivals,
//         //storeId: 1,
//         storeId : sessionStoreId,
//         type: fields.type[0],
//         title : fields.title[0],
//         sku : fields.sku[0],
//         slug : fields.slug[0],
//         price : fields.price[0],
//         specialPrice : specialPrice,
//         specialPriceFrom : fields.specialPriceFrom[0] ? fields.specialPriceFrom[0] : null,
//         specialPriceTo : fields.specialPriceTo[0] ? fields.specialPriceTo[0] : null,
//         // weight : fields.weight[0],
//         // //unitId : fields.unitId[0],
//         // visibility : fields.visibility[0],
//         // color : fields.color[0],
//         // size : fields.size[0],
//         brand : fields.brand ? fields.brand[0] : null,
//         status : fields.status[0],
//         sequence : fields.sequence[0] ? fields.sequence[0] : null,
//         isConfigurable : isConfigurable
//       }).then(async function(crt){
//         if(crt){
//           // const stock = fields.stock[0] || ''
//           // await models.inventory.create({
//           //   categoryId : crt.id,
//           //   storeId : sessionStoreId,
//           //   stock : stock
//           // })

//           if(hiddenStoreIds !=''){
//             var deletecapPro = await models.eventCategory.destroy({ where:{ categoryId:crt.id }});
//             if(deletecapPro == 0){
//               for(var i=0; i< hiddenStoreIds.length; i++){
//                 models.eventCategory.create({
//                   storeId: hiddenStoreIds[i].storeId,
//                   storeId : hiddenStoreIds[i].storeId,
//                   categoryId : hiddenStoreIds[i].id,
//                   categoryId : crt.id,
//                   position : i
//                 })
//               }
//             } else {
//               for(var i=0; i< hiddenStoreIds.length; i++){
//                 models.eventCategory.create({
//                   storeId: hiddenStoreIds[i].storeId,
//                   storeId : hiddenStoreIds[i].storeId,
//                   categoryId : hiddenStoreIds[i].id,
//                   categoryId : crt.id,
//                   position : i
//                 })
//               }
//             }                    
//           }
//           req.flash("info", "Successfully Updated");
//           return res.redirect("/admin/categories");
//         } else {
//           req.flash("errors", "Something Worng! Please try again.");
//           return res.redirect("back");
//         }
//       })
//     }
//   });
// }




// /**
// * Description: Categories add Attribute Info
// * Developer:Partha Mandal
// **/
// exports.addAttrInfo = async function(req,res){
//   var form = new multiparty.Form();
//   form.parse(req,async function (err, fields, files) {
//     var categoryId = fields.updateId[0];
//     if(categoryId !='' && categoryId !=null){

//       delete fields.updateId;
//       Object.keys(fields).forEach((item, index) => {
//          sequelize.query(`UPDATE categories SET ${item}='${fields[item]}' WHERE id=${categoryId}`)
//       })
//       req.flash('info', 'Successfully updated');
//       res.redirect('back');
//     }else{
//       let query = `INSERT INTO categories (`
//       let value = '';
//       delete fields.updateId;
//       Object.keys(fields).forEach((item, index) => {
//           if(index === Object.keys(fields).length -1){
//               query+= `${item} `;
//               value += `'${fields[item]}'`
//           }else{
//               query+= `${item}, `;
//               value += `'${fields[item]}',`
//           }
//       })
//       query +=') VALUES ('+ value + ');';
//       sequelize.query(query).then((success)=>{
//           req.flash('info', 'Successfully created');
//           res.redirect('back');
//       }).catch((error)=>{
//           req.flash('errors', 'Something went wrong');
//           res.redirect('back');
//       })
//     }
//   })

// }





// /**
// * Description: Categories add image
// * Developer:Susanta Kumar Das
// **/
// exports.addFile = async function(req,res){
//   //return res.send(req)
//   var form = new multiparty.Form();
//   form.parse(req,async function (err, fields, files) {
//    // return res.send(fields);
//     var categoryImages = files.image;
//     //console.log(categoryImages); return false;
//     var categoryId= fields.updateIdForFile[0];
//     if(categoryId !=null && categoryId !=''){
//       if(categoryImages !=''){
//         var categoryFiles = [];
//         helper.createDirectory('public/admin/category/image/'+categoryId+'/');
//         categoryImages.forEach(async function(img){
//           var tempPath = img.path;
//           var fileName = img.originalFilename;
//           var targetPath = categoryId+'/'+fileName;
//           helper.uploadCategoryImage(tempPath, targetPath);
//         });
//         var categoryDetals = await models.eventCategory.findOne({attributes:['storeId'], where:{id:categoryId}})
//         for(var i= 0; i < categoryImages.length; i++){                                   
//           models.categoryImages.create({categoryId:categoryId, storeId:categoryDetals.storeId, file:categoryImages[i].originalFilename });              
//         };
//         req.flash("info", "Category Images Saved Successfully.");
//         return res.redirect("/admin/category/addedit/"+categoryId);
//       } else {
//         req.flash("info", "Category Images Saved Successfully.");
//         return res.redirect("/admin/category/addedit/"+categoryId);
//       }
//     } else {
//       req.flash("info", "Category Images Not Upload.");
//       return res.redirect("/admin/category/addedit/"+categoryId);
//     }
//   })
// }




// /**
// * Description: Categories add Content Info
// * Developer:Susanta Kumar Das
// **/
// exports.addContentInfo = async function(req,res){
//   var form = new multiparty.Form();
//   form.parse(req,async function (err, fields, files) {
//     var categoryId = fields.updateId[0];
//     if(categoryId !=''){
//       models.eventCategory.update({
//         description : fields.description[0],
//         shortDescription : fields.shortDescription[0],
//         topNotes : fields.topNotes[0],
//         middleNotes : fields.middleNotes[0],
//         baseNotes : fields.baseNotes[0],
//         // searchKeywords : fields.searchKeywords[0],
//         // optionTitle : fields.optionTitle[0],
//         // optionType : fields.optionType[0],
//         // optionValue : fields.optionValue[0],
//         // application : fields.application[0],
//         // fromDate : fields.fromDate ? fields.fromDate[0] : null,
//         // fromTime : fields.fromTime ? fields.fromTime[0] : null,
//         // toDate : fields.toDate ? fields.toDate[0] : null,
//         // toTime : fields.toTime ? fields.toTime[0] : null,
//       },{where:{id:categoryId}}).then(function(upd){
//         req.flash("info", "Successfully Updated");
//         return res.redirect("/admin/category/addedit/"+categoryId);
//       })
//     } else {
//       models.eventCategory.create({
//         description : fields.description[0],
//         shortDescription : fields.shortDescription[0],
//         topNotes : fields.topNotes[0],
//         middleNotes : fields.middleNotes[0],
//         baseNotes : fields.baseNotes[0],
//         // searchKeywords : fields.searchKeywords[0],
//         // optionTitle : fields.optionTitle[0],
//         // optionType : fields.optionType[0],
//         // optionValue : fields.optionValue[0],
//         // application : fields.application[0],
//         // fromDate : fields.fromDate ? fields.fromDate[0] : null,
//         // fromTime : fields.fromTime ? fields.fromTime[0] : null,
//         // toDate : fields.toDate ? fields.toDate[0] : null,
//         // toTime : fields.toDate ? fields.toDate[0] : null,
//       }).then(function(crt){
//         req.flash("info", "Successfully Created");
//         return res.redirect("/admin/category/addedit/"+crt.id);
//       })
//     }
//   });
// }



// /**
// * Description: Categories add Seo Info
// * Developer:Susanta Kumar Das
// **/
// exports.addSeoInfo = async function(req,res){
//   var form = new multiparty.Form();
//   form.parse(req,async function (err, fields, files) {
//     var categoryId = fields.updateId[0];
//     if(categoryId !=''){
//       models.eventCategory.update({
//         url : fields.url[0],
//         metaTitle : fields.metaTitle[0],
//         metaKey : fields.metaKey[0],
//         metaDescription : fields.metaDescription[0],
//       },{where:{id:categoryId}}).then(function(upd){
//         req.flash("info", "Successfully Updated");
//         return res.redirect("/admin/category/addedit/"+categoryId);
//       })
//     }else{
//       models.eventCategory.create({
//         url : fields.url[0],
//         metaTitle : fields.metaTitle[0],
//         metaKey : fields.metaKey[0],
//         metaDescription : fields.metaDescription[0],
//       }).then(function(crt){
//         req.flash("info", "Successfully Created");
//         return res.redirect("/admin/category/addedit/"+crt.id);
//       })
//     }
//   });
// }




// /**
// * Description: Categories remove Image
// * Developer:Susanta Kumar Das
// **/
// exports.removeImages = async function(req,res){
//   var categoryId = req.params.categoryId;
//   var imgId = req.params.imgId;
//   if(categoryId!='' && imgId !=''){
//     var categoryImageDetails = await models.categoryImages.findOne({where:{id:imgId,categoryId:categoryId}});
//     var fileName = categoryImageDetails.file;
//       fs.unlink('public/admin/category/image/'+categoryId+'/'+fileName, function (err) {
//     });
//     models.categoryImages.destroy({where:{id:imgId,categoryId:categoryId}}).then(function(dst){
//       if(dst){
//         req.flash("info", "Image Successfully Removed");
//         return res.redirect("/admin/category/addedit/"+categoryId);
//       }else{
//         req.flash("errors", "Something Worng! Please try again.");
//         return res.redirect("/admin/category/addedit/"+categoryId);
//       }
//     })
//   }
// }




// /**
// * Description: Categories add Related
// * Developer:Susanta Kumar Das
// **/
// exports.addRelPro = async function(req,res){
//   var form = new multiparty.Form();
//   form.parse(req,async function (err, fields, files) {
//     var selectCategory = fields.selectCategory[0];
//     // return res.send(fields)
//     var arrSelectCategory = selectCategory.split(',');
//     var categoryId = fields.categoryId[0];
//     var storeId = fields.storeId[0];
//     // return res.send(fields)
//     if(selectCategory !='' && categoryId !=''){ 

//       models.relatedCategory.destroy({where:{categoryId: categoryId,storeId:storeId,}}).then(function(dst){
//         for(var i=0;i < arrSelectCategory.length; i++){ 
//           models.relatedCategory.create({
//             categoryId:categoryId,
//             storeId:storeId,
//             selectedCategoryId : arrSelectCategory[i],
//             type :'Related',
//             createdAt: Date.now()  
//           }).then(function(crt){
//             req.flash("info", "Related Category Added Successfully");
//             return res.redirect("/admin/category/addedit/"+categoryId);
//           })
//         }   
//     })

//       // for(var i=0;i < arrSelectCategory.length; i++){ 
//       //   models.relatedCategory.create({
//       //     categoryId:categoryId,
//       //     storeId:storeId,
//       //     selectedCategoryId : arrSelectCategory[i],
//       //     type :'Related',
//       //     createdAt: Date.now()  
//       //   }).then(function(crt){
//       //     req.flash("info", "Related Category Added Successfully");
//       //     return res.redirect("/admin/category/addedit/"+categoryId);
//       //   })
//       // }     
//     }else{
//       req.flash("errors", "Please try again.");
//       return res.redirect("/admin/category/addedit/"+categoryId);
//     }
//   })
// }


// /**
// * Description: Categories add Up Sell
// * Developer:Susanta Kumar Das
// **/
// exports.addUpSellPro = async function(req,res){
//   var form = new multiparty.Form();
//   form.parse(req,async function (err, fields, files) {
//     var selectCategory = fields.selectCategory[0];
//     var arrSelectCategory = selectCategory.split(',');
//     var categoryId = fields.categoryId[0];
//     var storeId = fields.storeId[0];
//     if(selectCategory !='' && categoryId !=''){ 
//       for(var i=0;i < arrSelectCategory.length; i++){ 
//         models.relatedCategory.create({
//           categoryId:categoryId,
//           storeId:storeId,
//           selected_id : arrSelectCategory[i],
//           type :'Up-Sells',
//           createdAt: Date.now()  
//         }).then(function(crt){
//           req.flash("info", "Up-Sells Category Added Successfully");
//         return res.redirect("/admin/category/addedit/"+categoryId);
//         })
//       }     
//     }else{
//       req.flash("errors", "Please try again.");
//       return res.redirect("/admin/category/addedit/"+categoryId);
//     }
//   })
// }




// /**
// * Description: Categories add Cross Sells
// * Developer:Susanta Kumar Das
// **/
// exports.addCrossSellsPro = async function(req,res){
//   var form = new multiparty.Form();
//   form.parse(req,async function (err, fields, files) {
//     var selectCategory = fields.selectCategory[0];
//     var arrSelectCategory = selectCategory.split(',');
//     var categoryId = fields.categoryId[0];
//     var storeId = fields.storeId[0];
//     if(selectCategory !='' && categoryId !=''){ 
//       for(var i=0;i < arrSelectCategory.length; i++){ 
//         models.relatedCategory.create({
//           categoryId:categoryId,
//           storeId:storeId,
//           selected_id : arrSelectCategory[i],
//           type :'Cross-Sells',
//           createdAt: Date.now()  
//         }).then(function(crt){
//           req.flash("info", "Cross-Sells Category Added Successfully");
//         return res.redirect("/admin/category/addedit/"+categoryId);
//         })
//       }     
//     }else{
//       req.flash("errors", "Please try again.");
//       return res.redirect("/admin/category/addedit/"+categoryId);
//     }
//   })
// }





// /**
// * Description: Categories add Add on
// * Developer:Susanta Kumar Das
// **/
// exports.addAddonPro = async function(req,res){
//   var form = new multiparty.Form();
//   form.parse(req,async function (err, fields, files) {
//     var selectCategory = fields.selectCategory[0];
//     var arrSelectCategory = selectCategory.split(',');
//     var categoryId = fields.categoryId[0];
//     var storeId = fields.storeId[0];
//     if(selectCategory !='' && p_id !=''){ 
//       for(var i=0;i < arrSelectCategory.length; i++){ 
//         models.relatedCategory.create({
//           categoryId:categoryId,
//           storeId : arrSelectCategory[i],
//           type :'Add-on',
//           createdAt: Date.now()  
//         }).then(function(crt){
//           req.flash("info", "Add-on Category Added Successfully");
//         return res.redirect("/admin/category/addedit/"+categoryId);
//         })
//       }     
//     }else{
//       req.flash("errors", "Please try again.");
//       return res.redirect("/admin/category/addedit/"+categoryId);
//     }
//   })
// }




// /**
// * Description: Categories create/update
// * Developer:Susanta Kumar Das
// **/
// exports.configCategory = async function(req,res){
//   var form = new multiparty.Form();
//   form.parse(req,async function (err, fields, files) {
//     var org_category_id = fields.mailCategoryId[0];
//     var categoryDetals = await models.eventCategory.findOne({where:{id:org_category_id}});
//     var addOneCategory = await models.relatedCategory.findAll({where:{categoryId : org_category_id,type:"Add-on"}});
//     var conf_pro_size = JSON.parse(JSON.stringify(fields.conf_pro_size));
//     var conf_pro_price = JSON.parse(JSON.stringify(fields.conf_pro_price));
//     var conf_pro_sp_price =  JSON.parse(JSON.stringify(fields.conf_pro_sp_price));
//     var con_pro_status = JSON.parse(JSON.stringify(fields.con_pro_status));
//     var conf_category_id = JSON.parse(JSON.stringify(fields.conf_id));
//     for(var i=0; i < conf_pro_size.length; i++){
//       if(conf_category_id[i] ==''){
//         models.eventCategory.create({
//           title : categoryDetals.title,
//           sku : categoryDetals.sku,
//           shortDescription : categoryDetals.short_description,
//           description : categoryDetals.description,
//           keyword: categoryDetals.keyword,
//           price: conf_pro_price[i],
//           specialPrice: conf_pro_sp_price[i] ? conf_pro_sp_price[i] : null,
//           isConfigurable : categoryDetals.id,
//           size : conf_pro_size[i],
//           status : con_pro_status[i],
//           inventory : categoryDetals.inventory,
//           storeId : categoryDetals.storeId,
//           bestSellers : categoryDetals.best_sellers,
//           newArrivals: categoryDetals.new_arrivals,
//         }).then(function(crt){
//           if(addOneCategory.length > 0){
//             for(var i=0; i < addOneCategory.length; i++){
//               models.relatedCategory.create({
//                 categoryId : crt.id,
//                 selectedCategoryId : addOneCategory[i].selected_id,
//                 type: "Add-on"
//               })
//             }
//           }
//           req.flash("info", "Configurable Category Added Successfully");
//           return res.redirect("/admin/category/addedit/"+org_category_id);
//         })
//       }else{
//         models.eventCategory.update({
//           title : categoryDetals.title,
//           sku : categoryDetals.sku,
//           shortDescription : categoryDetals.short_description,
//           description : categoryDetals.description,
//           keyword: categoryDetals.keyword,
//           price: conf_pro_price[i],
//           specialPrice: conf_pro_sp_price[i] ? conf_pro_sp_price[i] : null,
//           isConfigurable : categoryDetals.id,
//           size : conf_pro_size[i],
//           status : con_pro_status[i],
//           inventory : categoryDetals.inventory,
//           storeId : categoryDetals.storeId,
//           bestSellers : categoryDetals.best_sellers,
//           newArrivals: categoryDetals.new_arrivals,
//         },{where:{id:conf_category_id[i],isConfigurable:org_category_id}}).then(function(upd){
//           req.flash("info", "Configurable Category Added Successfully");
//           return res.redirect("/admin/category/addedit/"+org_category_id);
//         })
//       }      
//     }
//   })
// }





// /**
// * Description: Categories create/update
// * Developer:Susanta Kumar Das
// **/
// exports.addcustomeOption = async function(req,res){
//   var form = new multiparty.Form();
//   form.parse(req,async function (err, fields, files) {
//     var value='';
//     var page_category_id = fields.page_category_id[0];
//     var page_option_id = fields.page_option_id ? fields.page_option_id[0] : '';
//     var option_title = fields.option_title[0];
//     var option_type = fields.option_type[0];
//     var is_required = fields.is_required[0];
//     var option_text_price = fields.option_text_price ? fields.option_text_price[0]:'';
//     var option_sel_title  = fields.option_sel_title ? fields.option_sel_title[0]:'';
//     var option_sel_price = fields.option_sel_price ? fields.option_sel_price[0]:'';
//     if(option_text_price !='' && option_text_price !=null){
//       value = { "title":"","price": option_text_price};      
//     }else{
//       value = { "title":option_sel_title,"price":option_sel_price}; 
//     }
//     if(!page_option_id){
//       models.option.create({
//         title : option_title,
//         type: option_type,
//         is_required : is_required
//       }).then(function(crt){
//           models.option_value.create({
//             option_id : crt.id,
//             value : JSON.stringify(value)
//           }).then(function(crt2){
//             models.option_category.create({
//               option_id : crt.id,
//               category_id : page_category_id
//             }) 
//           })         
//         })
//       req.flash("info", "Custom Option Added Successfully");
//       return res.redirect("/admin/category/addedit/"+page_category_id);
//     }else{
//       models.option.update({
//         title : option_title,
//         type: option_type,
//         is_required : is_required
//       },{where:{id: page_option_id}}).then(function(crt){
//           models.option_value.update({
//             option_id : page_option_id,
//             value : JSON.stringify(value)
//           },{where:{option_id:page_option_id}}).then(function(crt2){
//             models.option_category.update({
//               option_id : page_option_id,
//               category_id : page_category_id
//             },{where:{option_id:page_option_id}}) 
//           })         
//         })
//       req.flash("info", "Custom Option Updated Successfully");
//       return res.redirect("/admin/category/addedit/"+page_category_id);
//     }
    
//   });
// }





// /**
// * Description: Categories create/update
// * Developer:Susanta Kumar Das
// **/
// exports.deleteCustomeOption = async function(req,res){
//   var option_id = req.params.optionId;
//   if(option_id !=''){
//     models.option.destroy({where: { id: option_id }}).then(function(val){
//       models.option_value.destroy({where:{option_id: option_id}}).then(function(dst){
//         models.option_category.destroy({where:{option_id:option_id}});
//     })
//   })
//   req.flash("info", "Successfully Deleted");
//   res.redirect("back");
//   }
// }





// /**
// * Description: Categories create/update
// * Developer:Susanta Kumar Das
// **/
// exports.deleteConfigCategory = async function(req,res){
//   var categoryId = req.params.categoryId;
//   var confId = req.params.confId;
//   if(categoryId !='' || confId !=''){
//     models.category.destroy({where:{id:confId,is_configurable:categoryId}}).then(function(dst){
//       models.related_category.destroy({where:{p_id : confId}});
//         if(dst){
//           req.flash("info", "Configurable Category Successfully removed");
//           return res.redirect("/admin/category/addedit/"+categoryId);
//         }else{
//           req.flash("errors", "Something worng! Please try again.");
//           return res.redirect("/admin/category/addedit/"+categoryId);
//         }  
//     })
//   }else{
//     req.flash("errors", "Something worng! Please try again.");
//     return res.redirect("/admin/category/addedit/"+categoryId);
//   }
// }





// /**
// * Description: Categories create/update
// * Developer:Susanta Kumar Das
// **/
// exports.deleteCategory = async function(req,res){
//   var token= req.session.token;
//   // var sessionStoreId = req.session.user.storeId;
//   var sessionStoreId = 30;
//   // var role = req.session.role;
//   // //*****Permission Assign Start
//   // var userPermission='';
//   // if (sessionStoreId == null) {
//   //     userPermission=true;
//   // }else{
//   //     userPermission = !! req.session.permissions.find(permission => { 
//   //       return permission === 'CategoryDelete'
//   //   })
//   // }
//   // if(userPermission==false){
//   //     res.redirect('/admin/dashboard');
//   // }else{
//     //*****Permission Assign End

//     var id = req.params.id;
//     // models.eventCategory.destroy({where: { id: id, storeId: sessionStoreId }}).then(function(val){
//       models.eventCategory.destroy({where:{categoryId: id, storeId: sessionStoreId}}).then(function(val){
//       if(val){
//           // models.eventCategory.destroy({where:{categoryId: id, storeId: sessionStoreId}}).then(function(dst){
//           // models.eventCategory.destroy({where: { id: id, storeId: sessionStoreId }}).then(function(dst){
//             models.eventCategory.destroy({where: { id: id, storeId: sessionStoreId }})
//             models.relatedCategory.destroy({where:{categoryId:id}});
//             models.categoryImages.destroy({where:{categoryId:id}});
//             models.favouriteCategory.destroy({where:{categoryId:id}});
//             models.carts.destroy({where:{categoryId:id}});
//         // })

//         req.flash("info", "Successfully Deleted");
//         // res.redirect("back");
//         return res.redirect("/admin/category/");
//       }else{
//         req.flash('errors','Something went wrong');
//         // res.redirect('back');
//         return res.redirect("/admin/category/");
//       }
//     })
//   //   req.flash("info", "Successfully Deleted");
//   //   // res.redirect("back");
//   //   return res.redirect("/admin/category/");
//   // }
// }





// /**
// * Description: Categories create/update
// * Developer:Susanta Kumar Das
// **/
// function unflatten(arr) {
//   var tree = [],
//     mappedArr = {},
//     arrElem,
//     mappedElem;

//   // First map the nodes of the array to an object -> create a hash table.
//   for (var i = 0, len = arr.length; i < len; i++) {
//     arrElem = arr[i];
//     mappedArr[arrElem.id] = arrElem;
//     mappedArr[arrElem.id]['subs'] = [];
//   }
//   for (var id in mappedArr) {
//     if (mappedArr.hasOwnProperty(id)) {
//       mappedElem = mappedArr[id];
//       // If the element is not at the root level, add it to its parent array of subs.
//       if (mappedElem.parent) {
//         mappedArr[mappedElem['parent']]['subs'].push(mappedElem);
//       }
//       // If the element is at the root level, add it to first level elements array.
//       else {
//         tree.push(mappedElem);
//       }
//     }
//   }
//   return tree;
// }



// exports.downloadReport = async function (req, res, next) {

//   var sessionStoreId = req.session.user.storeId;
//   var sessionUserId = req.session.user.id;
//   var role = req.session.role;

//   var workbook = new Excel.Workbook();

//   workbook.creator = 'Me';
//   workbook.lastModifiedBy = 'Her';
//   workbook.created = new Date(1985, 8, 30);
//   workbook.modified = new Date();
//   workbook.lastPrinted = new Date(2016, 9, 27);
//   workbook.properties.date1904 = true;

//   workbook.views = [
//       {
//           x: 0, y: 0, width: 10000, height: 20000,
//           firstSheet: 0, activeTab: 1, visibility: 'visible'
//       }
//   ];

//   var worksheet = workbook.addWorksheet('My Sheet');
//   worksheet.columns = [
//       { header: 'Category name', key: 'proName', width: 10 },
//       //{ header: 'Quantity', key: 'qty', width: 10 },
      
//       { header: 'orderbook-qty', key: 'orderBookqty', width: 10 },
//       { header: 'stock review-qty', key: 'stockReviewqty', width: 10 },
//       { header: 'stock return', key: 'stockReturn', width: 10 },
//       { header: 'Sample', key: 'sample', width: 10 },
              
//   ];


//   var sessionStoreId = req.session.user.storeId;
//   var form = new multiparty.Form();
//   form.parse(req, async function(err, fields, files) {

//   var category = await models.eventCategory.findAll({attributes:['id','title','price'] });

      
//     for(var i=0;i<category.length;i++){
//       var pid = category[i].id;

//           //var orderBook = await models.orderBook.findAll({attributes:['categoryId','quantity'], where:{categoryId:pid} });
//          /*var sum=0;
//            for(var j=0; j<orderBook.length; j++){
//               var quantity =orderBook[j].quantity;
//               sum=sum+quantity;
//             }*/
//             var orderbookid='';
//             var orderBook = await models.orderBook.findAll({attributes:[ [sequelize.fn('sum', sequelize.col('quantity')), 'total_quantity'] ], where:{categoryId:pid} });
//            /* for(var j=0; j<orderBook.length; j++){
//             var orderbookid = orderBook[j].categoryId;
//             }*/
//           //console.log(orderBook[0].dataValues.total_quantity);return false;

//           var stockReview = await models.stockReview.findAll({attributes:[ [sequelize.fn('sum', sequelize.col('quantity')), 'total_reviewquantity'] ], where:{categoryId:pid},
//                            /* include:[{
//                               model:models.orderBook,
//                               attributes:['categoryId'],
//                               where:{
//                                 categoryId :categoryId
//                               }
//                             }] */
//                           });
//           //console.log(stockReview[0].dataValues.total_reviewquantity);return false;


//         var stockReturn = await models.stockReturn.findAll({attributes:[ [sequelize.fn('sum', sequelize.col('quantity')), 'total_returnquantity'] ], where:{categoryId:pid},});
//     //console.log(stockReturn[0].dataValues.total_returnquantity);return false;

//         var sample = await models.sample.findAll({attributes:[ [sequelize.fn('sum', sequelize.col('quantity')), 'total_sample'] ], where:{categoryId:pid},});
//         //console.log(sample[0].dataValues.total_sample);return false;

//           worksheet.addRow({
//               SlNo  : i+1,
//               proName : category[i].title,
//               orderBookqty     :orderBook[0].dataValues.total_quantity==null?'0':orderBook[0].dataValues.total_quantity,
//               stockReviewqty   :stockReview[0].dataValues.total_reviewquantity==null?'0':stockReview[0].dataValues.total_reviewquantity,
//               stockReturn   :stockReturn[0].dataValues.total_returnquantity==null?'0':stockReturn[0].dataValues.total_returnnquantity,
//               sample        :sample[0].dataValues.total_sample==null?'0':sample[0].dataValues.total_sample,


//           })

//       }
          
//           res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//           res.setHeader("Content-Disposition", "attachment; filename=" + "Category Report.csv");
//           workbook.csv.write(res)
//           .then(function (data) {
//               res.end();
//               console.log('File write done........');
//           });
//   });   
  
 
      
// };


// exports.categoryStatusChange = function(req, res, next) {
//   var id = req.params.id;
//   // var sessionStoreId = req.session.user.storeId;
//   var sessionStoreId = 30;
//   var orderStatusData = req.params.data;
//   console.log(id);
//   // return res.send(orderStatusData);
//   // console.log(orderStatusData);
//   if(!id){
//       res.status(200).send({ status:205, message: "Id not found" });
//   }else{
     
//     models.eventCategory.update({
//       status:orderStatusData,
//     },{where:{id:id,storeId:sessionStoreId}})
        
//   }
//     // window.location.href = window.location.href;
//     // window.location.reload();
//     // res.redirect('back');
//     return res.redirect("/admin/categories");

// }