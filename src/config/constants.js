
module.exports = Object.freeze({
  SALE_STATUS: { // define constants for salesStatus field in transaction table
    SALE_STATUS_FOR_SALE: 1,
    SALE_STATUS_SALE_PENDING: 2,
    SALE_STATUS_TRANSFER_PENDING: 3,
    SALE_STATUS_PAYMENT_PENDING: 4,
    SALE_STATUS_NOT_FOR_SALE: 5,
  },
  CART_LIMIT_SETTING_NAME: {
    car: "cartCarLimit",
    gasstation: "cartStationLimit",
    racetrackland: "cartTrackLimit",
    mechanicshop: "cartShopLimit",
  },

  ASSET_TYPE_ALL: ["car", "gasstation", "racetrackland", "mechanicshop"],
});
