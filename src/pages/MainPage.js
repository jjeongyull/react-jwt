import React, { useState, useEffect } from 'react';
import { Container, Button, Typography, Box, Grid, Card, CardContent, CardActions, IconButton } from '@mui/material';
import ProjectDialog from '../components/ProjectDialog';
import ContentManageDialog from '../components/ContentManageDialog';
import postApi from '../utils/api';
import { selectUserInfo } from '../features/user/userSlice';
import { useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const MainPage = () => {
  const [projects, setProjects] = useState([]);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [contentManageDialogOpen, setContentManageDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const userInfo = useSelector(selectUserInfo);

  const openProjectDialog = () => {
    setProjectDialogOpen(true);
  };

  const closeProjectDialog = () => {
    setProjectDialogOpen(false);
  };

  const addProject = (project) => {
    setProjects([...projects, project]);
  };
  
  const openContentManageDialog = (project) => {
    setSelectedProject(project);
    setContentManageDialogOpen(true);
  };

  const closeContentManageDialog = () => {
    setContentManageDialogOpen(false);
  };



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
      <Button variant="contained" onClick={openProjectDialog} sx={{ mb: 2 }}>
        프로젝트 등록
      </Button>
      <Grid container spacing={3}>
        {projects && projects.map((project, index) => (
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
                  완료된 콘텐츠 갯수: {project.completedContents}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  시작일: {project.startDate}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  종료일: {project.endDate}
                </Typography>
              </CardContent>
              <CardActions>
                <Button variant="outlined" onClick={() => openContentManageDialog(project)} startIcon={<EditIcon />}>
                  콘텐츠 관리
                </Button>
                <IconButton aria-label="delete" color="error">
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
      />

      {selectedProject && (
        <ContentManageDialog
          open={contentManageDialogOpen}
          onClose={closeContentManageDialog}
          project={selectedProject}
          setProjects={setProjects}
        />
      )}
    </Container>
  );
};

export default MainPage;
