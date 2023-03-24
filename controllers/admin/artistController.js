var models = require('../../models');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var SECRET = 'nodescratch';
var flash = require('connect-flash');
var config = require("../../config/config.json");
var Sequelize = require("sequelize");
const nodemailer = require("nodemailer");
var helper = require('../../helpers/helper_functions');
var multiparty = require("multiparty");
const fs = require('fs');

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
            idle: 10000
        }
    }
);

exports.artistList = async function (req, res, next) {
    var sessionStoreId = 58;
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
            let artistGalleryList = await models.artist.findAll({
                where: {
                    [Op.or]: [
                        { id: { [Op.like]: `%${search}%` } },
                    ]
                }, order: [[column, order]], limit: pageSize, offset: (page - 1) * pageSize
            });


            let pageCount = Math.ceil(artistGalleryList.length / pageSize);

            if (artistGalleryList) {
                return res.render('admin/artist/list', {
                    title: 'artists Gallery',
                    arrData: artistGalleryList,
                    sessionStoreId: '',
                    listCount: artistGalleryList.length,
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
                return res.render('admin/artist/list', {
                    title: 'Contact Us',
                    arrData: '',
                    sessionStoreId: '',
                    messages: req.flash('info'),
                    errors: req.flash('errors'),
                });
            }

        }
    });
}


exports.view = async function (req, res) {

    var id = req.params.id;
    var token = req.session.token;
    var sessionStoreId = 58;
    var role = req.session.role;
    jwt.verify(token, SECRET, async function (err, decoded) {
        if (err) {
            req.flash("info", "Invalid Token");
            res.redirect('/auth/signin');
        } else {
            if (!id) {
                return res.render('admin/artist/addEdit', {
                    title: 'artists Gallery',
                    arrData: '',
                    helper: helper,
                    sessionStoreId: sessionStoreId,
                    messages: req.flash('info'),
                    errors: req.flash('errors')
                });
            } else {
                models.artist.findOne({
                    where: {
                        storeId: sessionStoreId,
                        id: id
                    }
                }).then(async function (artistGallery) {
                    if (artistGallery) {
                        return res.render('admin/artist/addEdit', {
                            title: 'artists Gallery',
                            arrData: artistGallery,
                            messages: req.flash('info'),
                            errors: req.flash('errors')
                        });
                    } else {
                        res.redirect('/admin/dashboard');
                    }
                });
            }
        }
    });

};

exports.addOrUpdate = function (req, res) {
    var token = req.session.token;
    let storeId = 58;
    jwt.verify(token, SECRET, async function (err, decoded) {
        if (err) {
            req.flash("info", "Invalid Token");
            res.redirect('/auth/signin');
        } else {
            var form = new multiparty.Form();
            form.parse(req, async function (err, fields, files) {
                var id = fields.updateId[0];
                if (fields.artistName[0] && fields.artistName[0] != '') {
                    if (!id) {
                        models.artist.create({
                            storeId: storeId,
                            slug: fields.slug[0],
                            artistName: fields.artistName[0],
                            designation: fields.designation[0],
                            status: fields.status[0],
                            facebookLink: fields.facebookLink[0],
                            instaLink: fields.instaLink[0],
                            twitterLink: fields.twitterLink[0],
                            linkedinLink: fields.linkedinLink[0],
                            whatsappLink: fields.whatsappLink[0],
                        }).then(async (value) => {
                            if (value) {
                                if (files.image[0].originalFilename != '' && files.image[0].originalFilename != null) {
                                    var brandImage = Date.now() + files.image[0].originalFilename;
                                    var ImageExt = brandImage.split('.').pop();
                                    var brandImageWithEXT = Date.now() + files.image[0] + "." + ImageExt;
                                    var finalArtistImage = brandImageWithEXT.replace("[object Object]", "");
                                    helper.createDirectory('public/admin/artist/');
                                    var tempPath = files.image[0].path;
                                    var fileName = finalArtistImage;
                                    var targetPath = fileName;
                                    helper.uploadArtistImageFiles(tempPath, targetPath);
                                    models.artist.update({
                                        image: finalArtistImage
                                    }, { where: { id: value.id } }).then(function (val) {
                                        if (val) {
                                            req.flash('info', 'Successfully our Artist Gallery created');
                                            return res.redirect('/admin/artist/1');
                                        }
                                    }).catch(function (error) {
                                        req.flash('errors', 'Something went wrong');
                                    });
                                }
                            }
                            req.flash('info', 'Successfully created');
                            return res.redirect('/admin/artist/1');
                        }).catch(function (error) {
                            req.flash('errors', 'Something went wrong');
                        });
                    } else {
                        models.artist.update({
                            storeId: storeId,
                            slug: fields.slug[0],
                            artistName: fields.artistName[0],
                            designation: fields.designation[0],
                            status: fields.status[0],
                            facebookLink: fields.facebookLink[0],
                            instaLink: fields.instaLink[0],
                            twitterLink: fields.twitterLink[0],
                            linkedinLink: fields.linkedinLink[0],
                            whatsappLink: fields.whatsappLink[0],
                        }, { where: { id: id } }).then(async (value) => {
                            if (value) {
                                if (files.image[0].originalFilename != '' && files.image[0].originalFilename != null) {
                                    var brandImage = Date.now() + files.image[0].originalFilename;
                                    var ImageExt = brandImage.split('.').pop();
                                    var brandImageWithEXT = Date.now() + files.image[0] + "." + ImageExt;
                                    var finalArtistImage = brandImageWithEXT.replace("[object Object]", "");
                                    helper.createDirectory('public/admin/artist/');
                                    var tempPath = files.image[0].path;
                                    var fileName = finalArtistImage;
                                    var targetPath = fileName;
                                    helper.uploadArtistImageFiles(tempPath, targetPath);
                                    models.artist.update({
                                        image: finalArtistImage
                                    }, { where: { id: id } }).then(function (val) {
                                        if (val) {
                                            req.flash('info', 'Successfully our artist created');
                                            return res.redirect('/admin/artist/1');
                                        }
                                    }).catch(function (error) {
                                        req.flash('errors', 'Something went wrong');
                                    });
                                }
                            }
                            req.flash('info', 'Updated successfully');
                            return res.redirect('/admin/artist/1');
                        }).catch(function (error) {
                            req.flash('errors', 'Something went wrong');
                        });
                        // }
                    }
                } else {
                    req.flash('errors', 'Please Add Required Fields.');
                    return res.redirect('/admin/artist/1/view');
                }
            });
            // }
        }
    });
};
