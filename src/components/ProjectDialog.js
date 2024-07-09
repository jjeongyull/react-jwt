import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../features/user/userSlice';
import postApi from '../utils/api';
import Alert from '../components/Alert';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button } from '@mui/material';

const ProjectDialog = ({ open, onClose, addProject }) => {
  const [projectName, setProjectName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [contentCount, setContentCount] = useState(0);
  const userInfo = useSelector(selectUserInfo);
  const [error, setError] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('error');

  const projectInsert = async () => {
    const data = {
      cmd: 'insert_project',
      projectName,
      startDate,
      endDate,
      contentCount,
      write_user: userInfo.user_id
    };
    try {
      const result = await postApi(data);
      if (result.success) {
        setAlertMessage('프로젝트 등록이 완료되었습니다.');
        setAlertOpen(true);
        addProject(result.project);
        onClose();
      } else {
        setError(result.error || '프로젝트 등록에 오류가 발생하였습니다.');
        setAlertMessage(result.error || 'Registration failed');
        setAlertSeverity('error');
        setAlertOpen(true);
      }
    } catch (error) {
      console.error('There was an error!', error);
      setError('Error communicating with server');
      setAlertMessage('Error communicating with server');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>프로젝트 등록</DialogTitle>
      <DialogContent>
        <DialogContentText>
          프로젝트의 정보를 입력하세요.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="프로젝트명"
          fullWidth
          variant="standard"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="시작일"
          type="date"
          fullWidth
          variant="standard"
          InputLabelProps={{
            shrink: true,
          }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          margin="dense"
          label="종료일"
          type="date"
          fullWidth
          variant="standard"
          InputLabelProps={{
            shrink: true,
          }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <TextField
          margin="dense"
          label="콘텐츠 갯수"
          type="number"
          fullWidth
          variant="standard"
          value={contentCount}
          onChange={(e) => setContentCount(Number(e.target.value))}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button onClick={projectInsert}>등록</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectDialog;
