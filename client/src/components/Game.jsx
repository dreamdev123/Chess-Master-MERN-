import React, { useEffect, useState } from "react";
import Helmet from "react-helmet";
import Chess from "chess.js";
import Chessboard from "chessboardjsx";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { URL } from "./config";
import { Button, AppBar, Toolbar, Grid, Container, Avatar, ButtonGroup, Table } from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import LogoutModal from "./LogoutModal";

function Game() {
  const { id } = useParams();
  const [chess, updateChess] = useState(new Chess());
  const [fen, updateFen] = useState("start");
  const [moveHistory, updateMoveHistory] = useState([]);
  const [gameStarted, updateGameStarted] = useState(false);
  const [playerOne, updatePlayerOne] = useState("");
  const [playerTwo, updatePlayerTwo] = useState("");
  const [myColor, updateMyColor] = useState("");
  const [squareStyles, updateSquareStyles] = useState({});
  const [pieceSquare, updatePieceSquare] = useState("");
  const [check, updateCheck] = useState(false);
  const [winner, updateWinner] = useState("");
  const [draw, updateDraw] = useState(false);
  const [drawReason, updateDrawReason] = useState("");
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

  function checkForCheck() {
    if (chess.in_check()) {
      updateCheck(true);
    } else {
      updateCheck(false);
    }
  }

  function checkForGameOver() {
    if (chess.game_over()) {
      if (chess.in_checkmate()) {
        // The winner is the last player making a move
        const playerInTurn = chess.turn();
        if (playerInTurn === "w") {
          updateWinner("black player");
        } else {
          updateWinner("white player");
        }
      } else if (chess.in_draw()) {
        updateDraw(true);
        // Check for draw reasons
        if (chess.in_stalemate()) {
          updateDrawReason("stalemate");
        } else if (chess.insufficient_material()) {
          updateDrawReason("insufficient material");
        }
      }
    }
  }

  useEffect(() => {
    // GET request
    axios.get(`${URL}/api/game/${id}`).then(({ data, err }) => {
      if (err) {
        return console.log(err);
      }

      // Fetch user id from local storage
      const myUserId = window.localStorage.getItem("userId");

      // Start game if not started
      // Player two starts the game when entering game page
      // *Checking if there is a playerOne that is not me*
      if (!data.started && data.playerOne && myUserId !== data.playerOne) {
        axios
          .post(`${URL}/api/game/play`, {
            playerTwo: myUserId,
            id: id
          })
          .then(function(response) {
            return response;
          })
          .catch(function(error) {
            console.log(error);
          });
      }

      // Set color
      if (data.w) {
        if (data.w === myUserId) updateMyColor("w");
        else updateMyColor("b");
      } else if (data.b) {
        if (data.b === myUserId) updateMyColor("b");
        else updateMyColor("w");
      }

      // Load move history
      if (data.history.length > 0) {
        const { history } = data;
        const historyWithNumbers = [];
        let moveString = "";

        // Create new game
        const game = new Chess();

        // Converting move history into a string to use in pgn
        let nr = 1;
        let newString = "";
        for (let i = 0; i < history.length; i += 1) {
          if (i % 2 === 0) {
            newString = `${nr}.${history[i]}`;
            historyWithNumbers.push(newString);
            nr += 1;
          } else {
            historyWithNumbers.push(history[i]);
          }
        }
        moveString = historyWithNumbers.join(" ");

        //Creating pgn
        const pgn = [moveString];

        // Load moves to game
        // Then update chess, fen and moveHistory
        game.load_pgn(pgn.join("\n"));
        updateChess(game);
        updateFen(game.fen());
        updateMoveHistory(game.history());
      }
    });
  }, [id]);

  // Check for fen updates every second
  // If game not started, check for game started
  useEffect(() => {
    const timer = setInterval(() => {
      axios.get(`${URL}/api/game/${id}`).then(response => {
        // Check if game is started
        if (!gameStarted && response.data.started) {
          updateGameStarted(true);
          updatePlayerOne(response.data.playerOne);
          updatePlayerTwo(response.data.playerTwo);
        }

        // If fen has changed, update chess, fen and history
        let newFen = response.data.fen;
        if (newFen && newFen !== fen) {
          // Adding moves to chess
          let newHistory = response.data.history;
          const newChess = new Chess();
          for (let move of newHistory) {
            newChess.move(move);
          }

          updateChess(newChess);
          updateFen(newFen);
          updateMoveHistory(newHistory);
          checkForCheck();
          checkForGameOver();
        }
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const squareStyling = ({ pieceSqr, history }) => {
    const sourceSquare = history.length && history[history.length - 1].from;
    const targetSquare = history.length && history[history.length - 1].to;

    return {
      [pieceSqr]: { backgroundcolor: "rgba(255, 255, 0, 0.4)" },
      ...(history.length && {
        [sourceSquare]: {
          backgroundcolor: "rgba(255, 255, 0, 0.4)"
        }
      }),
      ...(history.length && {
        [targetSquare]: {
          backgroundcolor: "rgba(255, 255, 0, 0.4)"
        }
      })
    };
  };

  // Show possible moves
  const highlightSquare = (sourceSquare, squaresToHighlight) => {
    const highlightStyles = [sourceSquare, ...squaresToHighlight].reduce(
      (a, c) => ({
        ...a,
        ...{
          [c]: {
            background: "radial-gradient(circle, #fffc00 36%, transparent 40%)",
            borderRadius: "50%"
          }
        },
        ...squareStyling({
          history: moveHistory,
          pieceSquare
        })
      }),
      {}
    );

    updateSquareStyles({ ...highlightStyles });
  };

  // keep clicked square style and remove hint squares
  function removeHighlightSquare() {
    // setState({ ...state, pieceSquare, history });
  }

  function allowDrag(data) {
    const { piece } = data;
    const piececolor = piece.charAt(0);
    if (myColor === "w" && piececolor === "b") {
      return false;
    }
    if (myColor === "b" && piececolor === "w") {
      return false;
    }
    // Stop all moves when the game is over
    if (winner || draw) {
      return false;
    }
    return true;
  }

  function onMouseOverSquare(square) {
    // Do nothing if the game is over, or if it's the other player's piece
    if (winner || draw) return;
    const piece = chess.get(square);
    if (piece) {
      const piececolor = piece.color;
      if (myColor !== piececolor) return;
    }

    // Get list of possible moves for this square
    const moves = chess.moves({
      square,
      verbose: true
    });

    // Exit if there are no moves available for this square
    if (moves.length === 0) return;

    const squaresToHighlight = [];
    for (let i = 0; i < moves.length; i += 1) {
      squaresToHighlight.push(moves[i].to);
    }

    highlightSquare(square, squaresToHighlight);
  }

  function onMouseOutSquare(square) {
    removeHighlightSquare(square);
  }

  function onSquareClick(square) {
    // Update states
    updateSquareStyles(
      squareStyling({ pieceSquare: square, history: moveHistory })
    );
    updatePieceSquare(square);
  }

  function onDrop(sourceSquare) {
    const sourceSq = sourceSquare.sourceSquare;
    const targetSq = sourceSquare.targetSquare;
    const { piece } = sourceSquare;
    const pieceType = piece.split("")[1];
    const isCapture = chess.get(targetSq);
    let sloppyMove = "";

    if (isCapture) {
      sloppyMove = `${pieceType + sourceSq}x${targetSq}`;
    } else {
      sloppyMove = pieceType + sourceSq + targetSq;
    }

    const move = chess.move(sloppyMove, { sloppy: true });

    // If the move is acceptable, send it to the server
    if (move) {
      // Creating variables
      let newFen = chess.fen();
      let newHistory = chess.history();

      // Update fen and history
      updateFen(newFen);
      updateMoveHistory(newHistory);

      // Send move to backend
      axios
        .post(`${URL}/api/game/move`, {
          id,
          gameFen: newFen, // State fen cannot be used since it may not be updated yet
          gameHistory: newHistory,
          gameStyle: "standard"
        })
        .then(response => {
          return response;
        })
        .catch(error => {
          console.log(error);
        });

      // Check for check + game over
      checkForCheck();
      checkForGameOver();
    }
  }

  return (
    <>
      <Helmet>
        <title>Game</title>
      </Helmet>
      <AppBar position="static">
        <Toolbar>
          <Avatar src="/broken-image.jpg" />
            <p style={{ color: 'red'}}>{localStorage.getItem("userId") && localStorage.getItem("userId")}</p>
          <Button color="inherit" component={Link} to={"/lobby"}>
            Lobby
          </Button>
          <Button
            style={{ position: "absolute", right: 0 }}
            color="inherit"
            onClick={() => setOpenLogoutModal(true)}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <br />
<LogoutModal openLogoutModal={openLogoutModal} setUserId={setUserId} userId={userId} setOpenLogoutModal={setOpenLogoutModal} />
<Container>
      
      {gameStarted ? (
        <h4>
          <ButtonGroup color="secondary">
  <Button>{playerOne}</Button>
  <Button>v/s</Button>
  <Button>{playerTwo}</Button>
</ButtonGroup>
        </h4>
      ) : null}
      {gameStarted && chess.turn() === myColor ? (
        <Alert severity="info" style={{maxWidth:'200px', fontWeight:'bold', position:'relative', left:'50%', transform: 'translateX(-50%)' }}>It's your turn!!</Alert>
      ) : null} <br />
      {winner ? <Alert severity="success" style={{maxWidth:'200px', fontWeight:'bold', position:'relative', left:'50%', transform: 'translateX(-50%)' }}>{winner} won!</Alert> : null}
      {draw ? <Alert severity="warning" style={{maxWidth:'200px', fontWeight:'bold', position:'relative', left:'50%', transform: 'translateX(-50%)' }}>DRAW! </Alert> : null}<br />
      {drawReason ? (
        <h3>
          Game was drawn due to
          {drawReason}
        </h3>
      ) : null}
       
      {check && !winner && !draw ? <Alert severity="warning" style={{maxWidth:'200px', fontWeight:'bold', position:'relative', left:'50%', transform: 'translateX(-50%)' }}>CHECK!</Alert> : null}
      <Grid container spacing={3}>
      <Grid item xs={9}>
        <Chessboard
          position={fen}
          squareStyles={squareStyles}
          onMouseOverSquare={onMouseOverSquare}
          onMouseOutSquare={onMouseOutSquare}
          onSquareClick={onSquareClick}
          onDrop={onDrop}
          allowDrag={allowDrag}
        />
        </Grid>
        <Grid item xs={3}>
        
        <HistoryTable moveHistory={moveHistory} />
        
        </Grid>
        </Grid>
        </Container>
    </>
  );
}

function HistoryTable({ moveHistory: moves }) {
  const tableRows = [];
  let round = 1;
  let whiteMove = "";
  let blackMove = "";
  for (let i = 0; i < moves.length; i += 2) {
    whiteMove = moves[i];
    blackMove = moves[i + 1];
    tableRows.push(
      <tr key={round}>
        <td>{round}</td>
        <td>{whiteMove}</td>
        <td>{blackMove}</td>
      </tr>
    );
    round += 1;
  }

  return (
    <>
    <Table border='1' style={{ backgroundColor:"lightblue", width:"230px"}} size="small" aria-label="a dense table">
      <thead>
        <tr>
          <th>#</th>
          <th>White Moves</th>
          <th>Black Moves</th>
        </tr>
      </thead>
      <tbody>{tableRows}</tbody>
    </Table>
    </>
  );
}

export default Game;
