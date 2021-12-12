const svgParser = require('./footprintSvgParder');

module.exports = async (svg) => {
    return new Promise(async (resolve, reject) => {
        let sd = new svgParser(svg);
    });
}
