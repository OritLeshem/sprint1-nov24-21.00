'use strict'
// HTML SELECTORS :
var elgGameMarkedCount = document.querySelector('.marked')
var elgGMoves = document.querySelector('.moves')
var elShownCells = document.querySelector('.shown')
var elGameOver = document.querySelector('.msg')
const elSmiley = document.querySelector('.smiley')

// GLOBAL VARIABLES :
var gBoard
var gMoves = 0
var gBooms = []
var gLevel = { SIZE: 4, MINES: 2, LIVES: 1 }
var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: seconds
}
var gBoomsExposed = 0
const MINE = '💣'
const MARK = '❗️'
const HEART = '❤️'

function onInitGame() {
  clearInterval(timmy)
  gGame.isOn = true
  gBoard = buildBoard()
  renderBoard(gBoard)
  seconds = 0
  gMoves = 0
  elGameOver.style.display = "none"
  elgGMoves.innerText = `MOVES : ${gMoves}`
  gGame.shownCount = 0
  elShownCells.innerText = `SHOWN : ${gGame.shownCount}`
  timmy = setInterval(showTime, 1000);
  elSmiley.innerHTML = `<div class="smiley-icon" onclick="onInitGame()"><span>😃</span></div>`
  var gBoomsExposed = 0
  lives()

}

function setMinesNegsCount(gBoard) {
  for (var i = 0; i < gLevel.SIZE; i++) {
    for (var j = 0; j < gLevel.SIZE; j++) {
      gBoard[i][j].minesAroundCount = countNeighbors(i, j, gBoard)
    }
  }
}


function buildBoard() {
  const board = []
  for (var i = 0; i < gLevel.SIZE; i++) {
    board[i] = []
    for (var j = 0; j < gLevel.SIZE; j++) {
      board[i][j] = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: false, relatedStartGamePoint: false }
    }
  }
  return board
}

function renderBoard(board) {
  gGame.shownCount = 0
  const elBoard = document.querySelector('.board')
  var strHTML = ''
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>\n'
    for (var j = 0; j < board[0].length; j++) {
      const currCell = board[i][j]
      var cellClass = getClassName({ i: i, j: j })
      if (currCell.isShown === false) cellClass += ' unshown'
      strHTML += `\t<td class="cell ${cellClass}"  oncontextmenu="cellMarked(event, this,${i},${j})" onclick="cellClicked(this,${i},${j})" >\n`
      if (currCell.isShown === false) {
        cellClass += 'unshown'
        if (currCell.isMarked === true) strHTML += MARK
      }
      else {
        if (currCell.isMine === true) {
          strHTML += MINE
          gBoomsExposed++
          console.log("booms exposed", gBoomsExposed)
        }

        if (currCell.minesAroundCount > 0 && currCell.isMine === false) strHTML += currCell.minesAroundCount
        gGame.shownCount++ //count shown cells
        elShownCells.innerText = `SHOWN : ${gGame.shownCount}`
        if (currCell.isMarked) {
          currCell.isMarked = false//was marked but shown,should be again not marked
          gGame.markedCount-- //count down the marked that was removed
        }

        elgGameMarkedCount.innerText = `MARKED : ${gGame.markedCount}`
      }
      strHTML += '\t</td>\n'
    }
    strHTML += '</tr>\n'
  }
  elBoard.innerHTML = strHTML
}

function cellMarked(e, elCell, i, j) {
  e.preventDefault();
  if (gGame.markedCount === gLevel.MINES) return//can't mark more than the mines
  if (gGame.isOn === false) return
  if (gBoard[i][j].isMarked === false) {
    gBoard[i][j].isMarked = true
    gGame.markedCount++
    elgGameMarkedCount.innerText = `MARKED : ${gGame.markedCount}`
    renderBoard(gBoard)
    checkGameOver()
  } else {
    gBoard[i][j].isMarked = false
    gGame.markedCount--
    elgGameMarkedCount.innerText = `MARKED : ${gGame.markedCount}`
    renderBoard(gBoard)
    checkGameOver()
  }
}

function cellClicked(elCell, clickedI, clickedJ) {
  if (gGame.isOn === false) return
  if (gMoves === 0) {
    gBoard[clickedI][clickedJ].isShown = true
    gBoard[clickedI][clickedJ].startGamePoint = true
    negOfStartPoint(clickedI, clickedJ, gBoard)
    gMoves++
    var elgGMoves = document.querySelector('.moves')
    elgGMoves.innerText = `Moves : ${gMoves}`
    renderBoard(gBoard)
    for (var t = 0; t < gLevel.MINES; t++) {
      var randomBoom = getArrayWithNoStartAndNeg(gBoard)
      gBoard[randomBoom.i][randomBoom.j].isMine = true
      renderBoard(gBoard)
    }
  }
  else {
    addRandomBoom(gBoard)
    setMinesNegsCount(gBoard)
    gMoves++
    var elgGMoves = document.querySelector('.moves')
    elgGMoves.innerText = `Moves : ${gMoves}`
    gBoard[clickedI][clickedJ].isShown = true
    if (gBoard[clickedI][clickedJ].minesAroundCount === 0) {
      expandShown(gBoard, elCell, clickedI, clickedJ)
    }
    renderBoard(gBoard)
    checkGameOver(clickedI, clickedJ)
  }
}

function expandShown(mat, elCell, cellI, cellJ) {
  var neighborsCount = 0
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= mat.length) continue
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i === cellI && j === cellJ) continue
      if (j < 0 || j >= mat[i].length) continue
      mat[i][j].isShown = true
    }
  }
  gBoard[cellI][cellJ].minesAroundCount = neighborsCount
  return neighborsCount
}

function checkGameOver(clickedI, clickedJ) {
  var elGameOver = document.querySelector('.msg')
  if (gGame.shownCount + gGame.markedCount === gLevel.SIZE * gLevel.SIZE) {
    console.log("won", gGame.shownCount, gGame.markedCount, gLevel.SIZE * gLevel.SIZE)
    gGame.isOn = false
    elGameOver.style.display = "block"
    elGameOver.innerText = "YOU WON!"
    smiley()
    clearInterval(timmy)
  }
  if (gBoard[clickedI][clickedJ].isMine === true) {
    if (gLevel.LIVES === 0) {
      clearInterval(timmy)
      gGame.isOn = false
      elGameOver.style.display = "block"
      elGameOver.innerText = "GAME OVER"
      smiley()
    } else {
      gLevel.LIVES--
      lives()
      smiley()
    }
  }
}

function onLevel(elBtnLevel, level, mine) {
  onInitGame()
  gLevel.SIZE = level
  gLevel.MINES = mine

  if (mine === 2) {
    gLevel.LIVES = 1
    lives()
    smiley()
  }
  else {
    gLevel.LIVES = 3
    lives()
    smiley()
  }
}

function lives() {
  const elLives = document.querySelector('.lives')
  var strHTML = ''
  for (var i = 0; i < gLevel.LIVES; i++) {
    strHTML += `<div class="heart" >${HEART}</div>`
  }
  elLives.innerHTML = strHTML
}

function smiley() {
  const elSmiley = document.querySelector('.smiley')
  var strHTML = `<div class="smiley-icon" onclick="onInitGame()"><span>😃</span></div>`
  if (elGameOver.innerText === "YOU WON!") strHTML = `<div class="smiley" onclick="onInitGame()"><span>😎</span></div>`
  else {
    if (gLevel.MINES === 2) {
      if (gLevel.LIVES === 0) strHTML = `<div class="smiley-icon" onclick="onInitGame()"><span>🤯</span></div>`
    }
    if (gLevel.MINES > 2) {
      if (gLevel.LIVES === 3)`<div class="smiley-icon" onclick="onInitGame()"><span>😃</span></div>`
      if (gLevel.LIVES < 3) strHTML = `<div class="smiley-icon" onclick="onInitGame()"><span>🤯</span></div>`
    }

  }
  elSmiley.innerHTML = strHTML
}


function getClassName(location) {
  const cellClass = 'cell-' + location.i + '-' + location.j
  return cellClass
}

