require("dotenv").config();

const { PAGE_ITEM_LIMIT = 9 } = process.env;

export const paginate = (page, size) => {
  const limit = size ? +size : parseInt(PAGE_ITEM_LIMIT, 10);
  const offset = page ? page * limit : 0;
  return {
    limit,
    offset,
  };
};
