import httpCodes from "http-codes";

export const catchErrors = (fn) => (request, response, next) => fn(request, response, next).catch((e) => {
  const message = e?.message ?? ["Internal Server Error"];

  if (e.response) {
    e.status = e.response.status;
  } else {
    e.status = 500;
  }
  console.log(e);
  return response.status(e.status).json({ error: message });
});

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return;
  }
  const message = err?.message ?? ["Internal Server Error"];

  if (err.response) {
    err.status = err.response.status;
  } else {
    err.status = httpCodes.INTERNAL_SERVER_ERROR;
  }

  res.status(err.status).json({ error: message });
};

export default errorHandler;
