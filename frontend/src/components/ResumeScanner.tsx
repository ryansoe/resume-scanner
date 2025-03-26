import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  AppBar,
  Toolbar,
} from '@mui/material';
import { ResumeUpload } from './ResumeUpload';
import { JobDescriptionInput } from './JobDescriptionInput';
import { ResultsDisplay } from './ResultsDisplay';
import { api } from '../services/api';

const steps = ['Upload Resumes', 'Enter Job Description', 'Review Results'];

export const ResumeScanner: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadResponse, setUploadResponse] = useState<any[]>([]);
  const [jobDescription, setJobDescription] = useState('');
  const [results, setResults] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = async () => {
    if (activeStep === 0) {
      if (uploadedFiles.length === 0) {
        setError('Please upload at least one resume');
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const formData = new FormData();
        uploadedFiles.forEach(file => {
          formData.append('files', file);
        });
        
        const response = await api.post('/resumes/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        setUploadResponse(response.data);
        setIsLoading(false);
        setActiveStep(1);
      } catch (err) {
        setIsLoading(false);
        setError('Error uploading files. Please try again.');
        console.error(err);
      }
    } else if (activeStep === 1) {
      if (!jobDescription.trim()) {
        setError('Please enter a job description');
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await api.post('/resumes/analyze', {
          text: jobDescription,
        });
        
        setResults(response.data);
        setIsLoading(false);
        setActiveStep(2);
      } catch (err) {
        setIsLoading(false);
        setError('Error analyzing resumes. Please try again.');
        console.error(err);
      }
    }
  };

  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
    setError(null);
  };

  const handleReset = async () => {
    try {
      await api.delete('/resumes/clear');
      setActiveStep(0);
      setUploadedFiles([]);
      setUploadResponse([]);
      setJobDescription('');
      setResults(null);
      setError(null);
    } catch (err) {
      setError('Error clearing data. Please try again.');
      console.error(err);
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <ResumeUpload
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
          />
        );
      case 1:
        return (
          <JobDescriptionInput
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
          />
        );
      case 2:
        return <ResultsDisplay results={results} />;
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AI Resume Scanner
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container component="main" maxWidth="lg" sx={{ mb: 4 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Resume Scanner
          </Typography>
          
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {error && (
            <Typography color="error" align="center" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          
          {getStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            {activeStep !== 0 && (
              <Button 
                onClick={handleBack} 
                variant="outlined" 
                sx={{ mr: 1 }}
                disabled={isLoading}
              >
                Back
              </Button>
            )}
            
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleReset}
                color="primary"
                disabled={isLoading}
              >
                Start Over
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                color="primary"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Next'}
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}; 