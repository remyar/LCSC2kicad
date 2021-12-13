const svgParser = require('./footprintSvgParder');

module.exports = async (svg) => {
    return new Promise(async (resolve, reject) => {
        let Tab2 = [];
        let config = {
            offsetX : parseFloat(svg.properties.c_origin.split(',')[0]),
            offsetY : parseFloat(svg.properties.c_origin.split(',')[1])
        }
        svg.children.forEach(element => {
            let Tab = [];
            switch (element.tagName) {
                case 'polyline': {
                    if (element.properties && element.properties.c_shapetype) {
                        switch (element.properties.c_shapetype) {
                            case 'line':{
                                let _str = "(fp_line (start "
                                _str += config.offsetX - parseFloat(element.properties.points.replace(',', ' ').split(' ')[0]);
                                _str += " ";
                                _str += config.offsetY - parseFloat(element.properties.points.replace(',', ' ').split(' ')[1]);
                                _str += ") ";
                                _str += "(end ";
                                _str += config.offsetX - parseFloat(element.properties.points.replace(',', ' ').split(' ')[2]);
                                _str += " ";
                                _str += config.offsetY - parseFloat(element.properties.points.replace(',', ' ').split(' ')[3]);
                                _str += ") ";

                                _str += "(layer ";
                                switch (element.properties.layerid) {
                                    case 3: {
                                        _str += "F.SilkS";
                                        break;
                                    }
                                }
                                _str += ") ";
                                _str += "(width ";
                                _str += element.properties["stroke-width"]
                                _str += "))";
                                Tab2.push(_str);
                                break;
                            }
                        }
                    }
                    break;
                }
                case 'g': {
                    if (element.properties && element.properties.c_etype) {
                        switch (element.properties.c_etype) {
                            case 'pinpart': {
                                let _str = "(pad " + element.properties.number + " " + (element.properties.plated == 'Y' ? "smd" : "");
                                _str += " ";
                                _str += element.properties.c_shape == "OVAL" ? "oval" : "";
                                _str += " ";
                                _str += "(at ";
                                _str += config.offsetX - parseFloat(element.properties.c_origin.replace(',', ' ').split(' ')[0]);
                                _str += " ";
                                _str += config.offsetY - parseFloat(element.properties.c_origin.replace(',', ' ').split(' ')[1]);
                                _str += ") ";
                                _str += "(size ";
                                _str += element.properties.c_width;
                                _str += " ";
                                _str += element.properties.c_height;
                                _str += ") ";
                                _str += "(layers ";
                                switch (element.properties.layerid) {
                                    case 1: {
                                        _str += "F.Cu ";
                                        _str += "F.Paste ";
                                        _str += "F.Mask ";
                                        break;
                                    }
                                }
                                _str += ")";
                                _str += ")";
                                Tab2.push(_str);
                                break;
                            }
                        }
                    }
                    break;
                }
            }
            if (Tab.length > 0) {
                Tab2.push(Tab.join(' '));
            }
        });
    });
}
