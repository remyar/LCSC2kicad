const api = require('../api');
const HTMLParser = require('node-html-parser');

module.exports = async (url) => {
    try {
        let component = {
            svgs : []
        };

        let response = await api.get(url);
        let html = HTMLParser.parse(response);
        component.lcscPartNumber = html.querySelector("#app > div > main > div > div > div.padX.padY.base > div > div > div.left > div.product-info > div.desc > table > tbody > tr:nth-child(3) > td:nth-child(2)").innerHTML;
        component.manufacturerPartnumber = html.querySelector("#app > div > main > div > div > div.padX.padY.base > div > div > div.left > div.product-info > div.desc > table > tbody > tr:nth-child(2) > td:nth-child(2)").innerHTML;
        component.datasheet = html.querySelector("#app > div > main > div > div > div.padX.padY.base > div > div > div.left > div.product-info > div.desc > table > tbody > tr:nth-child(6) > td:nth-child(2) > a").attributes?.href;
        component.description = html.querySelector("#app > div > main > div > div > div.padX.padY.base > div > div > div.left > div.product-info > div.desc > table > tbody > tr:nth-child(8) > td:nth-child(2)").innerHTML;

        let respSvgs = await api.get("https://easyeda.com/api/products/" + component.lcscPartNumber + "/svgs");
        if ( respSvgs?.result ){
            component.svgs = respSvgs.result; 
        } 
        
        return component;

    } catch (err) {
        console.error(err);
        return [];
    }
}
