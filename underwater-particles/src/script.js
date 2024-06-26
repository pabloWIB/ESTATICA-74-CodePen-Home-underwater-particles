var c = document.getElementById('c'),
    ctx = c.getContext('2d'),
    points = [],
    count = 30,
    size = 3,
    delta = 4,
    distance = 170;

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame       ||
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame    ||
           window.oRequestAnimationFrame      ||
           window.msRequestAnimationFrame     ||
           function (callback) {
               window.setTimeout(callback, 1000/60);
           };
})();

function checkDistance (x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
}

function setColor () {
    return 'rgba(' + (255, 255, 255) + ',' 
                  + (255, 255, 255) + ',' 
                  + (255, 255, 255) + ',' 
                  + Math.round(1*Math.random()) + 
           ')';
}

function Point (x, y, dx, dy, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.color = color;
}

function initPoint (x, y) {
    var x = x || c.width*Math.random(),
        y = y || c.height*Math.random(),
        dx = - delta/2 + delta*Math.random(),
        dy = - delta/2 + delta*Math.random(),
        color = setColor();
    points.push(new Point (x, y, dx, dy, color));
}

function drawPoint (point) {
    ctx.fillStyle = point.color;
    ctx.beginPath();
    ctx.arc(point.x, point.y, size, 0, 2*Math.PI);
    ctx.fill();
}

function drawLines (point, index) {
    for (var i = 0; i < index; i++) {
        
        var opacity = 1 - checkDistance(
            point.x, point.y, points[i].x, points[i].y
        ) / distance;
          
        if (opacity > 0) { 
            var grad = ctx.createLinearGradient(
                point.x, point.y, points[i].x, points[i].y
            );
            grad.addColorStop(0, point.color);
            grad.addColorStop(1, points[i].color);
              
            ctx.strokeStyle = grad;
            ctx.globalAlpha = opacity;
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(points[i].x, points[i].y);
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
    }
}

function updatePosition () {
    for (var i = 0; i < points.length; i++) {
        
        var xDx = points[i].x + points[i].dx,
            yDy = points[i].y + points[i].dy;
        
        if (xDx - size < 0 || xDx + size > c.width) {
            points[i].dx = - points[i].dx;
        }
      
        if (yDy - size < 0 || yDy + size > c.height) {
            points[i].dy = - points[i].dy;
        }
        
        points[i].x += points[i].dx;
        points[i].y += points[i].dy;
          
        drawPoint(points[i]);
        drawLines(points[i], i);
    }
}

function init () {
    points.length = 0;
    
    for (var i=0; i<count; i++) {
        initPoint();
    }
}

function resize () {
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    init();
}

function draw () {
    ctx.clearRect(0, 0, c.width, c.height);
    updatePosition();
    window.requestAnimFrame(draw); 
}

window.addEventListener("resize", resize);

c.addEventListener("mouseup", function (e) {
    initPoint(e.pageX - c.offsetLeft, e.pageY - c.offsetTop);
});

resize();
draw(); 
