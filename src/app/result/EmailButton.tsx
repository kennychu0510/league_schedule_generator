'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { MdEmail } from 'react-icons/md';
import { IoIosSend } from 'react-icons/io';
import SendEmail from '@/services/send-email';
import { LeagueYear } from '@/constants';

export default function EmailButton({ division, team, schedule }: { division: string; team: string; schedule: string }) {
  const [email, setEmail] = useState('squashleaguehk@gmail.com');

  const [showAlert, setShowAlert] = useState<boolean | null>(null);
  function onSendEmail() {
    try {
      SendEmail({
        title: `Squash League Schedule for ${team} in ${division} ${LeagueYear}`,
        schedule,
        recipient: email.trim(),
      });
    } catch {
      setShowAlert(true);
    }
  }
  const isValid = email.includes('@') && !email.includes(' ');
  return (
    <div className='space-y-2'>
      <Dialog modal>
        <DialogTrigger>
          <Button className='rounded-full'>
            <MdEmail />
            Email
          </Button>
        </DialogTrigger>
        <DialogContent className='rounded-2xl'>
          <DialogHeader>
            <DialogTitle className='uppercase text-center mb-2'>Enter Your Email</DialogTitle>
          </DialogHeader>

          <DialogDescription className='mx-auto flex flex-col space-y-4 w-full'>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type='email' placeholder='Email' className='w-full flex rounded-full text-foreground' />
          </DialogDescription>
          <DialogFooter>
            <div className='italic text-center mt-2'>{showAlert === false ? 'Schedule Sent Successfully' : showAlert === true ? 'Failed to send email' : ''}</div>
            <Button disabled={!isValid} onClick={onSendEmail} className='w-fit mx-auto rounded-full'>
              <IoIosSend />
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
