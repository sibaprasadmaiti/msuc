var models = require("../../models");
var bcrypt = require("bcrypt-nodejs");
var cookieParser = require("cookie-parser");
var flash = require("connect-flash");
var formidable = require("formidable");
var multiparty = require("multiparty");
var bodyParser = require("body-parser");
const Excel = require("exceljs");
var fetch = require("node-fetch");
var jwt = require("jsonwebtoken");
var helper = require('../../helpers/helper_functions');
var SECRET = "nodescratch";
const paginate = require("express-paginate");
var config = require("../../config/config.json");
var Sequelize = require("sequelize");
var sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: "localhost",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  }
);
/**
* Description: Category lists
* Developer:Avijit Das
**/
exports.loadPage = async  function(req,res){
  var token= req.session.token;
  // var sessionCid = req.session.user.cid;
  var sessionUserId = req.session.user.id;
  jwt.verify(token, SECRET, async function(err, decoded) {
    if (err) {
      req.flash("info", "Invalid Token");
      res.redirect('/auth/signin');
    } else {

      //*****Permission Assign Start
      var userPermission='';
      // userPermission = !! req.session.permissions.find(permission => { 
      //     return permission === 'CategoryList'
      // })
      // if(userPermission==false){
      //   req.flash('errors','Contact Your administrator for permission');
      //     res.redirect('/admin/dashboard');
      // }else{
      //*****Permission Assign End

      var selectCatId = req.params.id;
      var selectCategoryDetails ='';
      var productListCatWise ='';
      var tree='';
      
        var treeForDropDown='';
        if(selectCatId !='' && selectCatId !=null){
          selectCategoryDetails = await models.categories.findOne({where:{id:selectCatId}});//console.log(selectCategoryDetails);return false;
        }
        var categoryDetails = await models.categories.findAll({
          where:{
            // cid:sessionCid
          },
          order: [
            // ['cid', 'ASC'],
            ['position', 'ASC'],
          ]
        });
        var arr=[];
        var arrdropdown =[];
        arrdropdown.push({
          "id":"0",
          // "cid":"",
          "title":"Select Parent Category",
          "parent":""
        });
        categoryDetails.forEach(function (cat) {
          arr.push({
            "id": cat.id,
            // "cid": cat.cid,
            "text": cat.title,
            "parent": cat.parentCategoryId,
            "href" : req.app.locals.baseurl+'admin/categories/'+cat.id
          });
          arrdropdown.push({
            "id": cat.id,
            // "cid": cat.cid,
            "title": cat.title,
            "parent": cat.parentCategoryId
          });
        })
        tree = unflatten(arr);
        treeForDropDown = unflattenDRP(arrdropdown);
        // console.log('loooooooooooooooooo==>',selectCategoryDetails);
        if(selectCategoryDetails){

          //*****Permission Assign Start
          var userPermission='';
          // userPermission = !! req.session.permissions.find(permission => { 
          //     return permission === 'CategoryAdd'
          // })
          // if(userPermission==false){
          //     req.flash('errors','Contact Your administrator for permission');
          //     res.redirect('/admin/dashboard');
          // }else{
          //*****Permission Assign End
            return res.render("admin/categories/addedit", {
              title: "Menu",
              arrCategoryDetails : categoryDetails,
              arrSelectCategoryDetails: selectCategoryDetails,
              arrProductListCatWise : productListCatWise,
              arrTree : JSON.stringify(tree, null, " "),
              arrtreeForDropDown : JSON.stringify(treeForDropDown, null, " "),
              helper : helper,
              messages: req.flash("info"),
              errors: req.flash("errors")
            })
          // }
        } else {
          return res.render("admin/categories/addedit", {
            title: "Menu",
            arrCategoryDetails : categoryDetails,
            arrSelectCategoryDetails: '',
            arrProductListCatWise:'',
            arrTree : JSON.stringify(tree, null, " "),
            arrtreeForDropDown : JSON.stringify(treeForDropDown, null, " "),
            helper : helper,
            messages: req.flash("info"),
            errors: req.flash("errors")
          })
        }
      // }
    }
  });
}
/**
* Description: Category Status Change
* Developer:Susanta Kumar Das
**/
exports.statusChange = async function(req,res){
  var token= req.session.token;
  jwt.verify(token, SECRET, function(err, decoded) {
    if(err){
      req.flash("info", "Invalid Token");
      res.redirect('/auth/signin');
    } else {
      var categoryId = req.body.categoryId;
      var statusValue = req.body.statusValue;
      if(categoryId !='' && statusValue !=''){
        models.categories.update({
          status : statusValue
        },{where:{id:categoryId}}).then(function(upd){
          if(upd){
            req.flash("info", "Status Successfully Changed");
            return res.status(200).send({status:true,messages:"Status Successfully Changed"});
          }
        }).catch(function(error) {
          return res.send(error);
        });
      } else {
        req.flash("info", "Id: "+categoryId+" value: "+statusValue+" not found");
        return res.status(200).send({status:false,messages:"Id: "+categoryId+" value: "+statusValue+" not found"});
      }
    }
  });
}
/**
* Description: Category Include Menu Change
* Developer:Susanta Kumar Das
**/
exports.includeMenuChange = async function(req,res){
  var token= req.session.token;
  jwt.verify(token, SECRET, function(err, decoded) {
    if(err){
      req.flash("info", "Invalid Token");
      res.redirect('/auth/signin');
    } else {
      var categoryId = req.body.categoryId;
      var statusValue = req.body.statusValue;
      if(categoryId !='' && statusValue !=''){
        models.categories.update({
          includeInMenu : statusValue
        },{where:{id:categoryId}}).then(function(upd){
          if(upd){
            req.flash("info", "Include Menu Successfully Changed");
            return res.status(200).send({status:false,messages:"Include Menu Successfully Changed"});
          }
        }).catch(function(error) {
          return res.send(error);
        });
      } else {
        req.flash("info", "Id: "+categoryId+" value: "+statusValue+" not found");
        return res.status(200).send({status:false,messages:"Id: "+categoryId+" value: "+statusValue+" not found"});
      }
    }
  });
}
/**
* Description: Category Include Footer Change
* Developer:Susanta Kumar Das
**/
exports.includeFooterChange = async function(req,res){
  var token= req.session.token;
  jwt.verify(token, SECRET, function(err, decoded) {
    if(err){
      req.flash("info", "Invalid Token");
      res.redirect('/auth/signin');
    } else {
      var categoryId = req.body.categoryId;
      var statusValue = req.body.statusValue;
      if(categoryId !='' && statusValue !=''){
        models.categories.update({
          includeInFooter : statusValue
        },{where:{id:categoryId}}).then(function(upd){
          if(upd){
            req.flash("info", "Include Menu Successfully Changed");
            return res.status(200).send({status:false,messages:"Include Menu Successfully Changed"});
          }
        }).catch(function(error) {
          return res.send(error);
        });
      } else {
        req.flash("info", "Id: "+categoryId+" value: "+statusValue+" not found");
        return res.status(200).send({status:false,messages:"Id: "+categoryId+" value: "+statusValue+" not found"});
      }
    }
  });
}
/**
* Description: Category Include Home Change
* Developer:Susanta Kumar Das
**/
exports.includeHomeChange = async function(req,res){
  var token= req.session.token;
  jwt.verify(token, SECRET, function(err, decoded) {
    if(err){
      req.flash("info", "Invalid Token");
      res.redirect('/auth/signin');
    } else {
      var categoryId = req.body.categoryId;
      var statusValue = req.body.statusValue;
      if(categoryId !='' && statusValue !=''){
        models.categories.update({
          includeInHome : statusValue
        },{where:{id:categoryId}}).then(function(upd){
          if(upd){
            req.flash("info", "Include Menu Successfully Changed");
            return res.status(200).send({status:false,messages:"Include Menu Successfully Changed"});
          }
        }).catch(function(error) {
          return res.send(error);
        });
      } else {
        req.flash("info", "Id: "+categoryId+" value: "+statusValue+" not found");
        return res.status(200).send({status:false,messages:"Id: "+categoryId+" value: "+statusValue+" not found"});
      }
    }
  });
}
/**
* Description: Category Include Anchor Change
* Developer:Susanta Kumar Das
**/
exports.includeAnchorChange = async function(req,res){
  var token= req.session.token;
  jwt.verify(token, SECRET, function(err, decoded) {
    if(err){
      req.flash("info", "Invalid Token");
      res.redirect('/auth/signin');
    } else {
      var categoryId = req.body.categoryId;
      var statusValue = req.body.statusValue;
      if(categoryId !='' && statusValue !=''){
        models.categories.update({
          anchor : statusValue
        },{where:{id:categoryId}}).then(function(upd){
          if(upd){
            req.flash("info", "Include Menu Successfully Changed");
            return res.status(200).send({status:false,messages:"Include Menu Successfully Changed"});
          }
        }).catch(function(error) {
          return res.send(error);
        });
      } else {
        req.flash("info", "Id: "+categoryId+" value: "+statusValue+" not found");
        return res.status(200).send({status:false,messages:"Id: "+categoryId+" value: "+statusValue+" not found"});
      }
    }
  });
}
/**
* Description: Category Add/Update Content Details
* Developer:Susanta Kumar Das
**/
exports.contentAdd = async function(req,res){
  var token= req.session.token;
  jwt.verify(token, SECRET, function(err, decoded) {
    if(err){
      req.flash("info", "Invalid Token");
      res.redirect('/auth/signin');
    } else {
      var form = new multiparty.Form();
      form.parse(req,async function(err, fields, files) {
        var categoryId = fields.contentCategory[0];
        if(categoryId !='' && categoryId !=null){
          // if(files.image[0].originalFilename !='' && files.image[0].originalFilename != null){
          //   var catImage = Date.now()+files.image[0].originalFilename;
          //   var ImageExt = catImage.split('.').pop();
          //   var catImagewithEXT = Date.now()+files.image[0]+"."+ImageExt;
          //   var userFinalImage = catImagewithEXT.replace("[object Object]", "");
          // }  
          //var slug = fields.name.toString().toLowerCase().replace(/\s+/g, '-');
          // console.log("fields.position[0]",fields.position[0]);
          const storeId=58;
          models.categories.update({
            //slug : slug,
            title: fields.name[0],
            storeId: storeId,//fields.editStoreId[0],
            position: fields.position[0] ? fields.position[0] : null,
            parentCategoryId: fields.editParentCategoryId[0] ? fields.editParentCategoryId[0] : null,
            // description : fields.description[0],
            status : fields.status[0]

          },{where:{id:categoryId}}).then(async function(udt){
            // if(files.image[0].originalFilename !='' && files.image[0].originalFilename != null){
            //   helper.createDirectory('public/admin/category/'+categoryId); 
            //   var tempPath = files.image[0].path;
            //   var fileName = userFinalImage;
            //   var targetPath = categoryId+"/"+fileName;
            //   helper.uploadCategoryFiles(tempPath, targetPath); 
            //   var cat = await models.categories.findOne({where:{id:categoryId}});
            //   var oldIcon = cat.image;
            //   models.categories.update({
            //     image   : userFinalImage  ? userFinalImage : oldIcon,
            //   },{where:{id:categoryId}});                      
            // }        
            req.flash('info','Content Successfully Updated');
            return res.redirect('/admin/categories/'+categoryId);
          }).catch(function(error) {
            req.flash('info',error);
            return res.redirect('/admin/categories/'+categoryId);
          });
        }
      });
    }
  });
}
/**
* Description: Category Add/Update SEO Details
* Developer:Susanta Kumar Das
**/
exports.addSEO = async function(req,res){
  var token= req.session.token;
  jwt.verify(token, SECRET, function(err, decoded) {
    if(err){
      req.flash("info", "Invalid Token");
      res.redirect('/auth/signin');
    } else {
      var form = new multiparty.Form();
      form.parse(req,async function(err, fields, files) {
        var categoryId = fields.seoCategory[0];
        var userFinalMetaImage='';
        if(categoryId != '' && categoryId != null){
        var cat = await models.categories.findOne({attributes:['metaImage'],where:{id:categoryId}});
          if(files.metaImage[0].originalFilename !='' && files.metaImage[0].originalFilename != null){
            var catMetaImage = Date.now()+files.metaImage[0].originalFilename;
            var ImageExt = catMetaImage.split('.').pop();
            var catMetaImagewithEXT = Date.now()+files.metaImage[0]+"."+ImageExt;
            userFinalMetaImage = catMetaImagewithEXT.replace("[object Object]", "");
            helper.createDirectory('public/admin/category/metaimage/'+categoryId); 
            var tempPath = files.metaImage[0].path;
            var fileName = userFinalMetaImage;
            var targetPath = "metaimage/"+categoryId+"/"+fileName;
            helper.uploadCategoryFiles(tempPath, targetPath); 
          }  
          var oldMetaImage = cat.metaImage;
          models.categories.update({
            metaTitle : fields.metaTitle[0],
            metaKey : fields.metaKey[0],
            metaDescription : fields.metaDescription[0],
            metaImage : userFinalMetaImage!='' ? userFinalMetaImage : oldMetaImage,
          },{where:{id:categoryId}}).then(function(upd){
            req.flash('info','SEO Successfully Updated');
            return res.redirect('/admin/categories/'+categoryId);
          }).catch(function(error) {
            req.flash('info',error);
            return res.redirect('/admin/categories/'+categoryId);
          });
        }
      })
    }
  });
}
/**
* Description: Category Add
* Developer:Susanta Kumar Das
**/
exports.saveNew = async function(req,res){//console.log("asd"+req.fields);return false;
  var token= req.session.token;
  jwt.verify(token, SECRET, function(err, decoded) {
    if(err){
      req.flash("info", "Invalid Token");
      res.redirect('/auth/signin');
    } else {
      // var companyId =models.company.findOne({attributes:['id']});//console.log(companyId);return false;
      var form = new multiparty.Form();
      form.parse(req,async function(err, fields, files) {
        var newCategoryName = fields.catName[0];
        // var sessionCid = req.session.user.cid;
        var sessionUserId = req.session.user.id;
        var slugName = fields.catSlug[0];
        var currentCategoryId = fields.currentCategoryId[0];
        if(newCategoryName !=''){
          models.categories.create({
            // cid: sessionCid,
            title: newCategoryName,
            slug : slugName,
            position : fields.position[0],
            parentCategoryId : currentCategoryId ? currentCategoryId : null,
            createdAt : Date.now(),
          }).then(function(crt){
            if(crt){
              req.flash('info','Successfully Created');
              return res.redirect('/admin/categories');
            }
          }).catch(function(error) {
            req.flash('info',error);
            return res.redirect('/admin/categories/'+categoryId);
          });
        } else {
          req.flash('errors','Category name is required!');
          return res.redirect('/admin/categories');
        }
      })
    }
  });
}
/**
* Description: Category Add/Update Other Details
* Developer:Susanta Kumar Das
**/
exports.addOther = async function(req,res){
  var token= req.session.token;
  jwt.verify(token, SECRET, function(err, decoded) {
    if(err){
      req.flash("info", "Invalid Token");
      res.redirect('/auth/signin');
    } else {
      var form = new multiparty.Form();
      form.parse(req,async function(err, fields, files) {
        var categoryId = fields.otCategory[0];
        if(categoryId!=''){
          models.categories.update({
            url : fields.url[0]
          },{where:{id:categoryId}}).then(function(crt){
            if(crt){
              req.flash('info','Successfully Upadted');
              return res.redirect('/admin/categories/'+categoryId);
            }
          }).catch(function(error) {
            req.flash('info',error);
            return res.redirect('/admin/categories/'+categoryId);
          });
        } else {
          models.categories.create({
            url : fields.url[0]
          }).then(function(crt){
            if(crt){
              req.flash('info','Successfully Created');
              return res.redirect('/admin/categories');
            }
          }).catch(function(error) {
            req.flash('info',error);
            return res.redirect('/admin/categories');
          });
        }
      })
    }
  });
}
/**
* Description: Category Unflatten Tree Details
* Developer:Susanta Kumar Das
**/
function unflatten(arr) {
  var tree = [], mappedArr = {}, arrElem, mappedElem;
  // First map the nodes of the array to an object -> create a hash table.
  for (var i = 0, len = arr.length; i < len; i++) {
    arrElem = arr[i];
    mappedArr[arrElem.id] = arrElem;
    mappedArr[arrElem.id]['nodes'] = [];
  }
  for (var id in mappedArr) {
    if (mappedArr.hasOwnProperty(id)) {
      mappedElem = mappedArr[id];
      // If the element is not at the root level, add it to its parent array of nodes.
      if (mappedElem.parent) {
        mappedArr[mappedElem['parent']]['nodes'].push(mappedElem);
      }
      // If the element is at the root level, add it to first level elements array.
      else {
        tree.push(mappedElem);
      }
    }
  }
  //console.log(JSON.stringify(tree, null, " "));
  return tree;
}
/**
* Description: Category Unflatten DRP Tree Details
* Developer:Susanta Kumar Das
**/
function unflattenDRP(arrdropdown) {
  var tree = [], mappedArr = {}, arrElem, mappedElem;
  // First map the nodes of the array to an object -> create a hash table.
  for (var i = 0, len = arrdropdown.length; i < len; i++) {
    arrElem = arrdropdown[i];
    mappedArr[arrElem.id] = arrElem;
    mappedArr[arrElem.id]['subs'] = [];
  }
  for (var id in mappedArr) {
    if (mappedArr.hasOwnProperty(id)) {
      mappedElem = mappedArr[id];
      // If the element is not at the root level, add it to its parent array of nodes.
      if (mappedElem.parent) {
        mappedArr[mappedElem['parent']]['subs'].push(mappedElem);
      }
      // If the element is at the root level, add it to first level elements array.
      else {
        tree.push(mappedElem);
      }
    }
  }
  //console.log(JSON.stringify(tree, null, " "));
  return tree;
}