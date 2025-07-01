const shopModel  = require("../models/Shop.js");
const { KEYS } = require("../config/keys.js");
const { randomBytes } = require('crypto');

const jwt = require('jsonwebtoken');

exports.updateJwtTokens = async () => {
    const shop = KEYS?.LUBIFY_SHOPIFY_DOMAIN
    const accessToken = KEYS?.LUBIFY_SHOPIFY_ACCESS_TOKEN;
    const salt = randomBytes(16).toString('hex');
    console.log("salt : ",salt)
    let data = JSON.stringify({
    "metafield": {
        "namespace": "lubify-data",
        "key": "salt",
        "type": "single_line_text_field",
        "value": salt
    }
    });
    const url = `https://${shop}/admin/api/${KEYS?.SHOPIFY_API_VERSION}/metafields.json`;
    const metafield = await fetch(url, {
        method: "POST",
        headers: {
            "X-Shopify-Access-Token": `${accessToken}`,
            "Content-Type": "application/json",
        },
        body: data
    });
    
    const metafiieldResponse = await metafield.json();
    console.log("Creating metafield service Result => ", metafiieldResponse);
    const shopData = await shopModel.findOne({shop});
    if(shopData){
        await shopModel.findOneAndUpdate({shop},{ salt },{new:true});
        return ;        
    }
    await shopModel.create({shop, salt });
  return ;
}
