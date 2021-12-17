const fs = require('fs');
const path = require('path');

async function _saveFile(p, filename, data) {
    if (fs.existsSync(p) == false) {
        fs.mkdirSync(p, { recursive: true });
    }

    if (fs.existsSync(p) == true) {
        fs.writeFileSync(path.resolve(p, filename.replace('\\' , '_').replace('/' , '_')), data);
    }

    return;
}

async function generateLib(symbols , librarieName) {

    let str = "EESchema-LIBRARY Version 2.3\r\n";
    str += "#encoding utf-8\r\n";

    symbols.forEach(element => {
        str += element
    });

    str += '\r\n#End Library';

    try{
        await _saveFile(path.resolve(__dirname, "../out/"), librarieName + ".lib", str);
    }catch(err){
        console.log(err)
    }
    return;
}

async function generateFootprints(footprints)
{

}
module.exports = {
    generateLib
}

