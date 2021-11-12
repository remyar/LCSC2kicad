
let config = {
    unit : '100',
    convert : '1',
    thickness :'10',
    fill : 'N'
}

module.exports = async (svg) => {
    return new Promise(async (resolve, reject) => {
        let str = "";

        svg.children.forEach(element => {
            let Tab = [];

            switch (element.tagName) {
                case 'rect': {
                    //-- draw rectangle
                    Tab.push("S");
                    Tab.push((parseInt(element.properties.x) * 10 ).toString());
                    Tab.push((parseInt(element.properties.y) * 10 ).toString());
                    Tab.push((parseInt((element.properties.x + element.properties.width)) * 10 ).toString());
                    Tab.push((parseInt((element.properties.y + element.properties.height)) * 10 ).toString());
                    Tab.push(config.unit);
                    Tab.push(config.convert);
                    Tab.push(config.thickness);
                    Tab.push(config.fill);              
                    break;
                }
                case 'ellipse': {
                  //  str += "C " + element.properties.cx + " " + element.properties.cy + " " + element.properties.rx + " " + config.unit + " " + config.convert + " " + config.thickness + " "  + config.fill + "\n";
                 //   C posx posy radius unit convert thickness fill
                    break;
                }case 'g':{
                    if ( element.properties && element.properties.c_etype ){
                        switch(element.properties.c_etype){
                            case 'pinpart': {
                                let pinName = "";
                                element.children.forEach((el) => {
                                    if ( el.tagName == "text" ){
                                        if ( el.children && el.children[0].value != element.properties.c_spicepin.toString()){
                                            pinName = el.children[0].value || "";
                                        }
                                    }
                                });
                                Tab.push("X");
                                Tab.push(pinName);
                                Tab.push(element.properties.c_spicepin.toString());
                                Tab.push((parseInt(element.properties.c_origin.split(',')[0]) * 10 ).toString());
                                Tab.push((parseInt(element.properties.c_origin.split(',')[1]) * 10 ).toString());
                                Tab.push("200");
                                Tab.push("R");
                                Tab.push("50");
                                Tab.push("50");
                                Tab.push("0");
                                Tab.push("0");
                                Tab.push("U");
                                break;
                            }
                        }
                    }
                    break;
                }
            }
            str += Tab.join(' ') + "\n";
        });

        resolve(str);
    });
}