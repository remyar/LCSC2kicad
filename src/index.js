const actions = require('./action');
const SVGJson = require('svg-parser')
const getComponentFromSvg = require('./get.component.from.svg')

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

        let svg = SVGJson.parse(sch.svg);
        let component = getChildrenWithParam(svg.children[0] || [], 'c_para');
        if ( component ){
            let kicadComponent = await getComponentFromSvg(component);
        }

        Tab.push("EESchema-LIBRARY Version 2.3");
        Tab.push("#encoding utf-8");

    } catch (err) {
        console.error(err);
        return;
    }

}