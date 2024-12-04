'use client';
import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (showAlert) {
      alert('An error occurred while downloading the file. Please try again later.');
      setShowAlert(false);
    }
  }, [showAlert]);
  return (
    <div className='rounded-full bg-white px-4 py-2 flex text-black items-center' onClick={onClick} aria-label='Download'>
      <IoMdDownload />
    </div>
  );
}
