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
exports.sponsorshipSave = async (req, res, next) => {
    const sponsorshipData =  req.body.data ;
	const storeId=req.body.data.storeId;
	console.log(sponsorshipData);
    if (storeId && storeId != '' && storeId != null) {
            await models.sponsorship.create(
				sponsorshipData
            ).then(async (val) => {
                return res.status(201).send({ data: { success: true, message: "Successfully created" }, errorNode: { errorCode: 0, errorMsg: "No Error" } })
            }).catch((err) => {
                console.log(err)
                return res.status(500).send({ data: { success: false, message: "Something went wrong !" }, errorNode: { errorCode: 1, errorMsg: err } })
            })
    } else {
        return res.status(400).send({ data: { success: false, message: "storeId is required" }, errorNode: { errorCode: 1, errorMsg: "storeId is required" } })
    }
}


