const postPropertyModel = require('../../../models/postProperty/post');
const buyCommercial_Model = require('../../../models/property/buyCommercial');
const cloudinary = require('cloudinary').v2;
const NodeCache = require("node-cache");

const cache = new NodeCache();
class BuyController {
    // Buy Commercial Insert Edit View Update Delete
    static buycommercialInsert = async (req, res) => {
        try {
            const { propertyName,propertyType,availableDate, price, state, city, address, type, descripation, amenities, area, furnishing
                , landMark, builtYear } = req.body
                console.log(req.body)
            if  (propertyName&&propertyType&&availableDate && price && state && city && address && type && descripation && amenities && area && furnishing && landMark && builtYear) {
                // console.log("kgha")
                if (req.files.frontImage && req.files.otherImage) {
                    const front = req.files.frontImage;
                    const other = req.files.otherImage

                    // const length=other.length;
                    const otherImageLink = []
                    // console.log(otherImageLink)
                    const imageResult = await cloudinary.uploader.upload(
                        front.tempFilePath, {
                        folder: `100acre/BuyCommercial/${propertyName}`
                    }

                    )
                    // console.log(imageResult)
                    if (other.length >= 2) {
                        for (let i = 0; i < other.length; i++) {
                            const otherResult = await cloudinary.uploader.upload(
                                other[i].tempFilePath, {
                                folder: `100acre/BuyCommercial/${propertyName}`
                            }
                            );
                            otherImageLink.push({
                                public_id: otherResult.public_id,
                                url: otherResult.secure_url
                            })
                        }
                    } else {
                        const otherResult = await cloudinary.uploader.upload(
                            other.tempFilePath, {
                            folder: `100acre/BuyCommercial/${propertyName}`
                        }
                        );
                        otherImageLink.push({
                            public_id: otherResult.public_id,
                            url: otherResult.secure_url
                        })
                    }
                    const data = new buyCommercial_Model({
                        frontImage: {
                            public_id: imageResult.public_id,
                            url: imageResult.secure_url
                        },
                        otherImage: otherImageLink,
                        propertyName:propertyName,
                        propertyType:propertyType,
                        availabledate:availableDate,
                        price: price,
                        state: state,
                        city: city,
                        address: address,
                        descripation: descripation,
                        amenities: amenities,
                        type: type,
                        area: area,
                        furnishing: furnishing,
                        landMark: landMark,
                        builtYear: builtYear

                    })
                    // cconsole.log(data)
                    await data.save()
                    res.status(201).json({
                        message: "data inserted successfully !",
                        dataget: data
                    })
                } else {
                    res.status(403).json({
                        message: "insert not  done",
                    })
                }
            } else {
                res.status(403).json({
                    message: "check your field ! ",
                })
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({
                error: "internal server error  !"
            })
        }

    }

    static viewAll = async (req, res) => {
        try {
           

            const data = await buyCommercial_Model.find()

            const data1 = await postPropertyModel.aggregate([
                {
                    $match: {
                        "postProperty.verify": "verified",
                        "postProperty.propertyLooking": "Sell"
                    }
                },
                {
                    $project: {
                        name: 1,
                        postProperty: {
                            $filter: {
                                input: "$postProperty",
                                as: "property",
                                cond: {
                                    $and: [
                                        { $eq: ["$$property.propertyLooking", "Sell"] },
                                        { $eq: ["$$property.verify", "verified"] }
                                    ]
                                }
                            }
                        }
                    }
                }
            ]);

            const collectdata=[...data,...data1]
            res.status(200).json({
             
                message: 'Data fetched from the database!',
                collectdata
              
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({
                message: 'internal server error'
            })
        }
    }
    // view by id 
    static buyView_id = async (req, res) => {
        try {
            const id = req.params.id;
            if (id) {
                const data = await buyCommercial_Model.findById({ _id: id })

                //  const data1=await postPropertyModel.findOne(
                //     { "postProperty._id": id },
                // {
                //     postProperty: {
                //         $elemMatch: {
                //             _id: id,
                //         },
                //     },
                // }
                //  )
                //  const postdata=data1.postProperty
                const postData= await postPropertyModel.findOne({ "postProperty._id": id },
                {
                    postProperty: {
                        $elemMatch: {
                            _id: id,
                        },
                    },
                }
            )
                if (data) {
                    res.status(200).json({
                        message: "data get successfully !! ",
                        data
                    })
                } else {
                    res.status(200).json({
                        message: "data get successfully ! ",
                        postData
                    })
                }
            }else{
                res.status(404).json({
                    message:"id does not found in url !"
                })
            }

        } catch (error) {
            console.log(error)
            res.status(500).json({
                message: "internal server error ! "
            })
        }
    }
 
    //    res.send('search with name and type')
    // static view_Name_type = async (req, res) => {
    //     try {

    //         const propertyName = req.params.propertyName;
    //         const type = req.params.type;
    //         const query = { propertyName: propertyName, type: type };
    //         const data = await buyCommercial_Model.find(query)
    //         res.status(200).json({
    //             message: "data get succesfull",
    //             data: data
    //         })

    //     } catch (error) {
    //         console.log(error)
    //         res.status(500).json({
    //             message: "something went wrong ! ",
    //         })
    //     }
    // }


    static buycommercialEdit = async (req, res) => {
        try {
            const id = req.params.id
            const data = await buyCommercial_Model.findById({_id:id})
            res.status(200).json({
                message: "data get successfully !!",
                dataedit: data
            })

        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "something went wrong ! "
            })
        }
    }

    static buycommercialUpdate = async (req, res) => {
        // res.send("listen update")
        try {
            const {propertyName, propertytype, availabledate, city, state, address, price, type, descripation, amenities, area, furnishing, landMark, builtYear } = req.body
           
                if (req.files) {

                    if (req.files.frontImage && req.files.otherImage) {
                        const front = req.files.frontImage;
                        const other = req.files.otherImage;
                        const otherImageLink = [];

                        const data = await buyCommercial_Model.findById(req.params.id)
                        const frontId = data.frontImage.public_id;
                        await cloudinary.uploader.destroy(frontId)

                        const frontResult = await cloudinary.uploader.upload(front.tempFilePath, {
                            folder: `100acre/BuyCommercial/${propertyName}`
                        })


                        if (other.length >= 2) {
                            for (let i = 0; i < other.length; i++) {
                                const otherResult = await cloudinary.uploader.upload(other[i].tempFilePath, {
                                    folder: `100acre/BuyCommercial/${propertyName}`
                                });
                                otherImageLink.push({
                                    public_id: otherResult.public_id,
                                    url: otherResult.secure_url
                                })
                            }
                        } else {
                            const imageResult = await cloudinary.uploader.upload(other.tempFilePath, {
                                folder: `100acre/BuyCommercial/${propertyName}`
                            });

                            otherImageLink.push({
                                public_id: imageResult.public_id,
                                url: imageResult.secure_url
                            });
                        }
                        const result = await buyCommercial_Model.findById(req.params.id)
                        for (let i = 0; i < result.otherImage.length; i++) {
                            otherImageLink.push(
                                result.otherImage[i]
                            );
                        }

                        const dataUpdate = await buyCommercial_Model.findByIdAndUpdate(req.params.id, {
                            frontImage: {
                                public_id: frontResult.public_id,
                                url: frontResult.secure_url
                            },
                            otherImage: otherImageLink,
                            propertyName:propertyName,
                            propertytype:propertytype,
                            availabledate:availabledate,
                            price: price,
                            state: state,
                            city: city,
                            address: address,
                            descripation: descripation,
                            amenities: amenities,
                            type: type,
                            area: area,
                            furnishing: furnishing,
                            landMark: landMark,
                            builtYear: builtYear
                        })
                        // console.log(dataUpdate)
                        await dataUpdate.save()
                        res.status(200).json({
                            message: "successfully updated !",
                            data: dataUpdate
                        })
                    } else if (req.files.frontImage) {
                        const front = req.files.frontImage;
                        const data = await buyCommercial_Model.findById(req.params.id)
                        const imageId = data.frontImage.public_id;
                        await cloudinary.uploader.destroy(imageId)

                        const imageResult = await cloudinary.uploader.upload(front.tempFilePath, {
                            folder: `100acre/BuyCommercial/${propertyName}`
                        })

                        const dataUpdate = await buyCommercial_Model.findByIdAndUpdate(req.params.id, {
                            frontImage: {
                                public_id: imageResult.public_id,
                                url: imageResult.secure_url
                            },
                            propertyName:propertyName,
                            propertytype:propertytype,
                            availabledate:availabledate,
                            price: price,
                            state: state,
                            city: city,
                            address: address,
                            descripation: descripation,
                            amenities: amenities,
                            type: type,
                            area: area,
                            furnishing: furnishing,
                            landMark: landMark,
                            builtYear: builtYear

                        })
                        // console.log(dataUpdate)
                        await dataUpdate.save()
                        res.status(200).json({
                            message: "successfully updatede !",
                            data: dataUpdate
                        })

                    }
                    else if (req.files.otherImage) {
                        const other = req.files.otherImage;
                        const otherImageLink = []

                        if (other.length >= 2) {
                            for (let i = 0; i < other.length; i++) {
                                const otherimage = await cloudinary.uploader.upload(other[i].tempFilePath, {
                                    folder: `100acre/BuyCommercial/${propertyName}`
                                })
                                otherImageLink.push({
                                    public_id: otherimage.public_id,
                                    url: otherimage.secure_url
                                })
                            }
                        } else {
                            const imageResult = await cloudinary.uploader.upload(other.tempFilePath, {
                                folder: `100acre/BuyCommercial/${propertyName}`
                            });

                            otherImageLink.push({
                                public_id: imageResult.public_id,
                                url: imageResult.secure_url
                            })

                        }

                        const result = await buyCommercial_Model.findById(req.params.id)
                        for (let i = 0; i < result.otherImage.length; i++) {
                            otherImageLink.push(
                                result.otherImage[i]
                            );
                        }
                        const dataUpdate = await buyCommercial_Model.findByIdAndUpdate(req.params.id, {

                            otherImage: otherImageLink,
                            propertyName:propertyName,
                            propertytype:propertytype,
                            availabledate:availabledate,
                            price: price,
                            state: state,
                            city: city,
                            address: address,
                            descripation: descripation,
                            amenities: amenities,
                            type: type,
                            area: area,
                            furnishing: furnishing,
                            landMark: landMark,
                            builtYear: builtYear
                        })
                        // console.log(dataUpdate)
                        await dataUpdate.save()
                        res.status(200).json({
                            message: "successfully updated !",
                            data: dataUpdate
                        })
                    }

                } else {
                    const dataset = await buyCommercial_Model.findByIdAndUpdate(req.params.id, {
                        propertyName:propertyName,
                        propertytype:propertytype,
                        availabledate:availabledate,
                        price: price,
                        state: state,
                        city: city,
                        address: address,
                        descripation: descripation,
                        amenities: amenities,
                        type: type,
                        area: area,
                        landMark: landMark,
                        furnishing: furnishing,
                        builtYear: builtYear
                    })
                    // console.log(dataset)
                    await dataset.save()
                    res.status(200).json({
                        message: "successfully updated !",
                        data: dataset
                    })
                }
           
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "something went wrong ! "
            })
        }
    }

    static buycommercialDelete = async (req, res) => {
        try {
            const id = req.params.id;
            // console.log(id)
            // const data = await buyCommercial_Model.findByIdAndDelete(id)
            const result = await buyCommercial_Model.findById(req.params.id)
            const imageId = result.frontImage.public_id
            await cloudinary.uploader.destroy(imageId)

            for (let i = 0; i < result.length; i++) {
                const otherResult = await buyCommercial_Model.findById(req.params.id)
                const otherId = otherResult.otherImage[i].public_id
                await cloudinary.uploader.destroy(otherId)
            }

            await buyCommercial_Model.findByIdAndDelete(req.params.id)

            res.status(200).json({
                message: "data deleted successfully !",
                // datadelete: data
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "something went wrong ! "
            })
        }
    }

}
module.exports = BuyController
