const jlcpcb = require('./src');
const kicad = require('./src/kicad');
const fs = require('fs');
const path = require('path');

async function _saveFile(p, filename, data) {
    if (fs.existsSync(p) == false) {
        fs.mkdirSync(p);
    }

    if (fs.existsSync(p) == true) {
        fs.writeFileSync(path.resolve(p, filename.replace('\\' , '_').replace('/' , '_')), data);
    }

    return;
}


async function _app(){
  try {
    let symbols = [];
    let librarieName = process.argv[2];
    for (let i = 3; i < process.argv.length; i++) {
      let component = await jlcpcb.getComponent(process.argv[i]);
      
       let _s = await jlcpcb.getSymbol(component);
       symbols.push(_s);
      
      let footprints = await jlcpcb.getFootprint(component);

      await _saveFile(path.resolve(__dirname, "out/" , librarieName + ".pretty") , component.manufacturerPartnumber + ".kicad_mod" , footprints);

    }

    await kicad.generateLib(symbols,librarieName);

  } catch (ex) {
    console.error(ex);
  }
}


_app();