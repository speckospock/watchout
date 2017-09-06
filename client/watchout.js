// start slingin' some d3 here.
/*

###################
### Design Docs ###
###################

//before setup:
  create a game options object

//at setup:
  //create a window
  //put the player on the screen
  //have the player position = mouse position
  //create some number of enemies
  //put each enemy at a random position on screen
  //start play

//at a regular interval:
  //have each enemy select a position
  //perform a transformation on each enemy to move it from current pos --> new pos

//at a (shorter) interval:
  //check for collisions
  //update the score

//collision handling:
  //if collision, reset score
*/
var currentTime = 1;

var lastCollision = 0;

var options = {
  width: 700,
  height: 450,
  numEnemies: 25
};

var score = {
  current: 0,
  best: 0,
  collisions: 0,
};

class Enemy {
  constructor() {
    this.x = Math.random() * options.width;
    this.y = Math.random() * options.height;
    this.r = 12;
    this.lastx = this.x;
    this.lasty = this.y;
  }
  newX() {
    this.lastx = this.x;
    this.x = Math.random() * options.width;
    return this.x;
  }
  diffX() {
    let dx = (this.x - this.lastx) * (currentTime / 1000);
    return this.lastx + dx;
  }
  newY() {
    this.lasty = this.y;
    this.y = Math.random() * options.height;
    return this.y;
  }
  diffY() {
    let dy = (this.y - this.lasty) * (currentTime / 1000);
    return this.lasty + dy;
  }
}

class Player {
  constructor() {
    this.x = Math.floor(options.width / 2);
    this.y = Math.floor(options.height / 2);
    this.r = 12;
  }
}

var playerMove = () => {
  //d3player.attr('cx', event.pageX - 6);
  //d3player.attr('cy', event.pageY - 59);
  d3player.attr('cx', event.pageX - 18);
  d3player.attr('cy', event.pageY - 18);
};

var board = d3.selectAll('div.board')
  .append('svg:svg')
  .attr('width', options.width)
  .attr('height', options.height)
  .on('mousedown', () => {
    console.log(d3.event);
    board.on('mousemove', playerMove);
  })
  .on('mouseup', () => {
    board.on('mousemove', () => true);
  });
//.style('background-color', 'yellow');

var generateEnemies = () => {
  output = [];
  for (let i = 0; i < options.numEnemies; i++) {
    var thisEnemy = new Enemy();
    output.push(thisEnemy);
  }
  return output;
};

var allEnemies = generateEnemies();

var d3Enemies = board.selectAll('circle.enemy')
  .data(allEnemies)
  .enter()
  .append('svg:circle')
  .attr('class', 'enemy')
  .attr('cx', (enemy) => enemy.x)
  .attr('cy', (enemy) => enemy.y)
  .attr('r', (enemy) => enemy.r)
  //.style('fill', 'url(https://img0.etsystatic.com/076/1/11346556/il_170x135.826379486_cvsv.jpg)');
  .style('fill', () => {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return `rgb(${r},${g},${b})`;
  });

// var d3Enemies = board.selectAll('image.enemy')
//   .data(allEnemies)
//   .enter()
//   .append('svg:image')
//   .attr('class', 'enemy')
//   .attr('x', (enemy) => enemy.x)
//   .attr('y', (enemy) => enemy.y)
//   .attr('r', (enemy) => enemy.r)
//   .attr('height', 24)
//   .attr('width', 24)
//   .attr('xlink:href', 'https://img0.etsystatic.com/076/1/11346556/il_170x135.826379486_cvsv.jpg')
//   .style('border-radius', '12px');
// //.style('fill', 'black');

var player = new Player;
var players = [player];

var d3player = board.selectAll('circle.player')
  .data(players)
  .enter()
  .append('svg:circle')
  .attr('class', 'player')
  .attr('cx', (player) => player.x)
  .attr('cy', (player) => player.y)
  .attr('r', (player) => player.r)
  .style('fill', 'black')
  .style('border', '2px');

var collisionHandle = () => {
  if (score.current > score.best) {
    score.best = score.current;
  }
  score.current = 0;
  if ((currentTime - lastCollision) > 10) {
    score.collisions++;
  }
  lastCollision = currentTime;
  // console.log(score.collisions)
};

setInterval(() => {
  d3Enemies.transition()
    .duration(1000)
    .attr('cx', (enemy) => enemy.newX())
    .attr('cy', (enemy) => enemy.newY())
    // .attr('x', (enemy) => enemy.newX())
    // .attr('y', (enemy) => enemy.newY())
    .ease('linear')
    .style('fill', () => {
      var r = Math.floor(Math.random() * 255);
      var g = Math.floor(Math.random() * 255);
      var b = Math.floor(Math.random() * 255);
      return `rgb(${r},${g},${b})`;
    });
  //     // .tween('move', () => {
  //     //   var enemy = d3.select(this);
  //     //
  //     //   var x1 = enemy.attr('cx');
  //     //   var y1 = enemy.attr('cy');
  //     //
  //     //   var x2 = Math.random() * options.width;
  //     //   var y2 = Math.random() * options.height;
  //     //
  //     //   return (time) => {
  //     //     dx = x1 + x2 * time;
  //     //     dy = y1 + y2 * time;
  //     //
  //     //     enemy.attr('cx', dx).attr('cy', dy);
  //     //   }
  //     // })
}, 1000);

setInterval(() => {
  currentTime += 1;
  if (currentTime > 1000) {
    currentTime -= 1000;
  }

  score.current += .1;
  d3.selectAll('span.currentScore').text(Math.round(score.current));
  d3.selectAll('span.highscoreText').text(Math.round(score.best));
  d3.selectAll('span.collisionsText').text(score.collisions);

  d3Enemies.each((d, i) => {
    var px = d3player.attr('cx');
    var py = d3player.attr('cy');
    var pr = d3player.attr('r');

    var enemyx = allEnemies[i].diffX();
    var enemyy = allEnemies[i].diffY();
    var enemyr = allEnemies[i].r;

    var dx = Math.pow((px - enemyx), 2);
    var dy = Math.pow((py - enemyy), 2);
    //var dr = Math.pow((pr + enemyr), 2);

    if (dx <= 576 && dy <= 576) {
      //console.log('collision detected', dx, px, enemyx, dy, py, enemyy);
      collisionHandle();
    }
  });
}, 1);
