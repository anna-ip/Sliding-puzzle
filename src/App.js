import React, { useState, useEffect } from 'react'
import './App.css'

//gives a random board/puzzle with 3x3 tiles
const getShuffledPuzzle = () => {
  const values = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  const rowOne = [],
    rowTwo = [],
    rowThree = [];

  while (values.length) {
    const random = Math.floor(Math.random() * values.length)

    if (rowOne.length < 3) {
      rowOne.push(values.splice(random, 1)[0])
    } else if (rowTwo.length < 3) {
      rowTwo.push(values.splice(random, 1)[0])
    } else {
      rowThree.push(values.splice(random, 1)[0])
    }
  }
  return [rowOne, rowTwo, rowThree]
}

const flattenArray = (arr) => {
  console.log(Array.isArray(arr), arr)
  return arr.reduce((flatArr, subArr) => flatArr.concat(subArr), [])
};

const getInversionCount = arr => {
  arr = flattenArray(arr).filter(n => n !== 0)
  const inversions = [];

  for (let i = 0; i < arr.length - 1; i++) {
    const currentValue = arr[i]
    const currentInversions = arr.filter(
      (val, j) => i < j && val < currentValue
    )
    inversions.push(currentInversions.length)
  }

  const inversionsCount = inversions.reduce((total, val) => total + val, 0)

  return inversionsCount
}

const isSolvable = puzzle => {
  return getInversionCount(puzzle) % 2 === 0
};

const getPuzzle = () => {
  let puzzle = getShuffledPuzzle()

  while (!isSolvable(puzzle)) {
    puzzle = getShuffledPuzzle()
  }
  return puzzle
}

export const App = () => {
  const [puzzle, setPuzzle] = useState([])
  const [complete, setComplete] = useState(false)
  const [moves, setMoves] = useState(0)

  useEffect(() => {
    setPuzzle(getPuzzle())
  }, [])

  const movePiece = (x, y) => {
    if (!complete) {
      if (checkNeighbours(x, y) || checkNeighbours(x, y, 2)) {
        const emptySlot = checkNeighbours(x, y) || checkNeighbours(x, y, 2)

        const newPuzzle = puzzle.map(row => row.slice());

        if (x === emptySlot.x && y < emptySlot.y) {
          newPuzzle[emptySlot.x][emptySlot.y] = puzzle[x][y + 1]
          newPuzzle[x][y + 1] = newPuzzle[x][y]
          newPuzzle[x][y] = 0
        } else if (x === emptySlot.x && y > emptySlot.y) {
          newPuzzle[emptySlot.x][emptySlot.y] = puzzle[x][y - 1]
          newPuzzle[x][y - 1] = newPuzzle[x][y]
          newPuzzle[x][y] = 0
        }

        if (y === emptySlot.y && x < emptySlot.x) {
          newPuzzle[emptySlot.x][emptySlot.y] = puzzle[x + 1][y]
          newPuzzle[x + 1][y] = newPuzzle[x][y]
          newPuzzle[x][y] = 0
        } else if (y === emptySlot.y && x > emptySlot.x) {
          newPuzzle[emptySlot.x][emptySlot.y] = puzzle[x - 1][y]
          newPuzzle[x - 1][y] = newPuzzle[x][y]
          newPuzzle[x][y] = 0
        }
        setPuzzle(newPuzzle)
        setMoves(moves + 1)
        checkCompletion(newPuzzle)
      }
    }
  }

  const checkCompletion = puzzle => {
    if (flattenArray(puzzle).join('') === '123456780') {
      setComplete(true)
    }
  }

  const checkNeighbours = (x, y, d = 1) => {
    const neighbours = []

    if (puzzle[x][y] !== 0) {
      neighbours.push(puzzle[x - d] && puzzle[x - d][y] === 0 && { x: x - d, y: y })
      neighbours.push(puzzle[x][y + d] === 0 && { x: x, y: y + d })
      neighbours.push(puzzle[x + d] && puzzle[x + d][y] === 0 && { x: x + d, y: y })
      neighbours.push(puzzle[x][y - d] === 0 && { x: x, y: y - d })
    }
    const emptySlot = neighbours.find(el => typeof el === 'object')

    return emptySlot
  }

  const resetPuzzle = () => {
    setComplete(false)
    setPuzzle(getPuzzle())
    setMoves(0)
  }


  return (
    <div className='background'>
      {/* {<h4>Moves: {moves}</h4>} */}
      <div className='board'>


        {puzzle.map((row, i) => (
          <div key={i} style={{ display: 'flex' }}>
            {row.map((col, j) => {
              const color = col === 0 ? 'transparent' : 'lightgray'
              return (
                <div className='tiles' key={`${i}-${j}`} onClick={() => movePiece(i, j)}
                  style={{
                    backgroundColor: color,
                    cursor: complete ? 'not-allowed' : 'pointer',
                    userSelect: 'none'
                  }}>
                  <span style={{ fontFamily: 'Open Sans' }}> {col !== 0 && col}</span>

                </div>
              )
            })}
          </div>
        ))}

        <button className='shuffle-btn' onClick={() => { resetPuzzle() }}>Slumpa</button>

        {complete && (
          <div className='new-game'>
            <h1>Grattis!!</h1>
            <button className='new-game-btn' onClick={() => { resetPuzzle() }}>
              Ny omgång
          </button>
          </div>
        )}
      </div>


    </div>
  )
}
