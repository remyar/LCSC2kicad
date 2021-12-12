export default class {
    constructor(svgString , smooothness = 0.1) {
        this.ALIGN_CENTER = 0;
        this.ALIGN_TOP  = 1;
        this.ALIGN_BOTTOM  = 2;
        this.ALIGN_LEFT  = 3;
        this.ALIGN_RIGHT  = 4;

        this.svgUnitsTable = {
            "px" : 1.0,
            "pt": 1.25,
            "pc": 15,
            "mm": 3.543307,
            "cm": 35.43307,
            "in": 90.0
        }

        this.smooothness = smooothness;


    }

    recursivelyTraverseSvg(nodeList=undefined , matCurrent=[[1.0, 0.0, 0.0], [0.0, 1.0, 0.0]], parent_visibility='visible' ){

    }

}