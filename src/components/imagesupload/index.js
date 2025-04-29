import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addWatermarkToImageAction } from '@/store/slices/authSlice';
import { setUploadProgress, clearUploadProgress, setError, clearError } from '@/store/slices/authSlice'; // Update the import path

const ImageUpload = () => {
const dispatch=useDispatch()
const [uploadProgress, setUploadProgress] = useState(0);
const [images, setImages] = useState([]);
const [acceptedFiles, setAcceptedFiles] = useState([]);
const [downloadUrl, setDownloadUrl] = useState('');

const updateUploadProgress = (percentage) => {
  setUploadProgress(percentage);
};

const onDrop = (files) => {
  if (files.length !== 2) {
    alert('Please select exactly two images.');
    return;
  }
  setImages(files);
  setAcceptedFiles(files);
};

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
    maxFiles: 2,
  });

  const handleUpload = async () => {
    dispatch(clearError());
    dispatch(clearUploadProgress());

    // Check if exactly two images are selected
    if (acceptedFiles.length !== 2) {
      dispatch(setError('Please select exactly two images.'));
      return;
    }
    

    dispatch(addWatermarkToImageAction(images, updateUploadProgress))


    
    setUploadProgress(0); // Reset progress after completion
    

 
  };

  return (
    <div>
      <div {...getRootProps()} style={dropzoneStyles}>
        <input {...getInputProps()} />
        <p>Drag & drop two images here, or click to select files</p>
      </div>
      <div>
        {images.map((file, index) => (
          <div key={index}>
            <p>Image {index + 1}</p>
            <img src={URL.createObjectURL(file)} alt={`Image ${index + 1}`} style={imageStyles} />
          </div>
        ))}
      </div>
      <div>
        <progress value={uploadProgress} max="100" />
        <span>{uploadProgress}%</span>
      </div>
      <button onClick={handleUpload}>Upload and Process</button>
    </div>
  );
};

const dropzoneStyles = {
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
};

const imageStyles = {
  maxWidth: '100%',
  maxHeight: '200px',
};

export default ImageUpload;




