const svgParser = require('./footprintSvgParder');

module.exports = async (svg) => {
    return new Promise(async (resolve, reject) => {
        let Tab2 = [];
        let config = {
            offsetX : parseFloat(svg.properties.c_origin.split(',')[0]),
            offsetY : parseFloat(svg.properties.c_origin.split(',')[1])
        }
        svg.children.forEach(element => {
            switch (element.tagName) {
                case 'path':{
                    if (element.properties && element.properties.c_helper_type) {
                        if ( element.properties.c_helper_type == "arc2"){
                            let start = {
                                x : config.offsetX - parseFloat(element.properties.d.split(' ')[0].replace('M','').replace(',', ' ').split(' ')[0]),
                                y : config.offsetY - parseFloat(element.properties.d.split(' ')[0].replace('M','').replace(',', ' ').split(' ')[1])
                            }

                            let mid = {
                                x : parseFloat(element.properties.d.split(' ')[1].replace('A','').replace(',', ' ').split(' ')[0]),
                                y : parseFloat(element.properties.d.split(' ')[1].replace('A','').replace(',', ' ').split(' ')[1])
                            }

                            let end = {
                                x : config.offsetX -  parseFloat(element.properties.d.split(' ')[5].replace('A','').replace(',', ' ').split(' ')[0]) ,
                                y : config.offsetY -  parseFloat(element.properties.d.split(' ')[5].replace('A','').replace(',', ' ').split(' ')[1])  
                            }
                            let _str = "(fp_arc (center "
                            _str += start.x + " " + (start.y + mid.y);
                            _str += ") ";
                        /*    _str += "(mid ";
                            _str += mid.x + " "+ mid.y;
                            _str += ") ";*/
                            _str += "(end ";
                            _str += end.x + " "+ end.y;
                            _str += ") ";
                            _str += "(angle 180)";
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
                    break;
                }
                case 'polyline': {
                    if (element.properties && element.properties.c_shapetype) {
                        switch (element.properties.c_shapetype) {
                            case 'line':{
                                let polylineLength = (element.properties.points.replace(',', ' ').split(' ').length - 2 ) / 2;
                                let offset = 0;
                                for ( let i = 0 ; i < polylineLength ; i++ ){
                                    let _str = "(fp_line (start "
                                    _str += config.offsetX - parseFloat(element.properties.points.replace(',', ' ').split(' ')[offset+0]);
                                    _str += " ";
                                    _str += config.offsetY - parseFloat(element.properties.points.replace(',', ' ').split(' ')[offset+1]);
                                    _str += ") ";
                                    _str += "(end ";
                                    _str += config.offsetX - parseFloat(element.properties.points.replace(',', ' ').split(' ')[offset+2]);
                                    _str += " ";
                                    _str += config.offsetY - parseFloat(element.properties.points.replace(',', ' ').split(' ')[offset+3]);
                                    _str += ") ";

                                    offset += 2;
                                    
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
                                }
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
                                _str += element.properties.c_shape.toLowerCase();
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
                default:
                    break;
            }
        });

        resolve(Tab2);
    });
}
