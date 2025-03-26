import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Tabs,
  Tab,
  Chip,
  Divider,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

interface ResultsDisplayProps {
  results: any;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  const [selectedResumeIndex, setSelectedResumeIndex] = useState(0);
  
  if (!results || !results.resumes || results.resumes.length === 0) {
    return (
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          No results available
        </Typography>
        <Typography variant="body1">
          There was an error processing the resumes or no resumes were analyzed.
        </Typography>
      </Box>
    );
  }

  const resumes = results.resumes;
  const selectedResume = resumes[selectedResumeIndex];
  
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedResumeIndex(newValue);
  };

  const formatMatchScore = (score: number) => {
    return `${Math.round(score * 100)}%`;
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 0.8) return 'success';
    if (score >= 0.5) return 'warning';
    return 'error';
  };

  const renderSkillMatch = (skill: any) => {
    const { skill: skillName, in_resume, in_job_description, match_score } = skill;
    
    return (
      <ListItem key={skillName}>
        <ListItemText primary={skillName} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {in_resume ? (
            <Chip 
              size="small" 
              color="success" 
              icon={<CheckCircleIcon />} 
              label="In Resume" 
            />
          ) : (
            <Chip 
              size="small" 
              color="error" 
              icon={<CancelIcon />} 
              label="Missing" 
            />
          )}
          
          {in_job_description && (
            <Chip 
              size="small" 
              color="primary" 
              label="Required" 
            />
          )}
        </Box>
      </ListItem>
    );
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Resume Analysis Results
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs 
          value={selectedResumeIndex} 
          onChange={handleChangeTab} 
          variant="scrollable"
          scrollButtons="auto"
        >
          {resumes.map((resume: any, index: number) => (
            <Tab 
              key={resume.resume_id} 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>{index + 1}. {resume.filename}</span>
                  <Chip 
                    size="small"
                    color={getMatchScoreColor(resume.overall_match_score) as any}
                    label={formatMatchScore(resume.overall_match_score)}
                  />
                </Box>
              }
            />
          ))}
        </Tabs>
      </Box>
      
      {selectedResume && (
        <Box>
          <Card variant="outlined">
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <PersonIcon />
                </Avatar>
              }
              title={selectedResume.filename}
              subheader={`Match Score: ${formatMatchScore(selectedResume.overall_match_score)}`}
              action={
                <Box sx={{ width: 100, mr: 2, mt: 1 }}>
                  <CircularProgress 
                    variant="determinate" 
                    value={selectedResume.overall_match_score * 100} 
                    color={getMatchScoreColor(selectedResume.overall_match_score) as any}
                    size={40}
                  />
                </Box>
              }
            />
            <CardContent>
              <Typography variant="body1" paragraph>
                {selectedResume.feedback}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                <SentimentSatisfiedIcon color="success" sx={{ verticalAlign: 'middle', mr: 1 }} />
                Strengths
              </Typography>
              <List dense>
                {selectedResume.strengths.map((strength: string, index: number) => (
                  <ListItem key={index}>
                    <ListItemText primary={strength} />
                  </ListItem>
                ))}
              </List>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                <SentimentDissatisfiedIcon color="error" sx={{ verticalAlign: 'middle', mr: 1 }} />
                Areas for Improvement
              </Typography>
              <List dense>
                {selectedResume.improvement_areas.map((area: string, index: number) => (
                  <ListItem key={index}>
                    <ListItemText primary={area} />
                  </ListItem>
                ))}
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Skill Matching
              </Typography>
              <Box sx={{ mb: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={selectedResume.overall_match_score * 100}
                  color={getMatchScoreColor(selectedResume.overall_match_score) as any}
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>
              
              <Typography variant="subtitle2" gutterBottom>
                Required Skills in Job Description
              </Typography>
              <List>
                {selectedResume.skill_matches
                  .filter((skill: any) => skill.in_job_description)
                  .map(renderSkillMatch)}
              </List>
              
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                Additional Skills in Resume
              </Typography>
              <List>
                {selectedResume.skill_matches
                  .filter((skill: any) => !skill.in_job_description && skill.in_resume)
                  .map(renderSkillMatch)}
              </List>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
}; 