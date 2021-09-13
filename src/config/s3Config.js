require("dotenv").config();

module.exports = {
  s3Bucket: process.env.AVATAR_BUCKET_NAME,
  accessKey: process.env.AVATAR_WRITE_USER_KEY,
  accessKeyId: process.env.AVATAR_WRITE_USER_KEY_ID,
};
