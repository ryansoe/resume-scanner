import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Paper,
  Alert,
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';

interface JobDescriptionInputProps {
  jobDescription: string;
  setJobDescription: React.Dispatch<React.SetStateAction<string>>;
}

export const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({
  jobDescription,
  setJobDescription,
}) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Enter Job Description
      </Typography>
      
      <Alert severity="info" sx={{ mb: 2 }}>
        Paste the complete job description including required skills, qualifications, and responsibilities.
        This will be used to match against candidate resumes.
      </Alert>
      
      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <WorkIcon sx={{ color: 'primary.main', mr: 1 }} />
          <Typography variant="subtitle1">
            Job Details
          </Typography>
        </Box>
        
        <TextField
          label="Job Description"
          multiline
          fullWidth
          rows={12}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the complete job description here..."
          variant="outlined"
          sx={{ mb: 2 }}
        />
        
        <Typography variant="body2" color="textSecondary">
          The more detailed the job description, the better the candidate matching will be.
          Include required skills, technologies, experience levels, and qualifications.
        </Typography>
      </Paper>
      
      {jobDescription.length === 0 && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          Please enter a job description to continue.
        </Alert>
      )}
      
      {jobDescription.length > 0 && jobDescription.length < 100 && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          Your job description seems too short. For better results, please provide a more detailed description.
        </Alert>
      )}
    </Box>
  );
}; 