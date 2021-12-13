
function parseTransform(transf, mat = [[1.0, 0.0, 0.0], [0.0, 1.0, 0.0]]) {
    if (transf == undefined || transf.length == 0 ) {
        return mat;
    }

    let stransf = transf.trim();
    let result = stransf.match("(translate|scale|rotate|skewX|skewY|matrix)\s*\(([^)]*)\)\s*,?");

    //-- translate --
    if (result[1] == "translate") {
        let args = [];
        result[2].replace(',', ' ').split(' ').forEach(element => {
            if (element.length > 0) { args.push(element.replace('(', '').replace(')', '')); }
        });

        let dx = parseFloat(args[0]);
        let dy = 0.0;
        if (args.length == 1) {
            dy = 0.0;
        } else {
            dy = parseFloat(args[1]);
        }

        matrix = [[1, 0, dx], [0, 1, dy]]
    }

    //-- scale --
    if (result[1] == "scale") {
        let args = [];
        result[2].replace(',', ' ').split(' ').forEach(element => {
            if (element.length > 0) { args.push(element.replace('(', '').replace(')', '')); }
        });
        let sx = parseFloat(args[0].replace('(', '')) * Math.PI / 180;
        let sy = sx;
        if (args.length == 1) {
            sy = sx;
        } else {
            sy = parseFloat(args[1])
        }
        matrix = [[sx, 0, 0], [0, sy, 0]];
    }

    //-- rotate --
    if (result[1] == "rotate") {

    }

    //-- skewX  --
    if (result[1] == "skewX") {

    }

    //-- skewY   --
    if (result[1] == "skewY") {

    }

    //-- matrix    --
    if (result[1] == "matrix") {

    }

    if ((result[0].length + 1) < stransf.length) {
        return parseTransform(stransf.substr(result[0].length + 1, stransf.length), matrix)
    } else {
        return matrix;
    }
}

function composeTransform(M1 , M2 ){
    a11 = M1[0][0]*M2[0][0] + M1[0][1]*M2[1][0]
    a12 = M1[0][0]*M2[0][1] + M1[0][1]*M2[1][1]
    a21 = M1[1][0]*M2[0][0] + M1[1][1]*M2[1][0]
    a22 = M1[1][0]*M2[0][1] + M1[1][1]*M2[1][1]

    v1 = M1[0][0]*M2[0][2] + M1[0][1]*M2[1][2] + M1[0][2]
    v2 = M1[1][0]*M2[0][2] + M1[1][1]*M2[1][2] + M1[1][2]
    return [[a11,a12,v1],[a21,a22,v2]]
}

module.exports = {
    parseTransform,
    composeTransform
}