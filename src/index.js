import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  let classes = "square";
  if (props.winningSquare){
    classes += " winning_square";
  }
  return (
    <button className={classes} onClick={props.onClick}>{props.value}</button>
  );
}
  
class Board extends React.Component {
  renderSquare(i, winningSquares) {
    const winningSquare = winningSquares.includes(i);
    return <Square winningSquare={winningSquare} value={this.props.squares[i]} key={i} 
                    onClick = {() => this.props.onClick(i)}/>;
  }

  render() {
    const winningSquares = calculateWinningSquares(this.props.squares);
    let rows = []; 
    for (let i = 0; i < 3; i ++){
      let sqs = [];
      for (let j = 0; j < 3; j ++){
          sqs.push(this.renderSquare(j + 3*i, winningSquares));
      }
      rows.push((<div className='board-row' key={i}>{sqs}</div>));
    }
    
    return rows;
  }
}
  
class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history : [{
        squares : Array(9).fill(null), 
        row : null,
        col : null,
      }],
      stepNumber: 0,
      xIsNext : true,
      movesSortedUp: true,
    };
    
  }

  jumpTo(step) {
    this.setState({
      stepNumber : step,
      xIsNext : (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const movesSortedUp = this.state.movesSortedUp;
    //console.log(calculateDraw(current.squares));
    let moves = history.map((step, move) => {
      const desc = move ? 'Go to move # ' + move + ' (' + step.row + ', ' + step.col + ')': 'Go to start';
      
      //bolds the current stepnumber 
      if (move === this.state.stepNumber) {
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}><b>{desc}</b></button>
          </li>
        );
      }

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    if(!movesSortedUp){
      moves.reverse()
    }

    let status;
    if(winner) {
      status = "Winner: " + winner;
    } else if (calculateDraw(current.squares)) {
      status = "Draw";
    } else {
      status = "Next Player: " + (this.state.xIsNext? 'X' : 'O'); 
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick = {(i) => this.handleClick(i)} 
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.setState({movesSortedUp : !movesSortedUp})}>Sort</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }

  handleClick(i) {
    const row = Math.floor(i/3) + 1;
    const col = i % 3 + 1; 
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext? 'X' : 'O';
    this.setState({
      history : history.concat([{
        squares: squares,
        row : row, 
        col : col,
      }]),
      stepNumber : history.length,
      xIsNext : !this.state.xIsNext,
    })
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [1,4,7],
    [0,3,6],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];

  for(let i = 0; i < lines.length; i++){
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
      } 
    }
  return null;
}

function calculateWinningSquares(squares){
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [1,4,7],
    [0,3,6],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];

  for(let i = 0; i < lines.length; i++){
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a,b,c]
    } 
  }
  return [];
}

function calculateDraw(squares){
  for (let i = 0; i < squares.length; i++){
    if(squares[i] === null){
      return false;
    }
  }
  return true;
}
  
