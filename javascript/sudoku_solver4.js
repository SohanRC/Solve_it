function setGrid() {
  const input = document.querySelector("#grid");
  const size = 4;

  for (let i = 0; i < size; i++) {
    let rows = document.createElement("div");
    input.appendChild(rows);
    rows.className = "rows";

    for (let j = 0; j < size; j++) {
      let field = document.createElement("input");
      field.type = "text";
      field.className = "cells";
      field.id = `grid${i}${j}`;
      field.addEventListener("input", handleInput);
      let flex = document.createElement("div");
      flex.className = "flex";
      flex.style.display = "inline";
      rows.appendChild(flex);
      flex.appendChild(field);
    }
  }
}

function handleInput(event) {
  const inputValue = event.target.value.replace(/[^0-9]/g, '');
  event.target.value = inputValue;
  const parsedValue = parseInt(inputValue);

  if (!isNaN(parsedValue) && parsedValue >= 1 && parsedValue <= 4) {
      event.target.classList.remove("output-cell");
      event.target.style.color = "black";
  } else {
      event.target.classList.add("output-cell");
      event.target.style.color = "red";
  }
}

document.getElementById("submitButton").addEventListener("click", (e) => {
  e.preventDefault(); // Prevents the form from being submitted and page refresh
  calculateGrid();
});

document.getElementById("checkSolutionButton").addEventListener("click", (e) => {
  e.preventDefault();
  checkSolution();
});

document.getElementById("solveButton").addEventListener("click", (e) => {
  e.preventDefault();
  solveSudoku();
});
function checkSolution() {
  let n = 4;
  let mat = [];
  let invalidCells = [];
  let solutionCount = 0;

  for (let i = 0; i < n; i++) {
    mat[i] = [];
    for (let j = 0; j < n; j++) {
      let inputValue = document.getElementById(`grid${i}${j}`).value;
      if (inputValue === "") {
        mat[i][j] = ".";
        document.getElementById(`grid${i}${j}`).classList.add("output-cell");
      } else {
        let parsedValue = parseInt(inputValue);
        if (isNaN(parsedValue) || parsedValue < 1 || parsedValue > 4) {
          invalidCells.push({ row: i, col: j });
        } else {
          mat[i][j] = parsedValue;
        }
      }
    }
  }

  if (invalidCells.length === 0) {
    let verdictSection = document.getElementById("verdictSection");
    if (isValid(mat)) {
      solveCount([...mat], 0, () => solutionCount++);
      if (solutionCount === 1) {
        verdictSection.innerHTML = "OK - Unique Solution";
      } else {
        verdictSection.innerHTML = `Invalid input! ${solutionCount} solutions found.`;
      }
    } else {
      verdictSection.innerHTML = "Invalid input! Please enter valid Numbers.";
    }
  }
}


function countSolutions(board) {
  let solutions = 0;
  solveCount([...board], 0, () => solutions++);
  return solutions;
}


function solveCount(board, index, callback) {
  if (index === 16) {
    callback([...board]);
    return;
  }

  let i = Math.floor(index / 4);
  let j = index % 4;

  if (board[i][j] === ".") {
    for (let k = 1; k <= 4; k++) {
      if (check(board, i, j, k.toString())) {
        board[i][j] = k;
        solveCount([...board], index + 1, callback);
        board[i][j] = ".";
      }
    }
  } else {
    solveCount([...board], index + 1, callback);
  }
}

function solveSudoku() {
  let n = 4;
  let mat = [];
  let invalidCells = [];

  for (let i = 0; i < n; i++) {
    mat[i] = [];
    for (let j = 0; j < n; j++) {
      let inputValue = document.getElementById(`grid${i}${j}`).value;
      if (inputValue === "") {
        mat[i][j] = ".";
        document.getElementById(`grid${i}${j}`).classList.add("output-cell");
      } else {
        let parsedValue = parseInt(inputValue);
        if (isNaN(parsedValue) || parsedValue < 1 || parsedValue > 4) {
          invalidCells.push({ row: i, col: j });
        } else {
          mat[i][j] = parsedValue;
        }
      }
    }
  }

  if (invalidCells.length === 0) {
    let verdictSection = document.getElementById("verdictSection");
    if (isValid(mat)) {
      solve(mat);
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          document.getElementById(`grid${i}${j}`).value = mat[i][j];
        }
      }
      verdictSection.innerHTML = "Sudoku Solved";
    } else {
      verdictSection.innerHTML = "Invalid input! Please enter valid Numbers.";
    }
  }
}




// function resetInvalidCells(invalidCells) {
//   invalidCells.forEach(cell => {
//     document.getElementById(`grid${cell.row}${cell.col}`).value = "";
//   });
// }

function isValid(board) {
  let n = 4;
  //check columns
  let f = 1;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (board[i][j] != ".") {
        if (check(board, i, j, board[i][j]) == 0) return false;
      }
    }
  }
  return true;
}
function check(board, i, j, cond) {
  let a = true;
  let b = cond;
  for (let k = 0; k < 4; k++) {
    if ((board[i][k] == b && k ^ j) || (board[k][j] == b && k ^ i)) a = false;
  }

  let r = Math.floor(i / 2) * 2;
  let c = Math.floor(j / 2) * 2;
  for (let p = r; p < r + 2; p++) {
    for (let q = c; q < c + 2; q++) {
      if (board[p][q] == b && p != i && q != j) a = false;
    }
  }
  return a;
}

function solve(board) {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] == ".") {
        for (let k = "1"; k <= "4"; k++) {
          if (check(board, i, j, k)) {
            board[i][j] = parseInt(k);
            if (solve(board)) {
              return 1;
            } else {
              board[i][j] = ".";
            }
          } else {
            continue;
          }
        }
        return 0;
      }
    }
  }
  return 1;
}

function resetGrid() {
  const size = 4;
  document.getElementById("verdictSection").innerHTML = ""; // Clear verdict section

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const field = document.getElementById(`grid${i}${j}`);
       if (field) {
      
        // Reset color 
        field.style.color = 'black';
        
        // Other reset logic
        field.value = "";
        
      }
    }
  }
}

// function gridReset(){
//  document.getElementById("resetButton").addEventListener("click", () => {
//     resetGrid();
//   });
// }

document.getElementById("resetButton").addEventListener("click", (e) => {
  e.preventDefault(); // Prevents the form from being submitted and page refresh
  resetGrid();
});

