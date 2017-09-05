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
  newPos() {
    this.x = Math.random() * options.width;
    this.y = Math.random() * options.height;
  }
}

var board = d3.selectAll('div.board')
  .append('svg:svg')
  .attr('width', options.width)
  .attr('height', options.height)
  .style('background-color', 'yellow');

var generateEnemies = () => {
  output = [];
  for (let i = 0; i < options.numEnemies; i++) {
    var thisEnemy = new Enemy();
    output.push(thisEnemy);
  }
  return output;
};

var allEnemies = board.selectAll('circle.enemy')
  .data(generateEnemies())
  .enter()
  .append('svg:circle')
  .attr('class', 'enemy')
  .attr('cx', (enemy) => enemy.x)
  .attr('cy', (enemy) => enemy.y)
  .attr('r', (enemy) => enemy.r);

//console.log(JSON.stringify(generateEnemies()));

//.append('svg:svg').attr('width', options.width).attr('height', options.height).css('color', 'red');
