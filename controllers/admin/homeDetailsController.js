var models = require('../../models');
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var fs = require("fs");
var formidable = require('formidable');
var multiparty = require('multiparty'); 
var bodyParser = require('body-parser');
var fetch = require('node-fetch');
var jwt = require('jsonwebtoken');
var SECRET = 'nodescratch';
const paginate = require('express-paginate');
var helper = require('../../helpers/helper_functions');
var fs = require("fs");
var config = require("../../config/config.json");
var Sequelize = require("sequelize");
const Op = Sequelize.Op;

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
 * Description: This function is developed for listing galleriess
 * Developer:Surajit Gouri
 */
exports.list = async function(req, res){
    var sessionStoreId = req.session.user.storeId;
    var role = req.session.role;
    var token= req.session.token;

    let column = req.query.column || 'id';
    let order = req.query.order || 'ASC';
    let pagesizes = req.query.pagesize || 10;
    let pageSize = parseInt(pagesizes);
    let page = req.params.page || 1;
    let search = req.query.search || '';

    jwt.verify(token, SECRET, async function(err, decoded) {
        if (err) {
            req.flash("info", "Invalid Token");
            res.redirect('/auth/signin');
        } else {
            
            if (sessionStoreId == null) {
                var storeList = await models.stores.findAll({attributes:['id','storeName','storeCode'],where:{status:'Yes'}});

                let galleryList = await models.homeDetails.findAll({ where: {
                    [Op.or]: [
                      { image: { [Op.like]: `%${search}%` } },
                      { status: { [Op.like]: `%${search}%` } }
                    ]
                  }, order: [[column, order]], limit:pageSize, offset:(page-1)*pageSize });

                let listCount = await models.homeDetails.count({where: {
                    [Op.or]: [
                      { image: { [Op.like]: `%${search}%` } },
                      { status: { [Op.like]: `%${search}%` } }
                    ]
                  }});

                let pageCount = Math.ceil(listCount/pageSize);

                if (galleryList) {
                    return res.render('admin/homeDetails/list', {
                        title: 'home Details List',
                        arrData: galleryList,
                        storeList: storeList,
                        sessionStoreId: '',
                        listCount: listCount,
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
                    return res.render('admin/homeDetails/list', {
                        title: 'homeDetails List',
                        arrData: '',
                        storeList: '',
                        sessionStoreId: '',
                        messages: req.flash('info'),
                        errors: req.flash('errors'),
                        helper: helper,
                    });
                }               
            } else {
                //*****Permission Assign Start
                var userPermission = false;
                if (role == 'admin') {
                    userPermission = true;
                } else {
                    userPermission = !!req.session.permissions.find(permission => {
                        return permission === 'GalleryList'
                    })
                }
                if (userPermission == false) {
                    req.flash('errors', 'Contact Your administrator for permission');
                    res.redirect('/admin/dashboard');
                } else {
                    var storeList = await models.stores.findAll({attributes:['id','storeName','storeCode'],where:{id:sessionStoreId,status:'Yes'}});

                    let galleryList = await models.homeDetails.findAll({ where: {storeId: sessionStoreId,
                        [Op.or]: [
                        { image: { [Op.like]: `%${search}%` } },
                        { status: { [Op.like]: `%${search}%` } }
                        ]
                    }, order: [[column, order]], limit:pageSize, offset:(page-1)*pageSize });

                    let listCount = await models.homeDetails.count({where: {storeId: sessionStoreId,
                        [Op.or]: [
                        { image: { [Op.like]: `%${search}%` } },
                        { status: { [Op.like]: `%${search}%` } }
                        ]
                    }});

                    let pageCount = Math.ceil(listCount/pageSize);

                    if (galleryList) {
                        return res.render('admin/homeDetails/list', {
                            title: 'home Details List',
                            arrData: galleryList,
                            storeList: storeList,
                            sessionStoreId: '',
                            listCount: listCount,
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
                        return res.render('admin/homeDetails/list', {
                            title: 'home Details List',
                            arrData: '',
                            storeList: '',
                            sessionStoreId: '',
                            messages: req.flash('info'),
                            errors: req.flash('errors'),
                            helper: helper,
                        });
                    }         
                }
            }
        }	
    });
}


/**
 * Description: This function is developed for view galleriess
 * Developer:Surajit Gouri
 */
exports.view = async function(req, res){
    var token = req.session.token;
    var sessionStoreId = req.session.user.storeId;
    var role = req.session.role;
    var id = req.params.id;
    jwt.verify(token,SECRET,async function(err,decoded){
        if(err){
            req.flash('info','Invalid Token');
            res.redirect('auth/signin');
        }else{
            var brands = await models.brands.findAll({attributes:['id','title'],where:{storeId: 30, status:'Yes'}});
            if (sessionStoreId == null) {
                var stores = await models.stores.findAll({ attributes: ['id', 'storeName'], where: { status: 'Yes' } });
                if (!id) {
                    return res.render('admin/homeDetails/addedit', {
                        title: 'Add homeDetails',
                        arrData: '',
                        stores: stores,
                        brands: brands,
                        sessionStoreId: '',
                        messages: req.flash('info'),
                        errors: req.flash('errors')
                    });
                } else {
                    var gallery = await models.homeDetails.findOne({ where: { id: id } });
                    if (gallery) {
                        return res.render('admin/homeDetails/addedit', {
                            title: 'Edit homeDetails',
                            arrData: gallery,
                            stores: stores,
                            brands: brands,
                            sessionStoreId: '',
                            messages: req.flash('info'),
                            errors: req.flash('errors')
                        });
                    }
                }
            }else{
                //*****Permission Assign Start
                var userPermission = false;
                if (role == 'admin') {
                    userPermission = true;
                } else {
                    userPermission = !!req.session.permissions.find(permission => {
                        return permission === 'GalleryView'
                    })
                }
                if (id) {
                    var storeIdChecking = await models.homeDetails.findOne({ attributes: ['storeId'], where: { id: id } });
                    if (storeIdChecking.storeId != sessionStoreId) {
                        userPermission = false;
                    }
                }
                if (userPermission == false) {
                    req.flash('errors', 'Contact Your administrator for permission');
                    res.redirect('/admin/dashboard');
                } else {
                    var stores = await models.stores.findAll({ attributes: ['id', 'storeName'], where: { id: sessionStoreId, status: 'Yes' } });
                    if (!id) {
                        return res.render('admin/homeDetails/addedit', {
                            title: 'Add home Details',
                            arrData: '',
                            stores: stores,
                            brands: brands,
                            sessionStoreId: sessionStoreId,
                            messages: req.flash('info'),
                            errors: req.flash('errors')
                        });
                    } else {
                        var gallery = await models.homeDetails.findOne({ where: { storeId: sessionStoreId, id: id } });
                        if (gallery) {
                            return res.render('admin/homeDetails/addedit', {
                                title: 'Edit home Details',
                                arrData: gallery,
                                stores: stores,
                                brands: brands,
                                sessionStoreId: sessionStoreId,
                                messages: req.flash('info'),
                                errors: req.flash('errors')
                            });
                        }
                    }
                }
            }
        }
    });    
};



/**
 * Description: This function is developed for add/Edit for Gallery
 * Developer: Surajit Gouri
 */

exports.addOrUpdate = function(req, res) {

    var token= req.session.token;
    jwt.verify(token, SECRET, async function(err, decoded) {
        if (err) {
            req.flash("info", "Invalid Token");
            res.redirect('/auth/signin');
        }else{
            // return res.send(req.body)
            const id = req.body.updateId || null
            const storeId = req.body.storeId || null
            const link = req.body.link || null
            const firstNotice = req.body.firstNotice || null
            const secondNotice = req.body.secondNotice || null
            const sneakPeek = req.body.sneakPeek || null
            const organizationPartner = req.body.organizationPartner || null
            const status = req.body.status || null
            const sequence = req.body.sequence || null
            const imageExt = req.body.imageExt || null
            const image = req.body.image || null

            console.log("dddddddddddddddddddddddddddddd--"+id)
            console.log("ddddddddddddddddddddddddddddddsequence--"+sequence)
            
            try {
                if(!id){

                    const homeDetails = await models.homeDetails.create({
                        storeId:storeId,
                        link:link,
                        firstNotice:firstNotice,
                        secondNotice:secondNotice,
                        sneakPeek:sneakPeek,
                        organizationPartner:organizationPartner,
                        status:status,
                        sequence: sequence,
                    })

                    if (
                        imageExt &&
                        image
                      ) {
                        const dir = `public/admin/homeDetails/image/${homeDetails.id}`;
                        if (!fs.existsSync(dir)) {
                          fs.mkdirSync(dir);
                        }
                        const fileTitle = Date.now();
                        const path =`public/admin/homeDetails/image/${homeDetails.id}/${fileTitle}.${imageExt}`;
                        const normalfile = `${fileTitle}.${imageExt}`;
                        const base64Data = image.replace(
                          /^data:image\/(png|jpg|jpeg);base64,/,
                          ""
                        );
                        fs.writeFileSync(path, base64Data, { encoding: "base64" });
                        await models.homeDetails.update(
                          { image: normalfile },
                          { where: { id: homeDetails.id } }
                        );
                      }
                      req.flash('info','Successfully homeDetails created');
                      return res.redirect('/admin/homeDetails/list/1');
                }else{
                    const homeDetails = await models.homeDetails.update({
                        storeId:storeId,
                        link:link,
                        firstNotice:firstNotice,
                        secondNotice:secondNotice,
                        sneakPeek:sneakPeek,
                        organizationPartner:organizationPartner,
                        status:status,
                        sequence: sequence,
                    }, {where:{id: id}})

                    if (
                        imageExt &&
                        image
                      ) {
                        const dir = `public/admin/homeDetails/image/${id}`;

                        console.log("aaaaaaaaaaaaaaaaaaaaa---"+dir)
                        if (!fs.existsSync(dir)) {
                          fs.mkdirSync(dir);
                        }
                        const fileTitle = Date.now();
                        const path =`public/admin/homeDetails/image/${id}/${fileTitle}.${imageExt}`;
                        const normalfile = `${fileTitle}.${imageExt}`;
                        const base64Data = image.replace(
                          /^data:image\/(png|jpg|jpeg);base64,/,
                          ""
                        );
                        fs.writeFileSync(path, base64Data, { encoding: "base64" });
                        await models.homeDetails.update(
                          { image: normalfile },
                          { where: { id: id } }
                        );
                      }
                      req.flash('info','Successfully homeDetails updated');
                      return res.redirect('/admin/homeDetails/list/1');
                }   
            } catch (error) {
                req.flash('errors','Something went wrong');
                return res.redirect(back)
            }
           
        }
    });
};
    



/**
 * Description: This function is developed for delete Gallery
 * Developer: Surajit Gouri
 */
exports.delete = function(req, res) {
    
    var sessionStoreId = req.session.user.storeId;
    var role = req.session.role;
    var token= req.session.token;
    jwt.verify(token, SECRET, async function(err, decoded) {
        if(err){
            req.flash("info", "Invalid Token");
            res.redirect('/auth/signin');
        } else {
            var id = req.params.id;
            var whereCondition='';
            //*****Permission Assign Start
            var userPermission = false;
            //*****If SupperAdmin Login
            if (req.session.permissions.length == 0 && req.session.role == '' && sessionStoreId == null) {
                userPermission = true;
                whereCondition ={id:id};
            } else {
                if (role == 'admin') {
                    userPermission = true;
                } else {
                    userPermission = !!req.session.permissions.find(permission => {
                        return permission === 'GalleryDelete'
                    })
                }
                var storeIdChecking = await models.brands.findOne({attributes:['storeId'],where:{id:id}});
                if (storeIdChecking.storeId != sessionStoreId){
                    userPermission = false;
                }else{
                    whereCondition = { storeId: sessionStoreId,id: id };
                }
            }
            if (userPermission == false) {
                req.flash('errors', 'Contact Your administrator for permission');
                res.redirect('/admin/dashboard');
            } else {
                
               
                models.homeDetails.destroy({
                    where:{id:id}
                }).then(function (value) {
                    if (value) {
                        req.flash('info', 'Successfully home Details deleted');
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

