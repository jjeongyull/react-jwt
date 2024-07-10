import React, { useState, useEffect } from 'react';
import { Container, Button, Typography, Grid, Card, CardContent, CardActions, IconButton } from '@mui/material';
import ProjectDialog from '../components/ProjectDialog';
import postApi from '../utils/api';
import { selectUserInfo } from '../features/user/userSlice';
import { useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import ConfirmationDialog from '../components/ConfirmationDialog';

const MainPage = ({ setSelectProjectName }) => {
  const [projects, setProjects] = useState([]);
  const [delIdx, setDelIdx] = useState('');
  const navigate = useNavigate();
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null); // 선택된 프로젝트 정보를 저장할 상태
  const userInfo = useSelector(selectUserInfo);
  const [confirmState, setConfirmState] = useState(false);

  
  const confirmOpen = (idx) => {
    setConfirmState(true);
    setDelIdx(idx);
  };

  const confirmClose = () => {
    setConfirmState(false);
  };

  const openProjectDialog = (project) => {
    setSelectedProject(project); // 수정할 프로젝트 정보 설정
    setProjectDialogOpen(true);
  };

  const closeProjectDialog = () => {
    setSelectedProject(null); // 다이얼로그 닫힐 때 초기화
    setProjectDialogOpen(false);
  };

  const addProject = (project) => {
    setProjects(project);
  };

  const projectDetailGo = (project) => {
    setSelectProjectName(project.projectName);
    navigate(`project/${project.idx}`);
  };

  const deleteProject = async (idx) => {
    try {
      const response = await postApi({ cmd: 'delete_project', idx: idx,  write_user: userInfo.user_id });
      if (response.success) {
        setProjects(response.project);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error('토큰 에러:', error);
      setProjects([]); 
    }
    setConfirmState(false);
  }

  const loadProject = async () => {
    try {
      const response = await postApi({ cmd: 'load_project', write_user: userInfo.user_id });
      if (response.success) {
        setProjects(response.project);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error('토큰 에러:', error);
      setProjects([]); 
    }
  };
  useEffect(() => {
    if (userInfo) {
      loadProject();
    }
  }, [userInfo]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        프로젝트 목록
      </Typography>
      <Button variant="contained" onClick={() => openProjectDialog(false)} sx={{ mb: 2 }}>
        프로젝트 등록
      </Button>
      <Grid container spacing={3}>
        {projects.map((project, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  {project.projectName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  총 콘텐츠 갯수: {project.contentCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  완료된 콘텐츠 갯수: {project.complateCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  시작일: {project.startDate}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  종료일: {project.endDate}
                </Typography>
              </CardContent>
              <CardActions>
                <Button variant="outlined" onClick={() => projectDetailGo(project)}>
                  콘텐츠 관리
                </Button>
                <IconButton aria-label="edit" color="primary" onClick={() => openProjectDialog(project)}>
                  <EditIcon />
                </IconButton>
                <IconButton aria-label="delete" onClick={() => confirmOpen(project.idx)} color="error">
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <ProjectDialog
        open={projectDialogOpen}
        onClose={closeProjectDialog}
        addProject={addProject}
        project={selectedProject} // 선택된 프로젝트 정보 전달
      />
      <ConfirmationDialog
        open={confirmState}
        onClose={confirmClose}
        onConfirm={() => deleteProject(delIdx)}
        message="프로젝트를 삭제 하시겠습니까?"
      />
    </Container>
  );
};

export default MainPage;
