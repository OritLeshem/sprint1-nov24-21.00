'use script'
let timmy
let seconds = 0;
var elTimer = document.querySelector('.time')



function addRandomBoom(gBoard) {
  getArrayWithNoStartAndNeg(gBoard)
}

function negOfStartPoint(cellI, cellJ, gBoard) {
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i === cellI && j === cellJ) gBoard[i][j].relatedStartGamePoint = true
      if (j < 0 || j >= gBoard[i].length) continue
      gBoard[i][j].relatedStartGamePoint = true
    }
  }
}

function getArrayWithNoStartAndNeg(gBoard) {
  var emptyNegAndPos = []
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j].relatedStartGamePoint === false) emptyNegAndPos.push({ i: i, j: j })
    }
  }
  var randomIndex = getRandomInt(0, emptyNegAndPos.length - 1)
  return emptyNegAndPos[randomIndex]
}

function countNeighbors(cellI, cellJ, mat) {
  var neighborsCount = 0
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= mat.length) continue
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i === cellI && j === cellJ) continue
      if (j < 0 || j >= mat[i].length) continue
      if (mat[i][j].isMine === true) neighborsCount++
    }
  }
  gBoard[cellI][cellJ].minesAroundCount = neighborsCount
  var elNeg = document.querySelector('h3')
  return neighborsCount
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function showTime() {
  seconds++;
  let mins = Math.floor(seconds / 60)
  let secs = Math.floor(seconds % 60);
  let output =
    mins.toString().padStart(2, '0') + ':' +
    secs.toString().padStart(2, '0');
  var elH2 = document.querySelector('.time')
  elH2.innerText = `TIME : ${output}`
}

