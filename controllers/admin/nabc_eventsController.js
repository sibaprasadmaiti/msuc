`use strict`;
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
exports.list = async function (req, res) {
  var sessionStoreId = req.session.user.storeId;
  var role = req.session.role;
  var token = req.session.token;

  let column = req.query.column || 'id';
  let order = req.query.order || 'ASC';
  let pagesizes = req.query.pagesize || 10;
  let pageSize = parseInt(pagesizes);
  let page = req.params.page || 1;
  let search = req.query.search || '';
console.log("=====================================",pageSize);
  jwt.verify(token, SECRET, async function (err, decoded) {
    if (err) {
      req.flash("info", "Invalid Token");
      res.redirect('/auth/signin');
    } else {

      let eventList = await models.event.findAll({
        where: {
          [Op.or]: [
            { title: { [Op.like]: `%${search}%` } },
            //{ date: { [Op.like]: `%${search}%` } },
            { status: { [Op.like]: `%${search}%` } }
          ]
        }, order: [[column, order]], limit: pageSize, offset: (page - 1) * pageSize
      });

      // let eventCount = await models.event.count({where: {storeId: sessionStoreId,
      //     [Op.or]: [
      //     { title: { [Op.like]: `%${search}%` } },
      //     { status: { [Op.like]: `%${search}%` } }
      //     ]
      // }});

      let pageCount = Math.ceil(eventList.length / pageSize);

      if (eventList) {
        return res.render('admin/events/list', {
          title: 'Event List',
          arrData: eventList,
          sessionStoreId: '',
          listCount: eventList.length,
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
        return res.render('admin/events/list', {
          title: 'Event List',
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

exports.view = async function (req, res) {
  var id = req.params.id;
  const categorys = await models.categories.findAll();
  let { bannerImage, homepageImage, detailImage } = ['', '', ''];
  var token = req.session.token;
  jwt.verify(token, SECRET, async function (err, decoded) {
    if (err) {
      req.flash("info", "Invalid Token");
      res.redirect('/auth/signin');
    } else {
      try{
      if (!id) {
        return res.render('admin/events/addedit', {
          title: 'Add Events',
          messages: req.flash('info'),
          arrData: '',
          errors: '',
          categorys: categorys,
          bannerImage: bannerImage,
          homepageImage: homepageImage,
          detailImage: detailImage
        });
      } else {
        const image_video = await models.image_vedio.findAll({ where: { relatedId: id, table_name: 'event' } });
        for (let eachData of image_video) {
          if (eachData.image_type == 'banner') {
            bannerImage = eachData.image_video_url;
          } else if (eachData.image_type == 'homepage') {
            homepageImage = eachData.image_video_url;
          } else if (eachData.image_type == 'detail') {
            detailImage = eachData.image_video_url;
          }
        }
        models.event.findOne({ where: { id: id, storeId: 58 } })
          .then(function (value) {
            return res.render('admin/events/addedit', {
              title: 'Edit Events',
              messages: req.flash('info'),
              arrData: value,
              errors: '',
              categorys: categorys,
              bannerImage: bannerImage,
              homepageImage: homepageImage,
              detailImage: detailImage
            });
          });
      }
    }catch(error){
      console.log(error)
    }
    }
  })
}

exports.addOrUpdate = async function (req, res) {
  var form = new multiparty.Form();
  form.parse(req, function (err, fields, files) {
    var id = fields.update_id[0];
    var slag = fields.title[0].toString().toLowerCase().replace(/\s+/g, '-');
    if (!id) {
      models.event.create({
        storeId: 58,
        title: fields.title ? fields.title[0] : null,
        slag: slag,
        eventCategoryId: fields.eventCategoryId ? fields.eventCategoryId[0] : null,
        short_description: fields.short_description ? fields.short_description[0] : null,
        content: fields.content ? fields.content[0] : null,
        event_date: fields.event_date ? fields.event_date[0] : null,
        time: fields.time ? fields.time[0] : null,
        ticket_number: fields.ticket_number ? fields.ticket_number[0] : null,
        location: fields.location ? fields.location[0] : null,
        event_type: fields.event_type ? fields.event_type[0] : null,
        seat: fields.seat ? fields.seat[0] : null,
        capacity: fields.capacity ? fields.capacity[0] : null,
        status: fields.status ? fields.status[0] : null
      }).then(async (data) => {
        if (data) {
          let imageArray = [];
          if (files.banner_image[0].originalFilename != '' && files.banner_image[0].originalFilename != null) {
            var attrValueImage = Date.now() + files.banner_image[0].originalFilename;
            var ImageExt = attrValueImage.split('.').pop();
            var attrValueImageWithEXT = Date.now() + files.banner_image[0] + "." + ImageExt;
            var finalattrValueImage = attrValueImageWithEXT.replace("[object Object]", "");
            helper.createDirectory('public/admin/event/');
            var tempPath = files.banner_image[0].path;
            var fileName = finalattrValueImage;
            var targetPath = fileName;
            helper.uploadBannerValueImageFiles(tempPath, targetPath);
            console.log(fileName, finalattrValueImage,)

            await models.image_vedio.create({
              relatedId: data.id,
              image_video_url: 'admin/event/' + fileName,
              image_type: 'banner',
              status: 'active',
              table_name: 'event'
            })
          }
          if (files.homepage_image[0].originalFilename != '' && files.homepage_image[0].originalFilename != null) {
            var attrValueImage = Date.now() + files.homepage_image[0].originalFilename;
            var ImageExt = attrValueImage.split('.').pop();
            var attrValueImageWithEXT = Date.now() + files.homepage_image[0] + "." + ImageExt;
            var finalattrValueImage = attrValueImageWithEXT.replace("[object Object]", "");
            helper.createDirectory('public/admin/event/');
            var tempPath = files.homepage_image[0].path;
            var fileName = finalattrValueImage;
            var targetPath = fileName;
            helper.uploadBannerValueImageFiles(tempPath, targetPath);
            console.log(fileName, finalattrValueImage,)

            await models.image_vedio.create({
              relatedId: data.id,
              image_video_url: 'admin/event/' + fileName,
              image_type: 'homepage',
              status: 'active',
              table_name: 'event'
            })
          }
          if (files.detail_image[0].originalFilename != '' && files.detail_image[0].originalFilename != null) {
            var attrValueImage = Date.now() + files.detail_image[0].originalFilename;
            var ImageExt = attrValueImage.split('.').pop();
            var attrValueImageWithEXT = Date.now() + files.detail_image[0] + "." + ImageExt;
            var finalattrValueImage = attrValueImageWithEXT.replace("[object Object]", "");
            helper.createDirectory('public/admin/event/');
            var tempPath = files.detail_image[0].path;
            var fileName = finalattrValueImage;
            var targetPath = fileName;
            helper.uploadBannerValueImageFiles(tempPath, targetPath);
            console.log(fileName, finalattrValueImage,)

            await models.image_vedio.create({
              relatedId: data.id,
              image_video_url: 'admin/event/' + fileName,
              image_type: 'detail',
              status: 'active',
              table_name: 'event'
            })
          }
        }
      })
      req.flash('info', 'Successfully Created');
      return res.redirect('/admin/events/list/1');
      //})
    } else {
      models.event.update({
        title: fields.title ? fields.title[0] : null,
        //slag:fields.slag?fields.slag[0]:null,
        short_description: fields.short_description ? fields.short_description[0] : null,
        content: fields.content ? fields.content[0] : null,
        event_date: fields.event_date ? fields.event_date[0] : null,
        time: fields.time ? fields.time[0] : null,
        ticket_number: fields.ticket_number ? fields.ticket_number[0] : null,
        location: fields.location ? fields.location[0] : null,
        event_type: fields.event_type ? fields.event_type[0] : null,
        seat: fields.seat ? fields.seat[0] : null,
        capacity: fields.capacity ? fields.capacity[0] : null,
        status: fields.status ? fields.status[0] : null
      }, { where: { id: id } }).then(async (data) => {
        if (data) {
          let imageArray = [];
          if (files.banner_image[0].originalFilename != '' && files.banner_image[0].originalFilename != null) {
            var attrValueImage = Date.now() + files.banner_image[0].originalFilename;
            var ImageExt = attrValueImage.split('.').pop();
            var attrValueImageWithEXT = Date.now() + files.banner_image[0] + "." + ImageExt;
            var finalattrValueImage = attrValueImageWithEXT.replace("[object Object]", "");
            helper.createDirectory('public/admin/event/');
            var tempPath = files.banner_image[0].path;
            var fileName = finalattrValueImage;
            var targetPath = fileName;
            helper.uploadBannerValueImageFiles(tempPath, targetPath);
            console.log(fileName, finalattrValueImage)

            await models.image_vedio.create({
              relatedId: id,
              image_video_url: 'admin/event/' + fileName,
              image_type: 'banner',
              status: 'active',
              table_name: 'event'
            })
          }
          if (files.homepage_image[0].originalFilename != '' && files.homepage_image[0].originalFilename != null) {
            var attrValueImage = Date.now() + files.homepage_image[0].originalFilename;
            var ImageExt = attrValueImage.split('.').pop();
            var attrValueImageWithEXT = Date.now() + files.homepage_image[0] + "." + ImageExt;
            var finalattrValueImage = attrValueImageWithEXT.replace("[object Object]", "");
            helper.createDirectory('public/admin/event/');
            var tempPath = files.homepage_image[0].path;
            var fileName = finalattrValueImage;
            var targetPath = fileName;
            helper.uploadBannerValueImageFiles(tempPath, targetPath);
            console.log(fileName, finalattrValueImage,)

            await models.image_vedio.create({
              relatedId: id,
              image_video_url: 'admin/event/' + fileName,
              image_type: 'homepage',
              status: 'active',
              table_name: 'event'
            })
          }
          if (files.detail_image[0].originalFilename != '' && files.detail_image[0].originalFilename != null) {
            var attrValueImage = Date.now() + files.detail_image[0].originalFilename;
            var ImageExt = attrValueImage.split('.').pop();
            var attrValueImageWithEXT = Date.now() + files.detail_image[0] + "." + ImageExt;
            var finalattrValueImage = attrValueImageWithEXT.replace("[object Object]", "");
            helper.createDirectory('public/admin/event/');
            var tempPath = files.detail_image[0].path;
            var fileName = finalattrValueImage;
            var targetPath = fileName;
            helper.uploadBannerValueImageFiles(tempPath, targetPath);
            console.log(fileName, finalattrValueImage,)

            await models.image_vedio.create({
              relatedId: id,
              image_video_url: 'admin/event/' + fileName,
              image_type: 'detail',
              status: 'active',
              table_name: 'event'
            })
          }
        }
        req.flash('info', 'Successfully Updated');
        return res.redirect('/admin/events/list/1');
      })
    }
  })
}

exports.delete = function (req, res) {
  var sessionStoreId = req.session.user.storeId;
  var role = req.session.role;
  var token = req.session.token;
  jwt.verify(token, SECRET, async function (err, decoded) {
    if (err) {
      req.flash("info", "Invalid Token");
      res.redirect('/auth/signin');
    } else {
      var id = req.params.id;
      models.event.destroy({
        where: { id: id }
      }).then(function (value) {
        if (value) {
          req.flash('info', 'Successfully event deleted');
          res.redirect('back');
        } else {
          req.flash('errors', 'Something went wrong');
          res.redirect('back');
        }
      });

    }
  });
}; 