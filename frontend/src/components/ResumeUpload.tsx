import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Chip,
  Alert,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PdfIcon from '@mui/icons-material/PictureAsPdf';
import DocIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';

interface ResumeUploadProps {
  uploadedFiles: File[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({ 
  uploadedFiles, 
  setUploadedFiles 
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Filter only PDF and DOCX files
    const validFiles = acceptedFiles.filter(
      file => file.type === 'application/pdf' || 
              file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    
    setUploadedFiles(prev => [...prev, ...validFiles]);
  }, [setUploadedFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 5242880, // 5MB
  });

  const removeFile = (index: number) => {
    setUploadedFiles(prevFiles => 
      prevFiles.filter((_, i) => i !== index)
    );
  };

  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf') {
      return <PdfIcon color="error" />;
    } else {
      return <DocIcon color="primary" />;
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Upload Resumes
      </Typography>
      
      <Paper
        {...getRootProps()}
        variant="outlined"
        sx={{
          p: 3,
          mb: 3,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragActive ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'divider',
        }}
      >
        <input {...getInputProps()} />
        <UploadFileIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
        <Typography variant="h6" gutterBottom>
          {isDragActive ? 'Drop the files here...' : 'Drag & drop resume files here'}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Supported formats: PDF, DOCX (Max size: 5MB)
        </Typography>
      </Paper>

      {uploadedFiles.length > 0 && (
        <>
          <Typography variant="subtitle1" gutterBottom>
            Uploaded Files ({uploadedFiles.length})
          </Typography>
          
          <List>
            {uploadedFiles.map((file, index) => (
              <ListItem
                key={`${file.name}-${index}`}
                secondaryAction={
                  <Chip 
                    icon={<DeleteIcon />} 
                    label="Remove" 
                    size="small" 
                    onDelete={() => removeFile(index)}
                    color="secondary"
                    variant="outlined"
                  />
                }
              >
                <ListItemIcon>
                  {getFileIcon(file)}
                </ListItemIcon>
                <ListItemText 
                  primary={file.name} 
                  secondary={`${(file.size / 1024).toFixed(2)} KB`} 
                />
              </ListItem>
            ))}
          </List>
        </>
      )}

      {uploadedFiles.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Please upload at least one resume file to continue.
        </Alert>
      )}
    </Box>
  );
}; 