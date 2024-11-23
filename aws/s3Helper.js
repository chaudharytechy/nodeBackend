const fs=require('fs');
const AWS=require('aws-sdk');
require("dotenv").config();

const s3=new AWS.S3();

const uploadFile=(file)=>{

  // Read the file content
  // console.log(file)
  const fileContent = fs.readFileSync(file.path);

  const params = {
    Bucket: '100acress-media-bucket', // You can use environment variables for sensitive data like bucket name
    Key: `uploads/${file.filename}`,  // Store the file with a unique name in the 'uploads/' folder
    Body: fileContent,
    ContentType: file.mimetype,
  };

  // Return the promise from s3.upload
  return s3.upload(params).promise();

}
module.exports=uploadFile;