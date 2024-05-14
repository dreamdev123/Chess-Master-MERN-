import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { useHistory } from 'react-router-dom';
import axios from 'axios'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center'
  },
  formControl: {
    margin: theme.spacing(3),
  },
}));

const TransitionsModal = ({ openNewGameModal, setOpenNewGameModal, userId }) => {
  const classes = useStyles();
  const history = useHistory()
  const [value, setValue] = useState('w');
  const [errorMessage, setErrorMessage] = useState('')
  const handleClose = () => {
    setOpenNewGameModal(false)
  };

  const handleChange = event => {
    setValue(event.target.value);
  };
  const createGame = () => {
    axios.post('http://localhost:8000/api/seeks/', { userId, color: value }).then((res) => {
      if (res.data.err) {
        setErrorMessage(res.data.err)
      } else {
        history.push(`/game/${res.data._id}`);
      }
    }).catch(error => {
      if (error.response) {
        setErrorMessage(error.response.data.err)
      }
    });
  };
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openNewGameModal}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openNewGameModal}>
          <div className={classes.paper}>
            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">Chose your color</FormLabel>
              <RadioGroup aria-label="gender" name="gender1" value={value} onChange={handleChange}>
                <FormControlLabel value="w" control={<Radio />} label="White" />
                <FormControlLabel value="b" control={<Radio />} label="Black" />
              </RadioGroup>
            </FormControl>
            <Button variant="contained" onClick={createGame}>Start</Button>
            <p style={{ color: 'red', marginTop: 15 }}>{errorMessage}</p>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
export default TransitionsModal;