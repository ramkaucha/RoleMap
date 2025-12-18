'use client';

import { BACKEND_URL } from '@/app/config/pages';
import axios, { AxiosProgressEvent } from 'axios';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

export default function ResumeUploader() {
  const [progress, setProgress] = useState(0);

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('access_token');
    try {
      await axios.post(`${BACKEND_URL}/applications/upload-resume`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (e: AxiosProgressEvent) => {
          if (e.total) {
            setProgress((e.loaded / e.total) * 100);
          }
        },
      });
      setTimeout(() => setProgress(0), 1000);
    } catch (err) {
      console.error(err);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className="border-4 border-dashed rounded-md p-11 text-center cursor-pointer relative font-bold text-xl"
    >
      <input {...getInputProps()} />
      {isDragActive ? 'Drop it here...' : 'Drag or click to upload your resume'}
      {progress > 0 && (
        <div
          className="absolute bottom-0 left-0 h-1 bg-blue-500"
          style={{ width: `${progress}%` }}
        />
      )}
    </div>
  );
}
