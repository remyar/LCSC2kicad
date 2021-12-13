const SVGJson = require('svg-parser');
const simpletransform = require('./simpleTransform');

class svgParser {

    constructor(svgString, smooothness = 0.1) {
        this.ALIGN_CENTER = 0;
        this.ALIGN_TOP = 1;
        this.ALIGN_BOTTOM = 2;
        this.ALIGN_LEFT = 3;
        this.ALIGN_RIGHT = 4;

        this.svgUnitsTable = {
            "px": 1.0,
            "pt": 1.25,
            "pc": 15,
            "mm": 3.543307,
            "cm": 35.43307,
            "in": 90.0
        }

        this.smooothness = smooothness;

        this.svgRoot = SVGJson.parse(svgString);
    }

    parseLengthAndUnits(string) {
        let s = string.trim();
        let u = "px";

        if (this.svgUnitsTable[s.substr(s.length - 2)] != undefined) {
            u = s.substr(s.length - 2);
            s = s.replace(u, "");
        }

        return {
            value: parseFloat(s),
            units: u
        }

    }

    recursivelyTraverseSvg(nodeList = undefined, matCurrent = [[1.0, 0.0, 0.0], [0.0, 1.0, 0.0]], parent_visibility = 'visible') {

        if (nodeList == undefined) {
            nodeList = [];

            let width = this.parseLengthAndUnits(this.svgRoot.children[0].properties.width).value;
            let units_width = this.parseLengthAndUnits(this.svgRoot.children[0].properties.width).units;
            let height = this.parseLengthAndUnits(this.svgRoot.children[0].properties.height).value;
            let units_height = this.parseLengthAndUnits(this.svgRoot.children[0].properties.height).units;

            if (units_width != units_height) {
                console.error("Weird, units for SVG root document width and height differ...");
            }

            //-- set initial viewbox from document root
            let viewbox = this.svgRoot.children[0].properties.viewBox;
            console.log("Document size: " + width + " x " + height + " (" + units_width + ")");
            if (viewbox) {
                let vinfo = viewbox.trim().replace(/,/g, ' ').split(' ');
                if ((vinfo[2] != 0) && (vinfo[3] != 0)) {
                    let sx = width / parseFloat(vinfo[2]);
                    let sy = height / parseFloat(vinfo[3]);

                    matCurrent = simpletransform.parseTransform("scale(" + sx + ", " + sy + ") translate(" + (-parseFloat(vinfo[0])) + ", " + (-parseFloat(vinfo[1])) + ")")
                }
            }

            console.log("Initial transformation matrix:", matCurrent);
        }

        let Tab = [];

        function _parseChildren(n) {

            


            if (n.children && n.children.length > 0) {
                n.children.forEach((el) => {
                    return _parseChildren(el);
                });
            } else {
                
            }

        }

        this.svgRoot.children.forEach(node => {
            _parseChildren(node);
        });



        nodeList.forEach((node) => {
            let v = node.properties && node.properties.visibility || parent_visibility;
            if (v == 'inherit') {
                v = parent_visibility
            } else if ((v == 'hidden') || (v == 'collapse')) {
                return;
            }

            //-- first apply the current matrix transform to this node's transform
            let matNew = simpletransform.composeTransform(matCurrent, simpletransform.parseTransform(node.properties && node.properties.tranform || ""));

            switch (node.tagName) {
                case 'path': {
                    break;
                }
                case 'rect': {
                    let _s = '(fp_rect ';
                    _s += '(start ' + node.properties.x + ' ' + node.properties.y + ') ';
                    _s += '(end ' + (node.properties.x + node.properties.width) + ' ' + (node.properties.y + node.properties.height) + ') ';
                    _s += ')'
                    Tab.push(_s);
                    break;
                }
            }
        });


        return Tab;
    }
}

module.exports = svgParser;