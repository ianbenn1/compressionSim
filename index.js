let MAZEX = 0;
let MAZEY = 0;
let ENDPOINTX = 0;
let ENDPOINTY = 0;
let STARTTIME = 0;
let TOTAL_RENDER_TIME = 0;
let mazecells = document.getElementsByClassName("maze-block");
document.getElementById('build').onclick = function(){
    let x = document.getElementById('maze-height').value;
    let y = document.getElementById('maze-width').value;
    MAZEX = x;
    MAZEY = y;
    console.log(`X:${x} Y:${y}`);
    mazeBuilder(x, y);
    [].forEach.call(mazecells, function (el) {
        el.onclick = function(e) {
            e.target.dataset.taken = "true";
            e.target.className = e.target.className + " blocked-cell";
        };
    });
};

document.getElementById('compress').onclick = function() {
    var compressiontype = document.getElementById("compressiontype").value;
    TOTAL_RENDER_TIME = 0;
    STARTTIME = Date.now();
    if(compressiontype == 'fixed') {
        console.log('ping 1');
        fixedSolver(MAZEX, MAZEY, 0, 0, false, "#999", 1);
    }
    else if(compressiontype == 'pointer') {
        pointerSolver(MAZEX, MAZEY, 0, 0);
    }
    
};



async function mazeBuilder(x, y) {
    let field = document.getElementsByClassName('field')[0];
    field.innerHTML = "";
    for(let i = 0; i < x; i++)
    {
        //console.log("Creating row " + i);
        let rowElement = document.createElement("div");
        rowElement.className = "maze-line line" + i;
        field.appendChild(rowElement);
        let row = document.getElementsByClassName('line' + i)[0];

        for(let j = 0; j < y; j++)
        {
            //console.log("Creating cell " + j + " in row " + i);
            let cell = document.createElement("div");
            cell.className = "maze-block cell" + i + "-" + j;
            cell.dataset.taken = "false";
            row.appendChild(cell);
        }
    }
    document.getElementById("originalSize").innerHTML = `Original pixels: ${x*y}`;
}


function fixedSolver (maze_size_x, maze_size_y, x, y, rev, colour, skip) {
    let field = document.getElementsByClassName('field')[0];
    
    let compressedMaze = [];

    for(let i = 0; i < maze_size_x; i++)
    {
        // console.log("ping 3");
        // let row = document.getElementsByClassName(`line${i}`)[0];
        let row = document.getElementsByClassName(`line${i}`)[0];
        // console.log(`in solver got row ${row}`);
        let whiteInARow = 0;
        let blackInARow = 0;
        let compressedRow = []
        for(let j = 0; j < maze_size_y; j++)
        {
            let cell = document.getElementsByClassName(`cell${i}-${j}`)[0];
            if(cell.className.toString().indexOf("blocked-cell") != -1) {
                blackInARow++;
                if(whiteInARow > 0) {
                    console.log(`was up to ${whiteInARow} white`);
                    compressedRow.push(`{"c": "w", "n": ${whiteInARow}}`);
                    whiteInARow = 0;
                }
                console.log("BLACK");
            }
            else {
                whiteInARow++;
                if(blackInARow > 0) {
                    console.log(`was up to ${blackInARow} black`);
                    compressedRow.push(`{"c": "b", "n": ${blackInARow}}`);
                    blackInARow = 0;
                }
                console.log("WHITE");
            }
            //console.log("Creating cell " + j + " in row " + i);
            // let cell = document.createElement("div");
            // cell.className = "maze-block cell" + i + "-" + j;
            // cell.dataset.taken = "false";
            // row.appendChild(cell);
        }
        if(whiteInARow == maze_size_y) {
            compressedRow.push(`{"c": "w", "n": ${whiteInARow}}`);
        } else if (blackInARow == maze_size_y) {
            compressedRow.push(`{"c": "b", "n": ${blackInARow}}`);
        }
        compressedMaze.push(compressedRow);
    }
    writeCompressedMaze2(compressedMaze);
}

function writeCompressedMaze(compressedMaze) {
    let x = compressedMaze.length;
    console.log("WriteCompressedMaze");
    for(let i = 0; i < x; i++)
    {
        let y = compressedMaze[i].length;
        for(let j = 0; j < y; j++)
        {
            console.log(compressedMaze[i][j]);
        }
    }
}

function writeCompressedMaze2(compressedMaze) {
    let field = document.getElementsByClassName('compressedField')[0];
    field.innerHTML = "";
    let totalpx = 0;

    let x = compressedMaze.length;

    for(let i = 0; i < x; i++)
    {
        //console.log("Creating row " + i);
        let rowElement = document.createElement("div");
        rowElement.className = "maze-line line" + i;
        field.appendChild(rowElement);
        let row = document.getElementsByClassName('line' + i)[0];

        let y = compressedMaze[i].length;
        for(let j = 0; j < y; j++)
        {
            let cell = document.createElement("div");
            // alert(JSON.parse(compressedMaze[i][j]).c);
            if(JSON.parse(compressedMaze[i][j]).c == "b") {
               cell.className = "blocked-cell maze-block cell" + i + "-" + j; 
            } else {
                cell.className = "maze-block cell" + i + "-" + j; 
            }
            cell.innerHTML = JSON.parse(compressedMaze[i][j]).n;
            
            cell.dataset.taken = "false";
            row.appendChild(cell);
            totalpx++;
        }
    }
    document.getElementById("compressedSize").innerHTML = `Compressed pixels: ${totalpx}`;
}

function pointer (maze_size_x, maze_size_y, x, y) {
    
}



//Helper functions
async function sleep(ms) {
    await setTimeout(()=>{}, ms);
}

function getRandomInt(min, max) {
    let x = 1
    min = Math.ceil(min);
    max = Math.floor(max);
    if(max == 1) x = 200;
    return (Math.floor(Math.random() * (max - min + 1)) + min) * x;
}