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

exports.categoryList = async function (req, res, next) {
	await models.eventCategory.findAll()
		.then(function (category) {
			list = category.map(category => {
				return Object.assign(
					{},
					{
						id: category.id,
						parent_id: category.parent_id,
						slag: category.slag,
						categoryName: category.categoryName,
						description: category.description,
						sequence: category.sequence,
						status: category.status,
						createdAt: category.createdAt,
					}
				)
			});
			if (list.length > 0) {
				return res.status(200).send({ data: { success: true, details: list }, errorNode: { errorCode: 0, errorMsg: "No Error" } });
			} else {
				return res.status(200).send({ data: { success: true, details: "" }, errorNode: { errorCode: 0, errorMsg: "No data Found" } });
			}
		}).catch(function (error) {
			return res.status(400).send({ data: { success: false, details: "" }, errorNode: { errorCode: 1, errorMsg: error } });
			//return res.send(error);
		});
};

exports.categoryWiseEvent = async function (req, res, next) {
	const { slug } = req.body.data;
	if (slug) {
		const eventCategory = await models.categories.findOne({ attributes: ['id'], where: { slug: slug } });

		if(eventCategory!=null){
		const eventList = await models.event.findAll({ where: {eventCategoryId: eventCategory.id } })

		const events = [];
		if (eventList.length > 0) {
			for (let ev of eventList) {
				const categoryName = await models.categories.findOne({ where: { id: ev.eventCategoryId } })

				const image_video = await models.image_vedio.findOne({ where: { relatedId: ev.id, table_name: 'event' } })

				events.push({
					id: ev.id,
					eventCategoryId: ev.eventCategoryId,
					eventCategoryName: categoryName.title,
					title: ev.title,
					slag:ev.slag,
					short_description: ev.short_description,
					content: ev.content,
					event_date: ev.event_date,
					time: ev.time,
					ticket_number: ev.ticket_number,
					location: ev.location,
					event_type: ev.event_type,
					seat:ev.seat,
					capacity:ev.capacity,
					banner:ev.banner,
					homepage:ev.homepage,
					status: ev.status,
					image: image_video != null ? req.app.locals.baseurl + image_video.image_video_url : "",
					image_type: image_video != null ?image_video.image_type:''
				})
			}
		}
		if (events.length > 0) {
			return res.status(200).send({ data: { success: true, details: events }, errorNode: { errorCode: 0, errorMsg: "No Error" } });
		} else {
			return res.status(200).send({ data: { success: true, details: "" }, errorNode: { errorCode: 0, errorMsg: "No data Found" } });
		}
	} else {
		return res.status(400).send({ data: { success: false, details: "" }, errorNode: { errorCode: 1, errorMsg: "No Error" } });
	}
	} else {
		return res.status(400).send({ data: { success: false, details: "Please Enter Required Details" }, errorNode: { errorCode: 0, errorMsg: "No Error" } });
	}
};

exports.homeView = async function (req, res, next) {

	var corporateSponsarArray = [];
    var executionSponsarArray = [];
    var partnerOrganizationArray = [];
    var bannerArray = [];
    var homeDetailsArray = [];
    var artistArray = [];
    var galleriesArray = [];

    var corporateSponsarList = await models.brands.findAll({where: { status:"Yes", type:"Corporate" },attributes: ["id", "title", "slug", "image","sequence"],order: [['sequence', 'ASC']]});
    if(corporateSponsarList.length>0){
      for(var b=0;b<corporateSponsarList.length;b++){
        if(corporateSponsarList[b].image && corporateSponsarList[b].image != null && corporateSponsarList[b].image != ''){
          var corporateImage = req.app.locals.baseurl+'admin/brands/'+corporateSponsarList[b].image;
        } else {
          var corporateImage = req.app.locals.baseurl+'admin/brands/no_image.jpg';
        }

        corporateSponsarArray.push({
          "id":corporateSponsarList[b].id,
          "title":corporateSponsarList[b].title,
          "image": corporateImage
        });
      }
    }

    var executionSponsarList = await models.brands.findAll({where: { status:"Yes", type:"Execution" },attributes: ["id", "title", "slug", "image","sequence"],order: [['sequence', 'ASC']]});
    if(executionSponsarList.length>0){
      for(var b=0; b<executionSponsarList.length; b++){
        if(executionSponsarList[b].image && executionSponsarList[b].image != null && executionSponsarList[b].image != ''){
          var executionImage = req.app.locals.baseurl+'admin/brands/'+executionSponsarList[b].image;
        } else {
          var executionImage = req.app.locals.baseurl+'admin/brands/no_image.jpg';
        }

        executionSponsarArray.push({
          "id":executionSponsarList[b].id,
          "title":executionSponsarList[b].title,
          "image": executionImage
        });
      }
    }

    var partnerOrganizationList = await models.partnerOrganization.findAll({where: { status:"Yes" },attributes: ["id", "title", "image","sequence"],order: [['sequence', 'ASC']]});
    if(partnerOrganizationList.length>0){
      for(var p=0; p<partnerOrganizationList.length; p++){
        if(partnerOrganizationList[p].image && partnerOrganizationList[p].image != null && partnerOrganizationList[p].image != ''){
          var partnerOrganizationImage = req.app.locals.baseurl+'admin/partnerOrganization/'+partnerOrganizationList[p].image;
        } else {
          var partnerOrganizationImage = req.app.locals.baseurl+'admin/partnerOrganization/no_image.jpg';
        }

        partnerOrganizationArray.push({
          "id":partnerOrganizationList[p].id,
          "title":partnerOrganizationList[p].title,
          "image": partnerOrganizationImage
        });
      }
    }


    var bannerList = await models.banner.findAll({where: { status:"Yes" },attributes: ["id", "title", "shortDescription", "image","slug"],order: [['id', 'ASC']]});

    if(bannerList.length>0){
      for(var j=0;j<bannerList.length;j++){
        if(bannerList[j].id != 1){
          if(bannerList[j].image && bannerList[j].image != null && bannerList[j].image != ''){
            var bannerImage = req.app.locals.baseurl+'admin/banner/'+bannerList[j].id+'/'+bannerList[j].image;
          } else {
            var bannerImage = req.app.locals.baseurl+'admin/banner/no_image.jpg';
          }

          bannerArray.push({
            "id":bannerList[j].id,
            "title":bannerList[j].title,
            "slug":bannerList[j].slug,
            "images": bannerImage
          });
        }
      }
    }

    var homeDetailsList = await models.homeDetails.findAll({where: { status:"Yes" },attributes: ["id", "link", "firstNotice", "sneakPeek", "organizationPartner", "image","secondNotice"]});

    if(homeDetailsList.length>0){
      for(var h=0; h<homeDetailsList.length; h++){
        if(homeDetailsList[h].image && homeDetailsList[h].image != null && homeDetailsList[h].image != ''){
          var homeDetailsImage = req.app.locals.baseurl+'admin/homeDetails/image/'+homeDetailsList[h].id+'/'+homeDetailsList[h].image;
        } else {
          var homeDetailsImage = req.app.locals.baseurl+'admin/homeDetails/no_image.jpg';
        }

        homeDetailsArray.push({
          "id":homeDetailsList[h].id,
          "link":homeDetailsList[h].link,
          "firstNotice":homeDetailsList[h].firstNotice,
          "secondNotice":homeDetailsList[h].secondNotice,
          "sneakPeek":homeDetailsList[h].sneakPeek,
          "organizationPartner":homeDetailsList[h].organizationPartner,
          "images": homeDetailsImage
        });
      }
    }


    var artistList = await models.artist.findAll({where: { status:"active" },attributes: ["id", "slug", "artistName", "designation", "facebookLink", "instaLink", "twitterLink", "linkedinLink", "whatsappLink", "image"]});

    if(artistList.length>0){
      for(var a=0; a<artistList.length; a++){
        if(artistList[a].image && artistList[a].image != null && artistList[a].image != ''){
          var artistImage = req.app.locals.baseurl+'admin/artist/'+artistList[a].image;
        } else {
          var artistImage = req.app.locals.baseurl+'admin/artist/no_image.jpg';
        }

        artistArray.push({
          "id":artistList[a].id,
          "slug":artistList[a].slug,
          "artistName":artistList[a].artistName,
          "designation":artistList[a].designation,
          "facebookLink":artistList[a].facebookLink,
          "instaLink":artistList[a].instaLink,
          "twitterLink":artistList[a].twitterLink,
          "linkedinLink":artistList[a].linkedinLink,
          "whatsappLink":artistList[a].whatsappLink,
          "images": artistImage
        });
      }
    }

    var galleriesList = await models.galleries.findAll({where: { status:"Yes" },attributes: ["id", "image","sequence"],order: [['sequence', 'ASC']]});
    if(galleriesList.length>0){
      for(var g=0; g<galleriesList.length; g++){
        if(galleriesList[g].image && galleriesList[g].image != null && galleriesList[g].image != ''){
          var galleriesImage = req.app.locals.baseurl+'admin/gallery/image/'+galleriesList[a].id+'/'+galleriesList[g].image;
        } else {
          var galleriesImage = req.app.locals.baseurl+'admin/gallery/no_image.jpg';
        }

        galleriesArray.push({
          "id":galleriesList[g].id,
          "image": galleriesImage
        });
      }
    }

    return res.status(200).send({ value:{
      success:true, 
      corporateSponsarList:corporateSponsarArray, 
      executionSponsarList : executionSponsarArray, 
      partnerOrganizationList : partnerOrganizationArray, 
      bannerList : bannerArray, 
      homeDetailsList : homeDetailsArray, 
      artistList : artistArray,
      galleryList : galleriesArray,
      mainBannerImage : req.app.locals.baseurl+'admin/banner/'+bannerList[0].id+'/'+bannerList[0].image,
	}, errorNode:{errorCode:0, errorMsg:"No Error"}});
	
		// const eventList = await models.event.findAll({
		// 	where: {
		// 		$or: [
		// 			{ banner: 'yes'},{ homePage: 'yes' }
		// 		]
		// 	}
		// })
		// const events = [];
		// if (eventList.length > 0) {
		// 	for (let ev of eventList) {
		// 		const categoryName = await models.eventCategory.findOne({ where: { id: ev.eventCategoryId } })
		// 		const image_video = await models.image_vedio.findAll({ where: { relatedId: ev.id, table_name: 'event' } })
		// 		let images = [];
		// 		if (image_video.length > 0) {
		// 			images = await image_video.map(each_image => {
		// 				return Object.assign(
		// 					{},
		// 					{
		// 						image: each_image.image_video_url != "" && each_image.image_video_url != null ? req.app.locals.baseurl + each_image.image_video_url : "",
		// 						image_type: each_image.image_type
		// 					}
		// 				)
		// 			});
		// 		}
		// 		events.push({
		// 			id: ev.id,
		// 			eventCategoryId: ev.eventCategoryId,
		// 			eventCategoryName: categoryName.categoryName,
		// 			title: ev.title,
		// 			slag: ev.slag,
		// 			short_description: ev.short_description,
		// 			content: ev.content,
		// 			date: ev.date,
		// 			time: ev.time,
		// 			ticket_number:ev.ticket_number,
		// 			location: ev.location,
		// 			event_type: ev.event_type,
		// 			seat: ev.seat,
		// 			capacity: ev.capacity,
		// 			banner: ev.banner,
		// 			homePage: ev.homePage,
		// 			status: ev.status,
		// 			images: images
		// 		})
		// 	}
		// }
		// if (events.length > 0) {
		// 	return res.status(200).send({ data: { success: true, details: events }, errorNode: { errorCode: 0, errorMsg: "No Error" } });
		// } else {
		// 	return res.status(200).send({ data: { success: true, details: "" }, errorNode: { errorCode: 0, errorMsg: "No data Found" } });
		// }
};

exports.eventDetails = async function (req, res, next) {
	const { slug } = req.body.data;
	if (slug) {
		const eventOne = await models.event.findOne({ where: { slag: slug } })
		const events = [];
		if (eventOne!=null) {
			const categoryName = await models.categories.findOne({ where: { id: eventOne.eventCategoryId } })
			const image_video = await models.image_vedio.findOne({ where: { relatedId: eventOne.id, table_name: 'event' } })
			events.push({
				id: eventOne.id,
				slag: eventOne.slag,
				eventCategoryId: eventOne.eventCategoryId,
				eventCategoryName: categoryName!=null?categoryName.title:'',
				title: eventOne.title,
				short_description: eventOne.short_description,
				content: eventOne.content,
				event_date: eventOne.event_date,
				time: eventOne.time,
				ticket_number: eventOne.ticket_number,
				location: eventOne.location,
				event_type: eventOne.event_type,
				seat: eventOne.seat,
				capacity: eventOne.capacity,
				banner: eventOne.banner,
				homepage: eventOne.homepage,
				status: eventOne.status,
				image: image_video != null ? req.app.locals.baseurl + image_video.image_video_url : "",
				image_type: image_video != null ?image_video.image_type:''
			})
		}
		if (events.length > 0) {
			return res.status(200).send({ data: { success: true, details: events[0] }, errorNode: { errorCode: 0, errorMsg: "No Error" } });
		} else {
			return res.status(200).send({ data: { success: true, details: "" }, errorNode: { errorCode: 0, errorMsg: "No data Found" } });
		}
	} else {
		return res.status(200).send({ data: { success: false, details: "Please Enter Required Details" }, errorNode: { errorCode: 0, errorMsg: "No Error" } });
	}
};


exports.menuList=async function(req, res){
	let mainData=[];
	let parentCategory = await models.categories.findAll({where:{parentCategoryId:0},order: [['position', 'ASC']]});
	for(let i in parentCategory){
		let jData=[];
		let childCategory=await models.categories.findAll({where:{parentCategoryId:parentCategory[i].id},order: [['position', 'ASC']]});
		for(let j in childCategory){
			let kData=[];
			let subChildCategory=await models.categories.findAll({where:{parentCategoryId:childCategory[j].id},order: [['position', 'ASC']]});
			for(let k in subChildCategory){
				kData.push({
					id:subChildCategory[k].id,
					title:subChildCategory[k].title,
					slug:subChildCategory[k].slug
				})
			}
			jData.push({
				id:childCategory[j].id,
				title:childCategory[j].title,
				slug:childCategory[j].slug,
				childData:kData
			})
		}
		mainData.push({
			id:parentCategory[i].id,
			title:parentCategory[i].title,
			slug:parentCategory[i].slug,
			childData:jData
		})
	}
	if (mainData.length > 0) {
		return res.status(200).send({ data: { success: true, details: mainData }, errorNode: { errorCode: 0, errorMsg: "No Error" } });
	} else {
		return res.status(200).send({ data: { success: true, details: "" }, errorNode: { errorCode: 0, errorMsg: "No data Found" } });
	}
}

exports.eventList = async function (req, res) {
	const eventList = await models.event.findAll();
	const events = [];
	if (eventList.length > 0) {
		for (let ev of eventList) {
			const image_video = await models.image_vedio.findOne({ where: { relatedId: ev.id, table_name: 'event' } });
			events.push({
				id: ev.id,
				storeId: ev.storeId,
				eventCategoryId: ev.eventCategoryId,
				title: ev.title,
				slag:ev.slag,
				short_description: ev.short_description,
				content: ev.content,
				event_date: ev.event_date,
				time: ev.time,
				ticket_number: ev.ticket_number,
				location: ev.location,
				event_type: ev.event_type,
				seat:ev.seat,
				capacity:ev.capacity,
				banner:ev.banner,
				homepage:ev.homepage,
				status: ev.status,
				image: image_video != null ? req.app.locals.baseurl + image_video.image_video_url : "",
				image_type: image_video != null ?image_video.image_type:''
			})
		}
	}
	if (events.length > 0) {
		return res.status(200).send({ data: { success: true, details: events }, errorNode: { errorCode: 0, errorMsg: "No Error" } });
	} else {
		return res.status(200).send({ data: { success: true, details: "" }, errorNode: { errorCode: 0, errorMsg: "No data Found" } });
	}
};