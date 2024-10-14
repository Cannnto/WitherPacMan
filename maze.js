class Cel
{   constructor(x, y, position)
    {   this.x = x;
        this.y = y;
        this.pos = position;
        this.walls = {left: 1, right: 1, top: 1, bottom: 1};
        this.touch = 0;
        this.spaw = 0;
        this.coin = 1
    }
    draw()
    {   this.walls.left && wallLeft(this.x, this.y);
        this.walls.right && wallRight(this.x, this.y);
        this.walls.top && wallTop(this.x, this.y);
        this.walls.bottom && wallBottom(this.x, this.y);

        this.coin && bal(this.x+cellWidth/2, this.y+cellHeight/2, cellWidth/cellHeight, 'orange');
        // this.touch && rect(this.x,this.y,cellWidth, cellHeight, 'rgba(255,0,0,0.5)'); 
    }
}

const render = (cel) =>
{   let ways = [maze[cel.pos.y * Coluns + (cel.pos.x-1)], maze[(cel.pos.y-1) * Coluns + cel.pos.x], maze[cel.pos.y * Coluns + (cel.pos.x+1)], maze[(cel.pos.y+1) * Coluns + cel.pos.x]];
    let options = [];

    for(let i=0; i<ways.length ;i++)    
        ways[i] && !ways[i].spaw && (ways[i].pos.x == (cel.pos.x-1) || ways[i].pos.x == (cel.pos.x+1) || ways[i].pos.x == cel.pos.x) && !ways[i].touch && options.push(ways[i]);
        
    let newCel = options[parseInt(rng()*options.length)];
    if(newCel)
    {   newCel.pos.x-cel.pos.x == -1 && (cel.walls.left = 0, newCel.walls.right = 0); 
        newCel.pos.x-cel.pos.x == +1 && (cel.walls.right = 0, newCel.walls.left = 0);
        newCel.pos.y-cel.pos.y == -1 && (cel.walls.top = 0, newCel.walls.bottom = 0);
        newCel.pos.y-cel.pos.y == +1 && (cel.walls.bottom = 0, newCel.walls.top = 0);
    }

    newCel && (path.push(newCel), newCel.touch = 1);
    !newCel && path.pop();
}

var maze = [], Coluns = 21, Rows = 21, cellWidth = canvas.width/Coluns, cellHeight = canvas.height/Rows;
for(let y = 0; y<Rows; y++)
    for(let x = 0; x<Coluns; x++)
        maze[y * Coluns + x] = new Cel(x*cellWidth,y*cellHeight,{x: x, y: y});
    
for(let y2=-1; y2<2; y2++)
    for(let x2=-1; x2<2; x2++)
    {   let cel = maze[(parseInt(Rows/2)+y2) * Coluns + (parseInt(Coluns/2)+x2)];
        cel.spaw = 1, cel.walls.left = cel.walls.top = cel.walls.bottom = cel.walls.right = 0;
        y2 == -1 && x2 == -1 && (cel.walls.top = 1);
        y2 == -1 && x2 == 1 && (cel.walls.top = 1);
        x2 == -1 && (cel.walls.left = 1);
        x2 == -1 && (cel.walls.left = 1);
        x2 == 1 && (cel.walls.right = 1);
        y2 == 1 && (cel.walls.bottom = 1);
    }

maze[(parseInt(Rows/2)-2) * Coluns + parseInt(Coluns/2)].walls.bottom = 0;