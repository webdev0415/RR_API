const fetch = require("node-fetch");

export const addWebHookAddress = async (newAddress) => {
  console.log(`adding address ${newAddress}`);
  const body = { webhook_id: process.env.ALCHEMY_WEBHOOK_ID, addresses_to_add: [newAddress], addresses_to_remove: [] };
  try {
    const result = await fetch("https://dashboard.alchemyapi.io/api/update-webhook-addresses", {
      method: "PATCH",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json", "X-Alchemy-Token": process.env.ALCHEMY_AUTH_TOKEN },
    });
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

