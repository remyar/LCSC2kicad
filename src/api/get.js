const axios = require('axios').default;
const MessageBuffer = require('./MessageBuffer');
const Buffer = new MessageBuffer("</html>\n");

module.exports = async (url) => {
    return new Promise(async (resolve, reject) => {
        try {
            let resp = await axios.get(url);
           resolve(resp.data)
        } catch (err) {
            reject(err);
        }
    });
}
