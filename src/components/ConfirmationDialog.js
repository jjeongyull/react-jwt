import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

const ConfirmationDialog = ({ open, onClose, onConfirm, message }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>로그아웃</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          취소
        </Button>
        <Button onClick={onConfirm} color="secondary" variant="contained">
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
