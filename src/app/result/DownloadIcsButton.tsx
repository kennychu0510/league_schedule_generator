'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IoMdDownload } from 'react-icons/io';

export default function DownloadIcsButton({ division, team, schedule }: { division: string; team: string; schedule: string }) {
  const [showAlert, setShowAlert] = useState(false);
  function onClick() {
    try {
      setShowAlert(false);
      const fileName = `Squash_League_Schedule_Division_${division}_${team}.ics`;
      const data = new File([schedule], fileName);
      const icsFile = window.URL.createObjectURL(data);
      const downloadBtn = document.createElement('a');
      downloadBtn.href = icsFile;
      downloadBtn.download = fileName;
      downloadBtn.click();
      window.URL.revokeObjectURL(icsFile);
    } catch {
      setShowAlert(true);
    }
  }
  return (
    <div className='space-y-2'>
      <Button className='rounded-full' onClick={onClick} aria-label='Download'>
        <IoMdDownload />
        Download
      </Button>
      {showAlert && <p className='text-red-500'>Failed to download file</p>}
    </div>
  );
}
