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
const Op = Sequelize.Op;
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
            idle: 10000
        }
    }
);
/**
* Description: Category lists
* Developer:Surajit Dowary 
**/

exports.categoryList = async function (req, res, next) {
    var sessionStoreId = req.session.user.storeId;
    var role = req.session.role;
    var token = req.session.token;

    let column = req.query.column || 'id';
    let order = req.query.order || 'ASC';
    let pagesizes = req.query.pagesize || 10;
    let pageSize = parseInt(pagesizes);
    let page = req.params.page || 1;
    let search = req.query.search || '';
    jwt.verify(token, SECRET, async function (err, decoded) {
        if (err) {
            req.flash("info", "Invalid Token");
            res.redirect('/auth/signin');
        } else {
            let categoryList = await models.eventCategory.findAll({
                where: {
                  [Op.or]: [
                    { categoryType: { [Op.like]: `%${search}%` } },
                    { categoryName: { [Op.like]: `%${search}%` } },
                    { status: { [Op.like]: `%${search}%` } }
                  ]
                }, order: [[column, order]], limit: pageSize, offset: (page - 1) * pageSize
            });
      
      
            let pageCount = Math.ceil(categoryList.length / pageSize);
      
            if (categoryList) {
                return res.render('admin/category/list', {
                  title: 'Category List',
                  arrData: categoryList,
                  sessionStoreId: '',
                  listCount: categoryList.length,
                  pageCount: pageCount,
                  columnName: column,
                  orderType: order,
                  searchItem: search,
                  pageSize: pageSize,
                  currentPage: parseInt(page),
                  messages: req.flash('info'),
                  errors: req.flash('errors'),
                  helper: helper,
                });
            } else {
                return res.render('admin/category/list', {
                  title: 'Category List',
                  arrData: '',
                  sessionStoreId: '',
                  messages: req.flash('info'),
                  errors: req.flash('errors'),
                  helper: helper,
                });
            }
        }
    });
}

exports.addeditCategory = async function (req, res, next) {
    var sessionStoreId = req.session.user.storeId;
    var id = req.params.id>0?req.params.id:'';
    var existingItem = null;
    const parentCategory = await models.eventCategory.findAll({ where: { categoryType: 'parent' } });
    if (!id) {
        return res.render('admin/category/addedit', {
            title: 'Add Category',
            messages: req.flash('info'),
            arrData: '',
            errors: '',
            helper: helper,
            parentCategory: parentCategory
        });
    } else {
        existingItem = models.eventCategory.findOne({ where: { id: id, storeId: 58 } });
        existingItem.then(function (value) {
            return res.render('admin/category/addedit', {
                title: 'Edit Category',
                messages: req.flash('info'),
                arrData: value,
                errors: '',
                helper: helper,
                parentCategory: parentCategory
            });
        });
    }
};

exports.addCategory = function (req, res, next) {
    var sessionStoreId = req.session.user.storeId;
    var d = new Date();
    var n = d.getTime();
    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
        console.log(fields);
        var id = fields.update_id[0]>0?fields.update_id[0]:'';
        var logdetails = req.session.user
        var slug = fields.title[0].toString().toLowerCase().replace(/\s+/g, '-');
        if (fields.sequence[0] != "" && fields.sequence[0] != null) {
            var sequence = fields.sequence[0];
        } else {
            var sequence = null;
        }

        if (!id) {
            models.eventCategory.create({
                storeId: 58,
                categoryType: fields.categoryType ? fields.categoryType[0] : null,
                parent_id: fields.parent_id ? fields.parent_id[0] : null,
                categoryName: fields.title ? fields.title[0] : null,
                status: fields.status ? fields.status[0] : null,
                description: fields.description ? fields.description[0] : null,
                createdBy: logdetails ? logdetails.id : null,
                sequence: sequence,
                slag: slug
            }).then(function (categroies) {

                if (categroies) {
                    //   if (files.image[0].originalFilename != '' && files.image[0].originalFilename != null) {
                    //       var categroiesImage = Date.now() + files.image[0].originalFilename;
                    //       var ImageExt = categroiesImage.split('.').pop();
                    //       var categoryImageWithEXT = Date.now() + files.image[0] + "." + ImageExt;
                    //       var finalCategoryImage = categoryImageWithEXT.replace("[object Object]", "");
                    //       // helper.createDirectory('public/admin/brands/' + value.id);
                    //       helper.createDirectory('public/admin/category/'+categroies.id);
                    //       var tempPath = files.image[0].path;
                    //       var fileName = finalCategoryImage;
                    //       // var targetPath = value.id + "/" + fileName;
                    //       var targetPath = fileName;
                    //       helper.uploadCategoryImageFiles(tempPath, targetPath, categroies.id);
                    //   }

                    models.eventCategory.update({
                        //   image: finalCategoryImage
                    }, { where: { id: categroies.id } }).then(function (val) {
                        if (val) {
                            req.flash('info', 'Successfully Created');
                            return res.redirect('/admin/category/1');
                        }
                    }).catch(function (error) {
                        req.flash('errors', 'Something went wrong');
                    });

                    // req.flash('info','Successfully Created');	  
                    // res.redirect('/admin/salesman');
                } else {
                    req.flash('errors', 'Something went wrong');
                }
            })
                .catch(function (error) {
                    return res.send(error);
                });
        } else {

            //   var categroiesImage = models.eventCategory.findOne({ attributes: ['image'], where: { id: id } });
            //   if (files.image[0].originalFilename != '' && files.image[0].originalFilename != null) {
            //       var categroiesImage = Date.now() + files.image[0].originalFilename;
            //       var ImageExt = categroiesImage.split('.').pop();
            //       var categoryImageWithEXT = Date.now() + files.image[0] + "." + ImageExt;
            //       var finalCategoryImage = categoryImageWithEXT.replace("[object Object]", "");
            //       // helper.createDirectory('public/admin/brands/' + id);
            //       helper.createDirectory('public/admin/category/'+id+'/');
            //       var tempPath = files.image[0].path;
            //       var fileName = finalCategoryImage;
            //       // var targetPath = id + "/" + fileName;
            //       var targetPath = fileName;
            //       helper.uploadCategoryImageFiles(tempPath, targetPath, id);
            //   }
            //   var oldCategoryImage = categroiesImage.image;

            models.eventCategory.update({
                categoryType: fields.categoryType ? fields.categoryType[0] : null,
                parent_id: fields.parent_id ? fields.parent_id[0] : null,
                categoryName: fields.title ? fields.title[0] : null,
                status: fields.status ? fields.status[0] : null,
                description: fields.description ? fields.description[0] : null,
                updatedBy: logdetails ? logdetails.id : null,
                sequence: sequence,
                slag: slug
                // image: finalCategoryImage != '' ? finalCategoryImage : oldCategoryImage
            }, { where: { id: id } }).then(function (categroies) {
                req.flash('info', 'Successfully Updated');
                res.redirect('/admin/category/1');
            })
                .catch(function (error) {
                    return res.send(error);
                });
        }
    });
};

exports.deleteCategory = async function (req, res, next) {

    var id = req.params.id;
    //   var sessionStoreId = req.session.user.storeId; 

    console.log(id + "------------------------------qqqq")

    // var productCategory = models.productCategory.findAll({ where: { categoryId: id } });
    // const productCategory = await sequelize.query("SELECT * FROM `productCategory`  WHERE categoryId = "+id+" ORDER BY `productCategory`.`categoryId`  DESC",{ type: Sequelize.QueryTypes.SELECT });
    const productCategory = await models.productCategory.findAll({ where: { categoryId: id } })
    console.log(productCategory.length + "------------------------------productCategory")

    if (productCategory.length > 0) {
        for (var i = 0; i < productCategory.length; i++) {
            if (productCategory[i].productId && productCategory[i].productId != null && productCategory[i].productId != '') {
                console.log(productCategory[i].productId + "------------------------------productCategory[i].productId")
                models.products.destroy({
                    where: { id: productCategory[i].productId }
                })

                models.productImages.destroy({
                    where: { productId: productCategory[i].productId }
                })

            }
            if (Number(i + 1) == Number(productCategory.length)) {
                console.log(productCategory.length + "------------------------------pproductCategory.length")
                console.log(Number(i + 1) + "------------------------------Number(i+1)")
                models.productCategory.destroy({
                    where: { categoryId: id }
                })

                models.eventCategory.destroy({
                    where: { id: id }
                }).then(function (value) {
                    req.flash('info', 'Successfully Deleted');
                    res.redirect('back');
                });
            }
        }
    } else {
        models.eventCategory.destroy({
            where: { id: id }
        }).then(function (value) {
            req.flash('info', 'Successfully Deleted');
            res.redirect('back');
        });
    }
};