import httpCodes from "http-codes";

class BaseController {
  serverError = (res, errr) => {
    // TODO: logging error
    const err = {
      message: errr?.message || "Something went wrong no our side.",
      errors: ["Please check logs"],
      code: httpCodes.INTERNAL_SERVER_ERROR,
    };

    return res.status(httpCodes.INTERNAL_SERVER_ERROR).json(err);
  };

  badRequest = (res, errors, message = "") => {
    // TODO: logging error
    const err = {
      errors,
      message: message || "Bad request",
      code: httpCodes.BAD_REQUEST,
    };

    return res.status(httpCodes.BAD_REQUEST).json(err);
  };

  success = (res, data) => res.status(httpCodes.OK).json(data);

  unAuthorized = (res, error) => res.status(httpCodes.UNAUTHORIZED).json(error);

  notFound = (res, error) => res.status(httpCodes.NOT_FOUND).json(error);

  noContent = (res) => res.status(httpCodes.NO_CONTENT).send();
}

export default BaseController;
