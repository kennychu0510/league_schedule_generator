'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { MdEmail } from 'react-icons/md';
import { IoIosSend } from 'react-icons/io';
import SendEmail from '@/services/send-email';
import { cn } from '@/lib/utils';
import Spinner from '../my-components/Spinner';

export default function EmailButton({ division, team, schedule }: { division: string; team: string; schedule: string }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [showAlert, setShowAlert] = useState<boolean | null>(null);
  async function onSendEmail() {
    try {
      setIsLoading(true);

      const result = await SendEmail({
        title: `Squash League Schedule for ${team} in ${division}`,
        schedule,
        recipient: email.trim(),
      });
      if (result.status === 'success') {
        setShowAlert(false);
      } else {
        setShowAlert(true);
      }
    } catch {
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  }
  const isValid = email.includes('@') && !email.includes(' ');

  useEffect(() => {
    setShowAlert(null);
  }, [email]);
  return (
    <Dialog modal>
      <DialogTrigger>
        <div className='rounded-full bg-white px-4 py-2 flex text-black items-center'>
          <MdEmail className='' />
        </div>
      </DialogTrigger>
      <DialogContent className='rounded-2xl'>
        <DialogHeader>
          <DialogTitle className='uppercase text-center mb-2'>Enter Your Email</DialogTitle>
        </DialogHeader>

        <DialogDescription className='mx-auto flex flex-col space-y-4 w-full'>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} type='email' placeholder='Email' className='w-full flex rounded-full text-foreground' />
        </DialogDescription>
        <DialogFooter>
          <div className='flex flex-col space-y-2 w-full'>
            <div className={cn('italic text-center', showAlert === false ? 'text-green-500' : showAlert === true ? 'text-red-500' : '')}>
              {showAlert === false ? 'Schedule Sent Successfully' : showAlert === true ? 'Failed to send email' : ''}
            </div>
            <div className='flex justify-center w-full'>
              <Button disabled={!isValid || isLoading} onClick={onSendEmail} className='w-fit mx-auto rounded-full'>
                {isLoading ? <Spinner classes='size-4 border-2' /> : <IoIosSend />}
                Send
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
