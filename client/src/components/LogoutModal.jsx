import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { useHistory } from 'react-router-dom';
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

const TransitionsModal = ({ openLogoutModal, setOpenLogoutModal, userId }) => {
  const classes = useStyles();
  const history = useHistory()
  const handleClose = () => {
    setOpenLogoutModal(false)
  };

  const handleLogout = () => {
    localStorage.removeItem('userId')
    history.push('/')
  }
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openLogoutModal}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openLogoutModal}>
          <div className={classes.paper}>
            <h4>Hello {userId}, we are sorry
            but If you log out, you will lose the access to your account </h4>
            <Button variant="contained" onClick={handleLogout}>logout</Button>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
export default TransitionsModal;