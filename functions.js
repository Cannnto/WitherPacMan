var key = [];
keyUp = (event) =>    key[event.keyCode] = 0;
keydown = (event) =>  key[event.keyCode] = 1;
document.addEventListener("keydown", keydown);
document.addEventListener("keyup", keyUp);

rect = (x,y,w,h,c) =>(ctx.fillStyle = c,  ctx.fillRect(x,y,w,h));
rng = () => Math.random();
moveToS = (x,y,cor) =>
{   ctx.strokeStyle = cor;
    ctx.beginPath();
    ctx.moveTo(x,y)
};
moveToF = (x,y,cor) =>
{   ctx.fillStyle = cor;
    ctx.beginPath();
    ctx.moveTo(x,y)
};

rotate = (e,c) =>
{   ctx.save();
        ctx.translate(e.x+e.w/2, e.y+e.h/2);
        ctx.rotate(c*Math.PI/180);
        ctx.translate(-(e.x+e.w/2), -(e.y+e.h/2));
}

lineTo = (x,y) => ctx.lineTo(x,y);
closePath = () => (ctx.closePath(), ctx.stroke());

txt = (x,y,tex,px,clr) =>
{   ctx.font = `${px}px Trebuchet MS`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = clr;
    ctx.fillText(tex, x, y);
}

wallLeft = (x,y) =>
{   moveToS(x, y, 'white');
    lineTo(x, y+cellHeight);
    closePath();
}
wallRight = (x,y) =>
{   moveToS(x+cellWidth, y, 'white');
    lineTo(x+cellWidth, y+cellHeight);
    closePath();
}
wallTop = (x,y) => 
{   moveToS(x, y, 'white');
    lineTo(x+cellWidth, y);
    closePath();
}
wallBottom = (x,y) =>
{   moveToS(x, y+cellHeight, 'white');
    lineTo(x+cellWidth, y+cellHeight);
    closePath();
}
bal = (x,y,r,cor) =>
{   ctx.fillStyle = cor;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2);
    ctx.closePath();
    ctx.fill();
}
ellipse = (x,y,rw,rh,angle, begin, end, cor) => 
{   ctx.fillStyle = cor;
    ctx.beginPath();
    ctx.ellipse(x, y, rw, rh, angle, begin, end);
    ctx.fill();
    ctx.beginPath();
}


GhostEye = (x,y,r,c) =>
{   let e = {x:x,y:y,w:r,h:r};
    X(x,y,r,c);
    rotate(e,90)
        X(x,y,r,c);
    ctx.restore();
}
X = (x,y,r,c) =>
{   moveToF(x,y+r/1.25,c);
    lineTo(x+r/1.25,y);
    lineTo(x+r,y);
    lineTo(x+r,y+r*0.25);
    lineTo(x+r*0.25,y+r);
    lineTo(x,y+r);
    ctx.closePath();
    ctx.fill();
}

celPos = (e) => maze[e.pos.y * Coluns + e.pos.x];
celGhostStep = (e) => maze[(e.pos.y + e.stepGhost.y) * Coluns + (e.pos.x + e.stepGhost.x)];
    

lerp2 = (e,a,b,t) =>
{   e.x = lerp(a.x, b.x, t);
    e.y = lerp(a.y, b.y, t);
}
lerp = (a,b,t) =>   a + (b-a)*t

