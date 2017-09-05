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
  }
  newX() {
    return Math.random() * options.width;
  }
  newY() {
    return Math.random() * options.height;
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

setInterval(() => {
  d3Enemies.transition()
    .duration(1000)
    .attr('cx', (enemy) => enemy.newX())
    .attr('cy', (enemy) => enemy.newY());
}, 1000);
//console.log(JSON.stringify(generateEnemies()));

// d3.event('drag', (d) => {
//   console.log(d3.mouse);
//   d.attr('cx', (player) => d3.mouse[0])
//     .attr('cy', (player) => d3.mouse[1]);
// })
//.append('svg:svg').attr('width', options.width).attr('height', options.height).css('color', 'red');
