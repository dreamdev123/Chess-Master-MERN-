/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Helmet from 'react-helmet';
import { Link, useHistory } from 'react-router-dom';
import { URL } from "../components/config";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Container, Grid, ButtonGroup, AppBar, Toolbar, Typography, Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import NewGameModal from './NewGameModal'
import LogoutModal from './LogoutModal'
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

const Lobby = () => {
  const classes = useStyles();
  const history = useHistory()
  const [openNewGameModal, setOpenNewGameModal] = useState(false)
  const [openLogoutModal, setOpenLogoutModal] = useState(false)
  const [userId, setUserId] = useState(localStorage.getItem('userId'))

  const [allGames, setAllGames] = useState([]);
  const [allUserGames, setAllUserGames] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      // eslint-disable-next-line no-undef
      axios.get(`${URL}/api/seeks/${userId}`).then(({ data, err }) => {
        if (err) {
          // eslint-disable-next-line no-console
          return console.log(err);
        }
        return setAllGames(data);
      });
      // eslint-disable-next-line no-undef
      axios.get(`${URL}/api/allUserGames/${userId}`).then(({ data, err }) => {
        if (err) {
          // eslint-disable-next-line no-console
          return console.log(err);
        }
        return setAllUserGames(data);
      });
    }, 2000);

    return () => {
      // eslint-disable-next-line no-console
      console.log('clean');
      return clearTimeout(timer);
    };
  },
    [userId]);
  useEffect(() => {
    if (!userId) {
      history.push('/')
    }
  }, [history, userId])
  if (!allGames) {
    return <p>Loading seeks...</p>;
  }
  return (
    <div className={classes.root}>
      <Helmet><title>Lobby</title></Helmet>
      <AppBar position="static">
  <Toolbar>
  <Avatar src="/broken-image.jpg" />
  <p style={{ color: 'red'}}>{localStorage.getItem('userId') && localStorage.getItem('userId')}</p>
          <Button style={{ position:'absolute', right:0 }} color="inherit" onClick={() => setOpenLogoutModal(true)}>Logout</Button>     
  </Toolbar>
</AppBar><br />
      <Container>
        <NewGameModal openNewGameModal={openNewGameModal} setOpenNewGameModal={setOpenNewGameModal} userId={userId} />
        <LogoutModal openLogoutModal={openLogoutModal} setUserId={setUserId} userId={userId} setOpenLogoutModal={setOpenLogoutModal} />
      
                <Button variant="contained" color="primary" onClick={() => setOpenNewGameModal(true)}>Create New Game</Button>
              
          <Grid container spacing={3}>
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              <p>All Game Requests</p>
              <TableContainer component={Paper} >
                <Table size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Player one </TableCell>
                      <TableCell align="right"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allGames.map(seek => (
                      <TableRow key={seek._id}>
                        <TableCell component="th" scope="seek">
                          {seek.playerOne}
                        </TableCell>
                        <TableCell align="right"><Link to={`/game/${seek._id}`} style={{ textDecoration: 'none' }}><Button type="submit" variant="contained" color="primary" size="small">PLAY</Button></Link></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
            </Grid>
            <Grid item xs={6}>
            <Paper className={classes.paper}>
              User game request with <span style={{ color: 'red'}}>{localStorage.getItem('userId') && localStorage.getItem('userId')} </span> 
              <TableContainer component={Paper} >
                <Table size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell>player one </TableCell>
                      <TableCell align="right"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allUserGames.map(seek => (
                      <TableRow key={seek._id}>
                        <TableCell component="th" scope="seek">
                          {seek.playerOne}
                        </TableCell>
                        <TableCell align="right"><Link to={`/game/${seek._id}`} style={{ textDecoration: 'none' }}><Button type="submit" variant="contained" color="primary" size="small">PLAY</Button></Link></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
            </Grid>
          </Grid>
          {/* <Grid item xs={12} sm={6}>
            <Paper className={classes.paper}>
              <ButtonGroup
                orientation="vertical"
                color="primary"
                aria-label="vertical outlined primary button group"
              >
                <Button onClick={() => setOpenNewGameModal(true)}>Create New Game</Button>
              </ButtonGroup>
            </Paper>
          </Grid> */}
        
      </Container>
    </div >
  );
};

export default Lobby;

