import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import { Alert, Button, LoadingOverlay, Select, SelectItem, Transition, Title, Chip } from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { IconAlertCircleFilled } from '@tabler/icons-react';
import divisions from '../assets/divisions.json';

export default function Home() {
  const [url, setURL] = useInputState('');
  const [teams, setTeams] = useState<SelectItem[]>([]);
  const [team, setTeam] = useState<string | null>(null);
  const [alert, setAlert] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState('');

  async function onNext() {
    setLoading(true);
    const response = await fetch('/api/teams', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });

    const result = await response.json();
    if (result.status === 'success') {
      setTeams(result.teams);
    } else {
      setAlert(result.message);
    }
    setLoading(false);
  }

  function gotTeams() {
    return teams.length > 0;
  }

  useEffect(() => {
    if (alert) {
      setTimeout(() => {
        setAlert(null);
      }, 3000);
    }
  }, [alert]);

  async function onGenerate() {
    setLoading(true);
    const response = await fetch('/api/schedule', {
      method: 'POST',
      body: JSON.stringify({
        url,
        team,
      }),
    });
    const result = await response.json();
    if (result.message === 'success') {
      const { schedule } = result;
      const fileName = `Squash_League_Schedule_Division_${selectedDivision}_${team}.ics`;
      const data = new File([schedule], fileName);
      const icsFile = window.URL.createObjectURL(data);
      const downloadBtn = document.createElement('a');
      downloadBtn.href = icsFile;
      downloadBtn.download = fileName;
      downloadBtn.click();
      window.URL.revokeObjectURL(icsFile);
    } else {
      setAlert('Failed to generate iCal file');
    }
    setLoading(false);
  }

  function onSelectDivision({ url, division }: { url: string; division: string }) {
    setSelectedDivision(division);
    setURL('https://www.hksquash.org.hk' + url.replace('detail', 'results_schedules'));
  }

  function onReset() {
    setTeams([]);
    setURL('');
    setSelectedDivision('');
  }

  return (
    <>
      <Head>
        <title>2024-2025 Squash League Schedule Generator</title>
        <meta name='description' content='League Schedule Generator' />
        <meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={styles.main}>
        <LoadingOverlay visible={loading} overlayBlur={2} overlayColor={'black'} />
        <div className={styles.center}>
          <Title order={1} sx={{ margin: '20px' }}>
          2024-2025 Squash League Calendar Generator
          </Title>
          {!gotTeams() && (
            <div
              style={{
                display: 'flex',
                gap: '10px',
                margin: '10px 20px',
                flexWrap: 'wrap',
              }}
            >
              {divisions.map(({ division, url }) => (
                <Chip key={division} variant='filled' checked={division == selectedDivision} onClick={() => onSelectDivision({ url, division })}>
                  {division}
                </Chip>
              ))}
            </div>
          )}

          {gotTeams() && (
            <Select
              label='Team'
              placeholder='Pick one'
              data={teams}
              withAsterisk
              sx={{
                ['& .mantine-Select-label']: { color: 'white' },
                width: '250px',
                marginTop: '30px',
              }}
              onChange={setTeam}
            />
          )}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: gotTeams() ? '250px' : undefined,
            marginTop: '30px',
          }}>
            {gotTeams() && 
            <Button variant='default' onClick={onReset}>
              Back
            </Button>
            }
            <Button variant='gradient' gradient={{ from: 'indigo', to: 'cyan' }}  disabled={gotTeams() && !team} onClick={gotTeams() ? onGenerate : onNext}>
              {gotTeams() ? 'Generate' : 'Next'}
            </Button>

          </div>
        </div>
      </main>
      {!!alert && (
        <Transition mounted={!!alert} transition='slide-down' duration={1000} timingFunction='ease'>
          {(styles) => (
            <Alert icon={<IconAlertCircleFilled size={16} />} title='Error!' color='red' sx={{ position: 'absolute', right: 20, left: 20, top: 20 }}>
              {alert}
            </Alert>
          )}
        </Transition>
      )}
    </>
  );
}
