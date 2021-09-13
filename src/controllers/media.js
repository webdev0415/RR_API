import { ProfileAssets } from "models";
import { deleteFile } from "../middleware/s3";
import BaseController from "../utils/baseController";

export default class MediaController extends BaseController {
  create = async (req, res) => {
    if (req.file) {
      const {
        originalname, mimetype, key: fileId, size, location: uri,
      } = req.file;
      const asset = await ProfileAssets.create({
        originalname, mimetype, fileId, size, uri,
      });
      return this.success(res, { assetId: asset.id });
    }
    return this.badRequest(res, { error: "Bad request!" });
  };

  remove = async (req, res) => {
    const cb = (err, results) => {
      if (!err) {
        return this.noContent(res);
      }
      return this.badRequest(res, { error: "Bad request!" });
    };
    deleteFile(req.body.fileId, cb);
  };
}
