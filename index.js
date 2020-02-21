const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const resolution = 10;
canvas.width = 1200;
canvas.height = 1200;

const columns = canvas.width / resolution;
const rows = canvas.height / resolution;

class Cell {
  constructor() {
    this.currentstate = Math.floor(Math.random() * 2);
    this.total = 0;
  }

  setState(state) {
    this.currentstate = state;
    this.total += state;
  }
}

function buildGrid() {
  return new Array(columns)
    .fill(null)
    .map(() => new Array(rows).fill(null).map(() => new Cell()));
}

let grid = buildGrid();

requestAnimationFrame(update);

function update() {
  grid = nextGeneration(grid);
  render(grid);
  requestAnimationFrame(update);
}

function nextGeneration(grid) {
  const currentGen = grid.map(arr => arr.map(cell => cell.currentstate));

  for (let col = 0; col < currentGen.length; col += 1) {
    for (let row = 0; row < currentGen[col].length; row += 1) {
      const cell = currentGen[col][row];
      let neighbors = 0;
      for (let i = -1; i < 2; i += 1) {
        for (let j = -1; j < 2; j += 1) {
          if (i === 0 && j === 0) {
            continue;
          }
          const X = col + i;
          const Y = row + j;

          if (X >= 0 && Y >= 0 && X < columns && Y < rows) {
            const currentNeighbour = currentGen[col + i][row + j];
            neighbors += currentNeighbour;
          }
        }
      }

      if (cell === 1 && neighbors < 2) {
        grid[col][row].setState(0);
      } else if (cell === 1 && neighbors > 3) {
        grid[col][row].setState(0);
      } else if (cell === 0 && neighbors === 3) {
        grid[col][row].setState(1);
      } else {
        grid[col][row].setState(grid[col][row].currentstate);
      }
    }
  }
  return grid;
}

function render(grid) {
  let maxTotal = 0;
  for (let col = 0; col < grid.length; col += 1) {
    for (let row = 0; row < grid[col].length; row += 1) {
      const cell = grid[col][row];
      if (cell.total > maxTotal) {
        maxTotal = cell.total;
      }
    }
  }

  for (let col = 0; col < grid.length; col += 1) {
    for (let row = 0; row < grid[col].length; row += 1) {
      const cell = grid[col][row];
      const normalized = cell.total / maxTotal;
      const h = (1 - normalized) * 220;

      ctx.beginPath();
      ctx.rect(col * resolution, row * resolution, resolution, resolution);
      ctx.fillStyle = `hsl(${h}, 100%, 50%)`;
      ctx.fill();
    }
  }
}

console.clear();
console.log(
  '%cGAME OF LIFE' + ' %c(Conway)',
  'color: #70f9a9',
  'color: #e2f970'
);
// console.table(grid);
