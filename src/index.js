const actions = require('./action');
const SVGJson = require('svg-parser');
const getComponentFromSvg = require('./get.component.from.svg');
const getFootprintFromSvg = require('./get.footprint.from.svg');
const fs = require('fs');
const path = require('path');

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

module.exports = async (url) => {

    try {
        let Tab = [];
        let component = await actions.get(url);
        let sch = component.svgs.find((x) => x.docType == 2);
        let footprint = component.svgs.find((x) => x.docType == 4);
        let kicadComponent = [];
        let svg = SVGJson.parse(sch.svg);
        let _component = getChildrenWithParam(svg.children[0] || [], 'c_para');
        if (_component) {
            kicadComponent = await getComponentFromSvg(_component);
        }

        Tab.push("EESchema-LIBRARY Version 2.3");
        Tab.push("#encoding utf-8");
        Tab.push('#');
        Tab.push('# ' + component.manufacturerPartnumber);
        Tab.push('#');
        Tab.push('DEF ' + component.manufacturerPartnumber + ' MES 0 5 Y Y 1 F N');
        Tab.push('F0 "MES" -130 40 50 H V R CNN');
        Tab.push('F1 "' + component.manufacturerPartnumber + '" -130 -30 50 H V R CNN');
        Tab.push('F2 "" 0 100 50 V I C CNN');
        Tab.push('F3 "" 0 100 50 V I C CNN');
        Tab.push('DRAW');
        Tab.push(...kicadComponent);
        Tab.push('ENDDRAW');
        Tab.push('ENDDEF');
        Tab.push('#');
        Tab.push('#End Library');


        let str = Tab.join("\n");

        fs.writeFileSync(path.resolve(__dirname, "../"+ new Date().getTime() +".lib"), str);


        if ( footprint ){
            let _footprint = getChildrenWithParam(SVGJson.parse(footprint.svg).children[0] || [], 'c_para');
            if (_footprint) {
                let kicadFootprint = await getFootprintFromSvg(_footprint);
                Tab = [];

                Tab.push("(module " + component.manufacturerPartnumber + " (layer F.Cu)");
                Tab.push(...kicadFootprint);
                Tab.push(")");

                let str = Tab.join("\n");

                fs.writeFileSync(path.resolve(__dirname, "../"+ new Date().getTime() +".kicad_mod"), str);
            }
        }




    } catch (err) {
        console.error(err);
        return;
    }

}