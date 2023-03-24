var models = require('../../models');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var SECRET = 'nodescratch';
var flash = require('connect-flash');
var config = require("../../config/config.json");
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
			idle: 10000
		}
	}
);

exports.categoryWiseCms = async function (req, res, next) {
	const { slug } = req.body.data;
	if (slug) {
		const cmsCategory = await models.categories.findOne({ attributes: ['id'], where: { slug: slug } });
		console.log(cmsCategory);
		if(cmsCategory!=null){
			const cmsList = await models.cms.findAll({ where: { menuId: cmsCategory.id } })

			const cmss = [];
			if (cmsList.length > 0) {

				for (let ev of cmsList) {
					const categoryName = await models.categories.findOne({ where: { id: ev.menuId } })

					const image_video = await models.image_vedio.findAll({ attributes: ['image_video_url'], where: { relatedId: ev.id, table_name: 'cms' } })

					cmss.push({
						id: ev.id,
						menuCategoryId: ev.menuId,
						menuCategoryName: categoryName.title,
						title: ev.title,
						slug:ev.slug,
						shortDescription: ev.shortDescription,
						content: ev.content,
						vedioLink:ev.vedioLink,
						status: ev.status,
						image: image_video,
						baseurl:req.app.locals.baseurl
					})
				}
			}
			if (cmss.length > 0) {
				return res.status(200).send({ data: { success: true, details:cmss[0] }, errorNode: { errorCode: 0, errorMsg: "No Error" } });
			} else {
				return res.status(200).send({ data: { success: false, details: {} }, errorNode: { errorCode: 0, errorMsg: "No data Found" } });
			}
		}
		else {
			return res.status(200).send({ data: { success: false, details: {} }, errorNode: { errorCode: 0, errorMsg: "No data Found" } });
		}
	} else {
		return res.status(400).send({ data: { success: false, details: "Please Enter Required Details" }, errorNode: { errorCode: 0, errorMsg: "No Error" } });
	}
};