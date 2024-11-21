import {useState,useRef,useEffect} from "react";
import { Jumbotron } from "./migration";
import Container from "react-bootstrap/Container";
import "./ttt.css";


function Square({value,onSquareClick}) {
    return <button className="square" onClick={onSquareClick}>
        {value}
        </button>;
  }


const Board = () =>{


    const [xIsNext, setXIsNext] = useState(true);
    const [squares, setSquares] = useState(Array(9).fill(null));

    function handleClick(i){
        if(squares[i] || calculateWinner(squares) ) return;
        const nextSquares = squares.slice();
        if(xIsNext){
            nextSquares[i] = "X";
        }else{
            nextSquares[i] = "O";
        }
        
        setSquares(nextSquares);
        setXIsNext(!xIsNext);
    }

    const winner = calculateWinner(squares);
    const isBoardFull = squares.every((square) => square !== null);
    let status;
    if(winner){
        status = "Winner: "+winner;
    }else if(isBoardFull){
      status = "It's a TIE!";
    }
    else{
        status = "Next player: " + (xIsNext ? "X" : "O");
    }


    return (
      <section id="tictactoe">
        <Jumbotron>
        <div className="tictactoe-container">
        <div><h1>Welcome to TicTacToe</h1></div>
        <div><h2>{status}</h2></div>

        <div className="board-position" >
          <div className="board-row">
          <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
          </div>
          <div className="board-row">
          <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
          </div>
          <div className="board-row">
          <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
          </div>
          </div>
          </div>
          </Jumbotron>
          </section>
      );
}

function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

export default Board;