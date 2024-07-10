import React, { useState } from 'react';
import postApi from '../utils/api';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useParams } from 'react-router-dom';

const ContentDialog = ({ open, Close, setContents }) => {
  const [contentName, setContentName] = useState('');
  const { id } = useParams();


  const ContentNameChange = (event) => {
    setContentName(event.target.value);
  };

  const Submit = async () => {
    const data = {
      cmd: 'insert_content',
      projectIdx: id,
      contentName: contentName
    };
    try {
      const result = await postApi(data);
      if (result.success) {
        alert('콘텐츠 등록이 완료되었습니다.');
        setContents(result.contentList);
        Close();
      } else {
        alert(result.error || '콘텐츠 등록에 오류가 발생하였습니다.');
      }
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  return (
    <Dialog open={open} onClose={Close}>
      <DialogTitle>콘텐츠 등록</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="contentName"
          label="콘텐츠명"
          type="text"
          fullWidth
          value={contentName}
          onChange={ContentNameChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={Close} color="secondary">취소</Button>
        <Button onClick={Submit} color="primary">등록</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContentDialog;
