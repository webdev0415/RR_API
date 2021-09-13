import aws from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import { v4 as uuidv4 } from "uuid";
import config from "../config/s3Config";

const s3 = new aws.S3({
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.accessKey,
  apiVersion: "2006-03-01",
});

const getUniqFileName = (originalname) => {
  const name = uuidv4();
  const ext = originalname.split(".").pop();
  return `${name}.${ext}`;
};

const isAllowedMimetype = (mime) => ["image/png", "image/jpg", "image/jpeg", "image/gif"].includes(mime.toString());

const fileFilter = (req, file, callback) => {
  const fileMime = file.mimetype;
  if (isAllowedMimetype(fileMime)) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

const uploader = multer({
  fileFilter,
  storage: multerS3({
    s3,
    bucket: config.s3Bucket,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const fileName = getUniqFileName(file.originalname);
      const finalPath = fileName;
      file.newName = fileName;
      cb(null, finalPath);
    },
  }),
}).single("file");

export const deleteFile = (fileId, cb) => {
  const deleteParam = {
    Bucket: config.s3Bucket,
    Key: fileId,
  };

  s3.deleteObject(deleteParam, (err, data) => {
    if (err) {
      throw err;
    }
    if (typeof cb === "function") {
      cb(err, data);
    }
  });
};

export default uploader;
