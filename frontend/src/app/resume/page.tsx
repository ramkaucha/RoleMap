'use client';

import PageWrapper from '@/components/PageWrapper';
import ResumeUploader from './components/ResumeUploader';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../config/pages';

export default function ResumePage() {
  const [resumeExists, setResumeExists] = useState(false);

  const fetchResume = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${BACKEND_URL}/applications/resume`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });

      if (response.status === 200) {
        setResumeExists(true);
      }
    } catch (err) {
      setResumeExists(false);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  return (
    <PageWrapper className="flex flex-col w-full">
      <h1 className="font-bold text-3xl mb-10">Resume</h1>
      <ResumeUploader />
      {resumeExists && (
        <div className="mt-4 text-blue-700 underline">
          <a
            href={`${BACKEND_URL}/applications/resume`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Download Current Resume
          </a>
        </div>
      )}
    </PageWrapper>
  );
}
