import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../features/user/userSlice';
import postApi from '../utils/api';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button } from '@mui/material';

const ProjectDialog = ({ open, onClose, addProject, project }) => {
  const [projectName, setProjectName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const userInfo = useSelector(selectUserInfo);
  const [error, setError] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('error');

  useEffect(() => {
    if (project) {
      setProjectName(project.projectName);
      setStartDate(project.startDate);
      setEndDate(project.endDate);
    } else {
      setProjectName('');
      setStartDate('');
      setEndDate('');
    }
  }, [project]);

  const projectInsert = async () => {
    const data = {
      cmd: project ? 'update_project' : 'insert_project', // 등록과 수정 구분
      idx: project ? project.idx : null, // 수정 시에만 idx 전달
      projectName,
      startDate,
      endDate,
      write_user: userInfo.user_id
    };

    try {
      const result = await postApi(data);
      if (result.success) {
        setAlertMessage(project ? '프로젝트 수정이 완료되었습니다.' : '프로젝트 등록이 완료되었습니다.');
        setAlertOpen(true);
        addProject(result.project);
        onClose();
      } else {
        setError(result.error || (project ? '프로젝트 수정에 오류가 발생하였습니다.' : '프로젝트 등록에 오류가 발생하였습니다.'));
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
      <DialogTitle>프로젝트 {project ? '수정' : '등록'}</DialogTitle>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button onClick={projectInsert}>{project ? '수정' : '등록'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectDialog;
