'use client';

import React, { useState, DragEvent, ChangeEvent } from 'react';
import Papa from 'papaparse';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormValues } from '@/app/track/components/application-create-modal';

interface CSVReaderProps {
  onSubmitCSV: (data: Record<string, string>[]) => void;
}

// TODO: Add props here for handleSubmit/Handle Drop
export default function CSVReader({ onSubmitCSV }: CSVReaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === 'text/csv') {
      setFile(droppedFile);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile?.type === 'text/csv') {
      setFile(selectedFile);
    }
  };

  const handleSubmit = () => {
    if (!file) return;
    Papa.parse(file, {
      header: true,
      transformHeader: (header: string) =>
        header.trim().toLowerCase().replace(/\s+/g, '_'),
      skipEmptyLines: true,
      complete: (result: any) => {
        onSubmitCSV(result.data);
      },
      error: (error: any) => {
        console.error('Parsing error:', error);
      },
    });
  };

  return (
    <div className="flex flex-row space-x-5 items-center">
      <Input
        type="file"
        accept=".csv"
        onChange={handleChange}
        className="cursor-pointer file:cursor-pointer"
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
      />
      <Button
        onClick={handleSubmit}
        disabled={!file}
        className="px-3 h-7 text-sm"
      >
        Submit
      </Button>
    </div>
  );
}
