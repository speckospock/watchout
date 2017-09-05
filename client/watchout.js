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

var options = {
  width: 700,
  height: 450,
  numEnemies: 25
};

class Enemy {
  constructor() {
    this.x = Math.random() * options.width;
    this.y = Math.random() * options.height;
    this.r = 12;
    this.lastx = 0;
    this.lasty = 0;
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
  d3player.attr('cx', event.pageX - 6);
  d3player.attr('cy', event.pageY - 59);
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
  })
  .style('background-color', 'yellow');

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
  .attr('r', (enemy) => enemy.r);

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
  .style('fill', 'red');

var collisionHandle = () => {

};

setInterval(() => {
  d3Enemies.transition()
    .duration(1000)
    // .tween('move', () => {
    //   var enemy = d3.select(this);
    //
    //   var x1 = enemy.attr('cx');
    //   var y1 = enemy.attr('cy');
    //
    //   var x2 = Math.random() * options.width;
    //   var y2 = Math.random() * options.height;
    //
    //   return (time) => {
    //     dx = x1 + x2 * time;
    //     dy = y1 + y2 * time;
    //
    //     enemy.attr('cx', dx).attr('cy', dy);
    //   }
    // })
    .attr('cx', (enemy) => enemy.newX())
    .attr('cy', (enemy) => enemy.newY());
  // .ease('linear');
}, 1000);

setInterval(() => {
  currentTime += 10;
  if (currentTime > 1000) {
    currentTime -= 1000;
  }
  //console.log(currentTime / 1000)
  //console.log(allEnemies[0].diffX(), allEnemies[0].diffY(), currentTime);
  d3Enemies.each((d, i) => {
    var px = d3player.attr('cx');
    var py = d3player.attr('cy');
    var pr = d3player.attr('r');

    //console.log(px);
    //console.log(py);

    var enemyx = allEnemies[i].diffX();
    var enemyy = allEnemies[i].diffY();
    //var enemyx = allEnemies[i].lastx + (allEnemies[i].x - allEnemies[i].lastx) * (currentTime / 1000);
    //if (currentTime === 100) console.log(enemyx, allEnemies[i].diffX());
    //var enemyy = allEnemies[i].lasty + (allEnemies[i].y - allEnemies[i].lasty) * (currentTime / 1000);

    // var dx = px - d.x;
    // var dy = py - d.y;

    var dx = px - enemyx;
    var dy = px - enemyy;

    if (-(2 * pr - 1) <= dx && dx <= (2 * pr - 1)) {
      if (-(2 * pr) <= dy && dy <= (2 * pr)) {
        collisionHandle();
        //console.log('Collision detected', enemyx, px, dx, enemyy, py, dy)
      }
    }
  });
}, 10);
