const actions = require('./action');
const SVGJson = require('svg-parser');
const getComponentFromSvg = require('./get.component.from.svg');
const getFootprintFromSvg = require('./get.footprint.from.svg');


function getChildrenWithParam(children, param) {

    if (children.properties && children.properties[param] != undefined) {
        return children;
    } else {
        for (let i = 0; i < children?.children?.length || 0; i++) {
            let c = children.children[i];

            let result = getChildrenWithParam(c, param);
            if (result !== false) {
                return result;
            }

        }

        return false;
    }
}

async function getComponent(url) {
    try {
        let component = await actions.get(url);
        if (component) {
            return component;
        } else {
            throw Error("blabla bla");
        }
    } catch (err) {

    }
}

async function getSymbol(component, librarieName) {
    try {
        let Tab = [];
        let _indexComponent = "Q";

        let sch = component.svgs.find((x) => x.docType == 2);

        let kicadComponent = [];
        let svg = SVGJson.parse(sch.svg);
        let _component = getChildrenWithParam(svg.children[0] || [], 'c_para');
        if (_component) {
            kicadComponent = await getComponentFromSvg(_component);
            let bomSp = "";
            if (typeof _component.properties.c_para == "string") {
                let c_param = _component.properties.c_para;
                let result = c_param.match(/pre`([^`]*)?`/i);

                _indexComponent = result[1].replace("?", "");


                bomSp = c_param.match(/BOM_Supplier Part`([^`]*)?`/i)[1];

            }

            let y = parseFloat(_component.properties.c_origin.split(',')[1]) + 100;


            Tab.push('#');
            Tab.push('# ' + component.manufacturerPartnumber);
            Tab.push('#');
            Tab.push('DEF ' + component.manufacturerPartnumber + ' ' + _indexComponent + ' 0 5 Y Y 1 F N');
            Tab.push('F0 "' + _indexComponent + '" 0 ' + y + ' 50 H V C CNN');
            Tab.push('F1 "' + component.manufacturerPartnumber + '" 0 -' + y + ' 50 H V C CNN');
            Tab.push('F2 "' + librarieName + ':' + component.manufacturerPartnumber.replace('/', '_').replace('\\', '_') + '" 0 100 50 V I C CNN');
            Tab.push('F3 "" 0 100 50 V I C CNN');
            Tab.push('F4 "' + bomSp + '" 0 100 50 V I C CNN "LCSC"');
            Tab.push('DRAW');
            Tab.push(...kicadComponent);
            Tab.push('ENDDRAW');
            Tab.push('ENDDEF');
            Tab.push('#');



            let str = Tab.join("\n");

            //fs.writeFileSync(path.resolve(__dirname, "../" + new Date().getTime() + ".lib"), str);
            return str;
        }
        /*
                if (footprint) {
                    let _indexComponent = "Q";
        
                    let _footprint = getChildrenWithParam(SVGJson.parse(footprint.svg).children[0] || [], 'c_para');
                    if (_footprint) {
                        let kicadFootprint = await getFootprintFromSvg(_footprint);
                        Tab = [];
        
                        if (typeof _footprint.properties.c_para == "string") {
                            let c_param = _component.properties.c_para;
                            let result = c_param.match(/pre`([^`]*)?`/i);
        
                            _indexComponent = result[1].replace("?", "**");
                        }
        
                        Tab.push("(module " + component.manufacturerPartnumber + " (layer F.Cu)");
                        Tab.push("(fp_text reference " + _indexComponent + " (at 0 " + (-(footprint.bbox.height / 4) + 1.27) + ") (layer F.SilkS) (effects (font (size 1 1) (thickness 0.15))))");
                        Tab.push("(fp_text value " + component.manufacturerPartnumber + " (at 0 " + ((footprint.bbox.height / 4) - 1.27) + ") (layer F.SilkS) (effects (font (size 1 1) (thickness 0.15))))");
                        Tab.push(...kicadFootprint);
                        Tab.push(")");
        
                        let str = Tab.join("\n");
        
                       // fs.writeFileSync(path.resolve(__dirname, "../" + new Date().getTime() + ".kicad_mod"), str);
                    }
                }*/
    } catch (err) {
        console.error(err);
        return;
    }

}

async function getFootprint(component) {
    try {
        let Tab = [];
        //     let _indexComponent = "Q";

        let sch = component.svgs.find((x) => x.docType == 2);
        let footprint = component.svgs.find((x) => x.docType == 4);
        //    let kicadComponent = [];
        let svg = SVGJson.parse(sch.svg);
        let _component = getChildrenWithParam(svg.children[0] || [], 'c_para');
        /*        if (_component) {
                   kicadComponent = await getComponentFromSvg(_component);
                   let bomSp = "";
                   if (typeof _component.properties.c_para == "string") {
                       let c_param = _component.properties.c_para;
                       let result = c_param.match(/pre`([^`]*)?`/i);
       
                       _indexComponent = result[1].replace("?", "");
       
       
                       bomSp = c_param.match(/BOM_Supplier Part`([^`]*)?`/i)[1];
       
                   }
       
                   let y = parseFloat(_component.properties.c_origin.split(',')[1]) + 100;
       
                   Tab.push("EESchema-LIBRARY Version 2.3");
                   Tab.push("#encoding utf-8");
                   Tab.push('#');
                   Tab.push('# ' + component.manufacturerPartnumber);
                   Tab.push('#');
                   Tab.push('DEF ' + component.manufacturerPartnumber + ' ' + _indexComponent + ' 0 5 Y Y 1 F N');
                   Tab.push('F0 "' + _indexComponent + '" 0 ' + y + ' 50 H V C CNN');
                   Tab.push('F1 "' + component.manufacturerPartnumber + '" 0 -' + y + ' 50 H V C CNN');
                   Tab.push('F2 "" 0 100 50 V I C CNN');
                   Tab.push('F3 "" 0 100 50 V I C CNN');
                   Tab.push('F4 "' + bomSp + '" 0 100 50 V I C CNN "LCSC"');
                   Tab.push('DRAW');
                   Tab.push(...kicadComponent);
                   Tab.push('ENDDRAW');
                   Tab.push('ENDDEF');
                   Tab.push('#');
                   Tab.push('#End Library');
       
       
                   let str = Tab.join("\n");
       
                   //fs.writeFileSync(path.resolve(__dirname, "../" + new Date().getTime() + ".lib"), str);
                   return str;
               }
       */
        if (footprint) {
            let _indexComponent = "Q";

            let _footprint = getChildrenWithParam(SVGJson.parse(footprint.svg).children[0] || [], 'c_para');
            if (_footprint) {
                let kicadFootprint = await getFootprintFromSvg(_footprint);
                Tab = [];

                if (typeof _footprint.properties.c_para == "string") {
                    let c_param = _component.properties.c_para;
                    let result = c_param.match(/pre`([^`]*)?`/i);

                    _indexComponent = result[1].replace("?", "**");
                }

                Tab.push("(module " + component.manufacturerPartnumber + " (layer F.Cu)");
                Tab.push("(fp_text reference " + _indexComponent + " (at 0 " + (-(footprint.bbox.height / 4) + 1.27) + ") (layer F.SilkS) (effects (font (size 1 1) (thickness 0.15))))");
                Tab.push("(fp_text value " + component.manufacturerPartnumber + " (at 0 " + ((footprint.bbox.height / 4) - 1.27) + ") (layer F.SilkS) (effects (font (size 1 1) (thickness 0.15))))");
                Tab.push(...kicadFootprint);
                Tab.push(")");

                let str = Tab.join("\n");

                // fs.writeFileSync(path.resolve(__dirname, "../" + new Date().getTime() + ".kicad_mod"), str);

                return str;
            }
        }
    } catch (err) {
        console.error(err);
        return;
    }
}


module.exports = {
    getSymbol,
    getFootprint,
    getComponent
}