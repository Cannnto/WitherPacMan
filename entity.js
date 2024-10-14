class Entity
{   constructor(position)
    {   this.x = position.x*cellWidth;
        this.y = position.y*cellHeight;
        this.pos = position;
        this.animationVel = 100;
        this.direction = {x:0, y:0};
        this.count = {x:0, y:0};
        this.step = {x:0, y:0};
        this.moveAni = 0;
        this.velocity = 500;
    }
    move(x,y)
    {   this.direction.x = x, this.direction.y = y;
        
        this.step.x = deltaTime*1000 * cellWidth / this.velocity*x;
        this.step.y = deltaTime*1000 * cellHeight / this.velocity*y;

        this.moveAni = 1;
    }
    moveAnimation()
    {   this.count.x += this.step.x;
        this.count.y += this.step.y;
        this.x += this.step.x;
        this.y += this.step.y;

        if(Math.abs(this.count.x) >= cellWidth || Math.abs(this.count.y) >= cellHeight)
        {   this.moveAni = 0;
            this.count.x = 0, this.count.y = 0;
            this.pos.x += this.direction.x, this.pos.y += this.direction.y; 
            this.x = this.pos.x*cellWidth;
            this.y = this.pos.y*cellHeight;
        }
    }
}

class PacMan extends Entity
{   constructor(position)
    {   super(position);
        this.angle = 0;
        this.yummy = 0;
        this.points = 0;
    }
    
    draw()
    {   ellipse(this.x+cellWidth/2, this.y+cellHeight/2, cellWidth/3, cellWidth/3, this.angle, Math.PI+(-(135+this.yummy)*Math.PI/180), Math.PI*2+(-(135+this.yummy)*Math.PI/180), 'yellow');
        ellipse(this.x+cellWidth/2, this.y+cellHeight/2, cellWidth/3, cellWidth/3, this.angle, Math.PI+(-(45-this.yummy)*Math.PI/180), Math.PI*2+(-(45-this.yummy)*Math.PI/180));
    }

    update()
    {   this.moveAni && this.moveAnimation();
        
        this.yummy += this.animationVel*deltaTime;
        (this.yummy >= 45 || this.yummy <= 0) && (this.reverseYummy = !this.reverseYummy, (this.yummy >= 45 && (this.yummy = 45)) || (this.yummy = 0) );
        this.reverseYummy && (this.yummy -= this.animationVel*2 *deltaTime);

        celPos(this).coin && (celPos(this).coin = 0, this.points++);

        if(key[87] && !this.moveAni) this.angle = -Math.PI/2, !celPos(this).walls.top && this.move(0,-1);
        if(key[83] && !this.moveAni) this.angle = Math.PI/2, !celPos(this).walls.bottom && this.move(0,+1);
        if(key[65] && !this.moveAni) this.angle = Math.PI, !celPos(this).walls.left && this.move(-1,0);
        if(key[68] && !this.moveAni) this.angle = 0, !celPos(this).walls.right && this.move(+1,0);
    }
}

class Ghost extends Entity
{   constructor(position, color, options, moviments)
    {   super(position);
        this.velocity = 500;
        this.stepGhost = {x:0, y:0};
        this.position = [];
        this.options = options;
        this.moviments = moviments;
        this.color = color
    }
    draw()
    {   bal(this.x+cellWidth/2, this.y+cellWidth/3.5, cellWidth/4,this.color);
        rect(this.x+cellWidth/4,this.y+cellWidth/3.5, cellWidth/2, cellHeight/2.3);
        ellipse(this.x+cellWidth/4+cellWidth/16, this.y+cellWidth/2+cellWidth/8, cellWidth/16, cellWidth/12, 0, 0, Math.PI*2);
        ellipse(this.x+cellWidth/4+cellWidth*3/16, this.y+cellWidth/2+cellWidth/8, cellWidth/16, cellWidth/12, 0, 0, Math.PI*2);
        ellipse(this.x+cellWidth/4+cellWidth*5/16, this.y+cellWidth/2+cellWidth/8, cellWidth/16, cellWidth/12, 0, 0, Math.PI*2);
        ellipse(this.x+cellWidth/4+cellWidth/16*7, this.y+cellWidth/2+cellWidth/8, cellWidth/16, cellWidth/12, 0, 0, Math.PI*2);
        // bal(this.x+cellWidth/2 - cellWidth/16, this.y+cellWidth/4, cellWidth/16,'white');
        // bal(this.x+cellWidth/2 + cellWidth/8, this.y+cellWidth/4, cellWidth/16,'white');
        GhostEye(this.x+cellWidth/2 - cellWidth/8, this.y+cellWidth/4-cellWidth/16, cellWidth/8, 'purple');
        GhostEye(this.x+cellWidth/2 + cellWidth/16, this.y+cellWidth/4-cellWidth/16, cellWidth/8, 'purple');
    }
    update()
    {   this.moveAni && this.moveAnimation();
        this.ways = [];
        this.position = [];
        if(this.moveAni) return;

        //cria o template dos Paths 
        for(let i=0; i<this.options; i++)
        {   this.ways.push([]);
            this.position.push([]);
            
            i >= 0 && i<this.options/4 && !celPos(this).walls.left && this.ways[i].push('L');
            i >= this.options/4 && i<this.options*2/4 && !celPos(this).walls.top && this.ways[i].push('T');
            i >= this.options*2/4 && i<this.options*3/4 && !celPos(this).walls.right && this.ways[i].push('R');
            i >= this.options*3/4 && i<this.options*4/4 && !celPos(this).walls.bottom && this.ways[i].push('B');
            
            if(this.ways[i] != 0)
            {   for(let j=0; j<this.moviments; j++)
                    Math.random()<0.25 ? this.ways[i].push('L') : (
                    Math.random()<0.33 ? this.ways[i].push('T') : (
                    Math.random()<0.50 ? this.ways[i].push('R') : 
                                         this.ways[i].push('B')));
            }
        }

        //faz o calculo do Path do ghost
        for(let i=0; i<this.options; i++)
        {   for(let j=0; j<this.moviments+1; j++)
            {   this.ways[i][j] == 'L' && celGhostStep(this) && !celGhostStep(this).walls.left && (this.stepGhost.x-=1);
                this.ways[i][j] == 'T' && celGhostStep(this) && !celGhostStep(this).walls.top && (this.stepGhost.y-=1);
                this.ways[i][j] == 'R' && celGhostStep(this) && !celGhostStep(this).walls.right && (this.stepGhost.x+=1);
                this.ways[i][j] == 'B' && celGhostStep(this) && !celGhostStep(this).walls.bottom && (this.stepGhost.y+=1);
            }
            this.ways[i] != 0 && (this.position[i] = celGhostStep(this));
            this.stepGhost.x=0, this.stepGhost.y=0;
        } 

        //controlador de merda
        for(let i =0 ; i<this.ways.length;i++)  this.ways[i] == 0 && (this.ways.splice(i,1), this.position.splice(i,1), i--);

        //calcula a posição do ghost com o pacman
        for(let i=0; i<this.ways.length; i++)
            this.position[i] = Math.sqrt((this.position[i].x - pacman.x)**2 + (this.position[i].y - pacman.y)**2); 

        //executa o movimento
        this.ways[this.position.indexOf(Math.min(...this.position))][0] == 'L' && this.move(-1, 0);
        this.ways[this.position.indexOf(Math.min(...this.position))][0] == 'T' && this.move(0, -1);
        this.ways[this.position.indexOf(Math.min(...this.position))][0] == 'R' && this.move(1, 0);
        this.ways[this.position.indexOf(Math.min(...this.position))][0] == 'B' && this.move(0, 1);  
    }
}

