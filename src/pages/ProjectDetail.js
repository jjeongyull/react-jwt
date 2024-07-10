import React, { useState, useEffect } from 'react';
import { Button, List, ListItem, ListItemButton, ListItemText, Grid, Paper, Typography, CircularProgress } from '@mui/material';
import ContentDialog from '../components/ContentDialog';
import postApi from '../utils/api';
import { useParams } from 'react-router-dom';

const ProjectDetail = ({ selectProjectName }) => {
  const [contents, setContents] = useState([]);
  const [openState, setOpenState] = useState(false);
  const { id } = useParams();

  const open = () => {
    setOpenState(true);
  };

  const Close = () => {
    setOpenState(false);
  };

  const Complete = async (index) => {
    const data = {
      cmd: 'complate_content',
      idx: index,
      projectIdx: id
    }
    try {
      const result = await postApi(data);
      if (result.success) {
        alert('콘텐츠 완료처리가 완료되었습니다.');
        setContents(result.contentList);
        Close();
      } else {
        alert(result.error || '콘텐츠 완료처리에 오류가 발생하였습니다.');
      }
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  const loadContent = async () => {
    try {
      const response = await postApi({ cmd: 'load_content', projectIdx: id });
      if (response.success) {
        setContents(response.project);
      } else {
        setContents([]);
      }
    } catch (error) {
      console.error('토큰 에러:', error);
    }
  }

  useEffect(() => {
    if (id) {
      loadContent();
    }
  }, [id]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h4">{selectProjectName}</Typography>
          <Button variant="contained" color="primary" onClick={open} style={{ marginTop: '10px' }}>콘텐츠 등록</Button>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
          {contents.length !== 0 ? (
            <List>
              {contents.map((content, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton>
                    <ListItemText primary={content.contentName} />
                    {Number(content.complate) !== 1 ? (
                      <Button
                        variant="contained"
                        onClick={() => Complete(content.idx)}
                        color="primary"
                        style={{ marginLeft: '10px', minWidth: '120px' }}
                      >
                        완료 처리
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        disabled
                        color="primary"
                        style={{ marginLeft: '10px', minWidth: '120px' }}
                      >
                        완료 됨
                      </Button>
                    )}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1">콘텐츠를 등록하세요.</Typography>
          )}
        </Paper>
      </Grid>
      <ContentDialog open={openState} Close={Close} setContents={setContents} />
    </Grid>
  );
};

export default ProjectDetail;
