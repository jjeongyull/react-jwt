import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, FormControlLabel, Checkbox, Button } from '@mui/material';

const ContentManageDialog = ({ open, onClose, project, setProjects }) => {
  const [completed, setCompleted] = useState(Array(project.contentCount).fill(false));
  const [completedNum, setCompletedNum] = useState(setProjects.complate_content ? setProjects.complate_content.split(',') : []);

  useEffect(() => {
    // 초기에 completed 배열 초기화 시, completedNum에 있는 값을 기준으로 체크 상태 설정
    const initialCompleted = Array(project.contentCount).fill(false);
    completedNum.forEach(num => {
      const index = parseInt(num, 10); // 문자열을 숫자로 변환
      if (index >= 0 && index < initialCompleted.length) {
        initialCompleted[index] = true;
      }
    });
    setCompleted(initialCompleted);
  }, [project.contentCount, completedNum]);

  const CheckboxChange = (index) => {
    const newCompleted = [...completed];
    newCompleted[index] = !newCompleted[index];
    setCompleted(newCompleted);

    let tempList = [...completedNum];
    if (newCompleted[index]) {
      tempList.push(index.toString()); // 문자열로 변환하여 추가
    } else {
      tempList = tempList.filter(item => item !== index.toString()); // 문자열로 변환하여 필터링
    }
    setCompletedNum(tempList);
  };

  const Complete = () => {
    // 완료 버튼 클릭 시 동작 구현
    // onUpdateProject 등을 이용하여 상위 컴포넌트로 상태 전달
    console.log("완료 버튼 클릭됨");
    console.log("체크된 콘텐츠:", completedNum);
    onClose(); // 다이얼로그 닫기
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{project.name} 콘텐츠 관리</DialogTitle>
      <DialogContent>
        <List>
          {Array.from({ length: project.contentCount }).map((_, index) => (
            <ListItem key={index}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={completed[index]}
                    onChange={() => CheckboxChange(index)}
                  />
                }
                label={`콘텐츠 ${index + 1}`}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button onClick={Complete}>완료</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContentManageDialog;
