const fs=require('fs');
const AWS=require('aws-sdk');
require("dotenv").config();
AWS.config.update({
    secretAccessKey: process.env.secretAccessKey||'5m4gjdQ3qccnByCAar/0r53E46144I1gE2o76JJF',
    accessKeyId: process.env.accessKeyId|| 'AKIATNVEVZYXWHKME665',
  region:process.env.region||'ap-south-1',
})

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