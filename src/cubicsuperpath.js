function matprod(mlist) {
    let prod = mlist;
    let m = mlist;
    for ( let i = 0 ; i < mlist.length ; i++ ){
        let a00 = prod[0][0] * m[0][0] + prod[0][1] * m[1][0]
        let a01 = prod[0][0] * m[0][1] + prod[0][1] * m[1][1]
        let a10 = prod[1][0] * m[0][0] + prod[1][1] * m[1][0]
        let a11 = prod[1][0] * m[0][1] + prod[1][1] * m[1][1]
        prod = [[a00, a01], [a10, a11]]
    }
    return prod
}

function rotmat(teta) {
    return [[Math.cos(teta), -Math.sin(teta)], [Math.sin(teta), Math.cos(teta)]]
}

function applymat(mat, pt) {
    let x = mat[0][0] * pt[0] + mat[0][1] * pt[1]
    let y = mat[1][0] * pt[0] + mat[1][1] * pt[1]
    pt[0] = x
    pt[1] = y
    return pt;
}

function norm(pt) {
    return Math.sqrt(pt[0] * pt[0] + pt[1] * pt[1])
}

function ArcToPath(p1, params) {
    let A = p1;
    let rx = params[0];
    let ry = params[1];
    let teta = params[2];
    let longflag = params[3];
    let sweepflag = params[4];
    let x2 = params[5];
    let y2 = params[6];

    teta = teta * Math.PI / 180.0;

    let B = [x2, y2];

    if (rx == 0 || ry == 0) {
        return ([[A, A, A], [B, B, B]])
    }

    let mat = matprod((rotmat(teta), [[1 / rx, 0], [0, 1 / ry]], rotmat(-teta)));
    A = applymat(mat, A);
    B = applymat(mat, B);
    let k = [-(B[1] - A[1]), B[0] - A[0]];
    let d = k[0] * k[0] + k[1] * k[1];
    k[0] /= Math.sqrt(d);
    k[1] /= Math.sqrt(d);

    d = Math.sqrt(Math.max(0, 1 - d / 4));

    if (longflag == sweepflag) {
        d *= -1;
    }
    let O = [(B[0] + A[0]) / 2 + d * k[0], (B[1] + A[1]) / 2 + d * k[1]];
    let OA = [A[0] - O[0], A[1] - O[1]];
    let OB = [B[0] - O[0], B[1] - O[1]];

    let start = Math.acos(OA[0] / norm(OA));

    if (OA[1] < 0) {
        start *= -1;
    }

    let end = Math.acos(OB[0] / norm(OB));

    if (OB[1] < 0) {
        end *= -1;
    }

    if (sweepflag && start > end) {
        end += (2 * Math.PI);
    }
    if ((!sweepflag) && start < end) {
        end -= (2 * Math.PI);
    }

    let NbSectors = (Math.abs(start - end) * 2 / Math.PI) + 1;
    let dTeta = (end - start) / NbSectors;
    let v = 4 * Math.tan(dTeta / 4) / 3;

    let p = [];
    for (let i = 0; i < NbSectors; i++) {
        let angle = start + i * dTeta;
        let v1 = [O[0] + Math.cos(angle) - (-v) * Math.sin(angle), O[1] + Math.sin(angle) + (-v) * Math.cos(angle)];
        let pt = [O[0] + Math.cos(angle), O[1] + Math.sin(angle)];
        let v2 = [O[0] + Math.cos(angle) - v * Math.sin(angle), O[1] + Math.sin(angle) + v * Math.cos(angle)];
        p.push([v1, pt, v2]);
    }

    p[0][0] = p[0][1];
    p[p.length - 1][2] = p[p.length - 1][1];

    mat=matprod((rotmat(teta),[[rx,0],[0,ry]],rotmat(-teta)));

    for ( let pts of p ){
        applymat(mat, pts[0])
        applymat(mat, pts[1])
        applymat(mat, pts[2])
    }

    return p;
}


function CubicSuperPath(simplepath) {
    let csp = [];
    let subpath = -1;
    let subpathstart = [];
    let last = [];
    let lastctrl = [];

    simplepath.forEach(element => {
        let cmd = element[0];
        let params = element[1];

        switch (cmd) {
            case 'M': {
                if (last.length > 0) {
                    csp[subpath].push([lastctrl, last, last]);
                }
                subpath += 1;
                csp.push([]);
                subpathstart = params;
                last = params;
                lastctrl = params;
                break;
            }
            case 'A': {
                let arcp = ArcToPath(last, params);
                arcp[0][0] = lastctrl;
                last = arcp[arcp.length - 1][1];
                lastctrl = arcp[arcp.length - 1][0];
                for ( let i = 0 ; i < arcp.length - 1 ; i++ ){
                    csp[subpath].push(arcp[i]);
                }

                break;
            }
        }
    });

    csp[subpath].push([lastctrl, last, last]);
    return csp;
}

let pathdefs = {
    'M': ['L', 2, [parseFloat, parseFloat], ['x', 'y']],
    'A': ['A', 7, [parseFloat, parseFloat, parseFloat, parseInt, parseInt, parseFloat, parseFloat], ['r', 'r', 'a', 0, 's', 'x', 'y']],
}
function simplePathParse(d) {
    let _params = [];

    function _isCommand(l) {
        let ____params = [];
        if (l.startsWith("M")) {
            ____params = l.replace('M', '').split(',');
            return { isCommand: true, token: 'M', params: ____params };
        } else if (l.startsWith("A")) {
            ____params = l.replace('A', '').split(',');
            return { isCommand: true, token: 'A', params: ____params };
        } else {
            ____params = l.split(',');
        }
        return { isCommand: false, params: ____params };
    }

    let lexer = d.split(' ');
    let retval = [];

    let lastCommand = '';
    let needParam = false;

    for (let __idx = 0; __idx < lexer.length; __idx++) {
        let _lexer = lexer[__idx];
        _params = [];
        let { isCommand, token, params } = _isCommand(_lexer);
        if (isCommand) {
            if (lastCommand == '' && token != 'M') {
                console.log('Invalid path, must begin with moveto.');
            } else {
                command = token;
            }
        } else {
            needParam = false;
            if (lastCommand != '') {
                command = pathdefs[lastCommand][0];
            }
        }

        numParams = pathdefs[command][1];

        while (params.length < numParams) {
            __idx++
            let re = _isCommand(lexer[__idx]);

            re.params.forEach((_tre) => {
                params.push(_tre);
            })
        }

        params.forEach((el, idx) => {

            if (needParam) {

            }

            cast = pathdefs[command][2][idx];
            param = cast(el);
            _params.push(param);
            needParam = true;
        });

        let outputCommand = command;
        //-- Flesh out shortcut notation
        switch (outputCommand) {
            case 'M': {
                break;
            }
        }

        lastCommand = outputCommand;
        retval.push([outputCommand, _params]);
    }

    return retval;
}

function parsePath(d) {
    return CubicSuperPath(simplePathParse(d));
}

module.exports = {
    parsePath
}