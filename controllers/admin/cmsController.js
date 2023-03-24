let models = require('../../models');
let passport = require('passport');
let bcrypt = require('bcrypt-nodejs');
let cookieParser = require('cookie-parser');
let flash = require('connect-flash');
let formidable = require('formidable');
let multiparty = require('multiparty');
let bodyParser = require('body-parser');
let fetch = require('node-fetch');
let jwt = require('jsonwebtoken');
let SECRET = 'nodescratch';
const paginate = require('express-paginate');
const Sequelize = require("sequelize");
const Op = Sequelize.Op
var helper = require('../../helpers/helper_functions');
var fs = require("fs"); 
/**
 * This function is developed for listing About us
 * Developer: Partha Mandal
 */
exports.list = async (req, res) => {
    let token = req.session.token;
    let sessionStoreId = req.session.user.storeId;
    let role = req.session.role;
    jwt.verify(token, SECRET, async (err, decoded) => {
        if (err) {
            req.flash("info", "Invalid Token");
            res.redirect('/auth/signin');
        } else {
            if (sessionStoreId == null || sessionStoreId == '') {
                let storeList = await models.stores.findAll({ attributes: ['id', 'storeName'] });
                let column = req.query.column || 'id';
                let order = req.query.order || 'ASC';
                let pagesizes = req.query.pagesize || 10;
                let pageSize = parseInt(pagesizes);
                let page = req.params.page || 1;
                let search = req.query.search || '';
                let cmsList = await models.cms.findAll({
                    attributes: ['id', 'storeId', 'slug', 'title', 'status'], where: {
                        [Op.or]: [
                            { title: { [Op.like]: `%${search}%` } },
                            { status: { [Op.like]: `%${search}%` } }
                        ]
                    }, order: [[column, order]], limit: pageSize, offset: (page - 1) * pageSize
                });
                let listCount = await models.cms.count({
                    where: {
                        [Op.or]: [
                            { title: { [Op.like]: `%${search}%` } },
                            { status: { [Op.like]: `%${search}%` } }
                        ]
                    }
                });
                let pageCount = Math.ceil(listCount / pageSize);
                if (cmsList) {
                    return res.render('admin/cms/list', {
                        title: 'Cms master List',
                        arrData: cmsList,
                        sessionStoreId: '',
                        storeList: storeList,
                        listCount: listCount,
                        pageCount: pageCount,
                        columnName: column,
                        orderType: order,
                        searchItem: search,
                        pageSize: pageSize,
                        currentPage: parseInt(page),
                        messages: req.flash('info'),
                        errors: req.flash('errors'),
                    });
                } else {
                    return res.render('admin/cms/list', {
                        title: 'Cms master List',
                        arrData: '',
                        storeList: '',
                        sessionStoreId: '',
                        messages: req.flash('info'),
                        errors: req.flash('errors'),
                    });
                }
            } else {
                //*****Permission Assign Start
                let userPermission = false;
                if (role == 'admin') {
                    userPermission = true;
                } else {
                    userPermission = !!req.session.permissions.find(permission => {
                        return permission === 'AboutUsList'
                    })
                }
                if (userPermission == false) {
                    req.flash('errors', 'Contact Your administrator for permission');
                    res.redirect('/admin/dashboard');
                } else {
                    let storeList = await models.stores.findAll({ attributes: ['id', 'storeName'], where: { id: sessionStoreId } });
                    let column = req.query.column || 'id';
                    let order = req.query.order || 'ASC';
                    let pagesizes = req.query.pagesize || 10;
                    let pageSize = parseInt(pagesizes);
                    let page = req.params.page || 1;
                    let search = req.query.search || '';
                    let cmsList = await models.cms.findAll({
                        attributes: ['id', 'storeId', 'title', 'slug', 'status'], order: [[column, order]], where: {
                            storeId: sessionStoreId, [Op.or]: [
                                { title: { [Op.like]: `%${search}%` } },
                                { status: { [Op.like]: `%${search}%` } }
                            ]
                        }, limit: pageSize, offset: (page - 1) * pageSize
                    });

                    let listCount = await models.cms.count({
                        where: {
                            storeId: sessionStoreId, [Op.or]: [
                                { title: { [Op.like]: `%${search}%` } },
                                { status: { [Op.like]: `%${search}%` } }
                            ]
                        }
                    });
                    let pageCount = Math.ceil(listCount / pageSize);
                    if (cmsList) {
                        return res.render('admin/cms/list', {
                            title: 'Cms master List',
                            arrData: cmsList,
                            sessionStoreId: sessionStoreId,
                            storeList: storeList,
                            listCount: listCount,
                            pageCount: pageCount,
                            columnName: column,
                            orderType: order,
                            searchItem: search,
                            pageSize: pageSize,
                            currentPage: parseInt(page),
                            messages: req.flash('info'),
                            errors: req.flash('errors'),
                        });
                    } else {
                        return res.render('admin/cms/list', {
                            title: 'Cms master List',
                            arrData: '',
                            sessionStoreId: sessionStoreId,
                            storeList: '',
                            messages: req.flash('info'),
                            errors: req.flash('errors'),
                        });
                    }
                }
            }
        }
    });
}

/**
 * This function is developed for view About Us
 * Developer: Partha Mandal
 */
exports.view = async (req, res) => {
    let token = req.session.token;
    let id = req.params.id;
    jwt.verify(token, SECRET, async (err, decoded) => {
        if (err) {
            req.flash('info', 'Invalid Token');
            res.redirect('auth/signin');
        } else {
            // if (sessionStoreId == null) {
            let categorys = await models.categories.findAll({});
            if (!id) {
                return res.render('admin/cms/addedit', {
                    title: 'Add Cms',
                    arrData: '',
                    categorys: categorys,
                    cms_img1: '',
                    cms_img2: '',
                    cms_img3: '',
                    vedioLinks: '',
                    image_video:'',
                    messages: req.flash('info'),
                    errors: req.flash('errors')
                });
            } else {
                const image_video = await models.image_vedio.findAll({ where: { relatedId: id, table_name: 'cms' } });                
                let cms = await models.cms.findOne({ where: { id: id } });
                if (cms) {
                    return res.render('admin/cms/addedit', {
                        title: 'Edit Cms',
                        arrData: cms,
                        image_video: image_video,
                        categorys: categorys,
                        messages: req.flash('info'),
                        errors: req.flash('errors')
                    });
                }
            }
        }
    });
};

/**
 * This function is developed for add/update New About Us
 * Developer: Partha Mandal
 */
exports.addOrUpdate = async (req, res, next) => {
    let token = req.session.token;
    let sessionStoreId = 58;
    let sessionUserId = req.session.user.id;
    let role = req.session.role;
    jwt.verify(token, SECRET, async (err, decoded) => {
        if (err) {
            res.flash('error', 'Invalid Token');
            req.redirect('auth/signin');
        } else {        
            let form = new multiparty.Form();
            form.parse(req, async (err, fields, files) => {
                let id = fields.updateId[0];
                let title = fields.title[0];
                let slug = fields.slug[0];
                let status = fields.status[0];
                let content = fields.content[0];
                let shortDescription = fields.shortDescription[0];
                let menuId = fields.menuId[0];
                let vedioLinks = fields.vedioLinks;
                console.log(title);
                if (!id) {
                    models.cms.create({
                        title: title,
                        menuId: menuId,
                        slug: slug,
                        content: content,
                        shortDescription: shortDescription,
                        status: status,
                        vedioLink:vedioLinks
                    }).then(async(data) => {
                        if (data) {
                            if(files.images.length>0){
                                let imageArray=files.images;
                                for(let eachImage of imageArray){
                                    if (eachImage.originalFilename != '' && eachImage.originalFilename != null) {
                                        var attrValueImage = Date.now() + eachImage.originalFilename;
                                        var ImageExt = attrValueImage.split('.').pop();
                                        var attrValueImageWithEXT = Date.now() + eachImage + "." + ImageExt;
                                        var finalattrValueImage = attrValueImageWithEXT.replace("[object Object]", "");
                                        helper.createDirectory('public/admin/cms/');
                                        var tempPath = eachImage.path;
                                        var fileName = finalattrValueImage;
                                        var targetPath = fileName;
                                        helper.uploadCmsImageFiles(tempPath, targetPath);
            
                                        await models.image_vedio.create({
                                            relatedId: data.id,
                                            image_video_url: 'admin/cms/' + fileName,
                                            image_type: 'cms_image',
                                            status: 'active',
                                            table_name: 'cms'
                                        })
                                    }
                                }
                            }

                            req.flash('info', 'Successfully created');
                            return res.redirect('/admin/cms/list/1');
                        }
                    }).catch((error) => {
                        console.log(error);
                        req.flash('errors', 'Somethings went wrong');
                    });
                } else {
                    models.cms.update({
                        title: title,
                        menuId: menuId,
                        slug: slug,
                        content: content,
                        shortDescription: shortDescription,
                        status: status,
                        vedioLink:vedioLinks
                    }, { where: { id: id } }).then(async (value) => {
                        if (value) {
                            
                            if(files.images.length>0){
                                let imageArray=files.images;
                                for(let eachImage of imageArray){
                                    if (eachImage.originalFilename != '' && eachImage.originalFilename != null) {
                                        var attrValueImage = Date.now() + eachImage.originalFilename;
                                        var ImageExt = attrValueImage.split('.').pop();
                                        var attrValueImageWithEXT = Date.now() + eachImage + "." + ImageExt;
                                        var finalattrValueImage = attrValueImageWithEXT.replace("[object Object]", "");
                                        helper.createDirectory('public/admin/cms/');
                                        var tempPath = eachImage.path;
                                        var fileName = finalattrValueImage;
                                        var targetPath = fileName;
                                        helper.uploadCmsImageFiles(tempPath, targetPath);
            
                                        await models.image_vedio.create({
                                            relatedId: id,
                                            image_video_url: 'admin/cms/' + fileName,
                                            image_type: 'cms_image',
                                            status: 'active',
                                            table_name: 'cms'
                                        })
                                    }
                                }
                            }

                            req.flash('info', 'Successfully updated');
                            return res.redirect('/admin/cms/list/1');
                        }
                    }).catch((error) => {
                        console.log(error);
                        req.flash('errors', 'Somethings went wrong');
                    });
                }
            });
        }
    })

};

/**
 * This function is developed for delete About Us
 * Developer: Partha Mandal
 */
exports.delete = (req, res, next) => {
    let token = req.session.token;
    let sessionStoreId = req.session.user.storeId;
    let role = req.session.role;
    let id = req.params.id;
    jwt.verify(token, SECRET, async (err, decoded) => {
        if (err) {
            res.flash('error', 'Invalid Token');
            req.redirect('auth/signin');
        } else {
            if (req.session.permissions.length == 0 && req.session.role == '' && sessionStoreId == null) {
                userPermission = true;
            } else {
                //*****Permission Assign Start
                var userPermission = false;
                if (role == 'admin') {
                    userPermission = true;
                } else {
                    userPermission = !!req.session.permissions.find(permission => {
                        return permission === 'AboutUsDelete'
                    })
                }
                if (id) {
                    let storeIdChecking = await models.cms.findOne({ attributes: ['storeId'], where: { id: id } });
                    if (storeIdChecking.storeId != sessionStoreId) {
                        userPermission = false;
                    }
                }
            }
            if (userPermission == false) {
                req.flash('errors', 'Contact Your administrator for permission');
                res.redirect('/admin/dashboard');
            } else {
                models.cms.destroy({
                    where: { id: id }
                }).then((value) => {
                    if (value) {
                        req.flash('info', 'Successfully deleted');
                        res.redirect('back');
                    } else {
                        req.flash('errors', 'Something went wrong');
                        res.redirect('back');
                    }
                });
            }
        }
    });
};  


exports.removeImages = async function(req,res){
    var imgId = req.params.imgId;
    var cmsId = req.params.cmsId;
    if(imgId !=''){
      var details = await models.image_vedio.findOne({where:{id:imgId}});
      var fileName = details.image_video_url;
        fs.unlink('public/admin/cms/'+fileName, function (err) {
      });
      models.image_vedio.destroy({where:{id:imgId}}).then(function(dst){
        if(dst){
          req.flash("info", "Image Successfully Removed");
          return res.redirect("/admin/cms/view/"+cmsId);
        }else{
          req.flash("errors", "Something Worng! Please try again.");
          return res.redirect("/admin/cms/view/"+cmsId);
        }
      })
    }
  }