import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import {
  Alert,
  Button,
  LoadingOverlay,
  Select,
  Transition,
  Title,
  Chip,
  Text,
} from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { IconAlertCircleFilled } from '@tabler/icons-react';
import { Analytics } from '@vercel/analytics/react';
import mainDivisions from '../assets/divisions-main.json';
import masterDivisions from '../assets/divisions-master.json';
import ladiesDivisions from '../assets/divisions-ladies.json';
import { EventAttributes } from 'ics';

const divisions = [
  {
    title: 'Main',
    divisions: mainDivisions,
  },
  {
    title: 'Master',
    divisions: masterDivisions,
  },
  {
    title: 'Ladies',
    divisions: ladiesDivisions,
  },
];

export default function Home() {
  const [url, setURL] = useInputState('');
  const [teams, setTeams] = useState<string[]>([]);
  const [team, setTeam] = useState<string | null>(null);
  const [alert, setAlert] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState('');
  const [generatedSchedule, setGeneratedSchedule] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  function onSelectTeam(value: string | null) {
    setTeam(value);
    setGeneratedSchedule(null);
  }

  async function onNext() {
    console.log(`generating teams from ${url}`);
    setLoading(true);
    const response = await fetch('/api/teams', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });

    const result = await response.json();
    if (result.status === 'success') {
      console.log(`retrieved teams: ${result.teams}`);
      const teams = result.teams as string[];
      const sortedTeams = [...teams].sort((a, b) => a.localeCompare(b));
      setTeams(sortedTeams);
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
      setGeneratedSchedule(result);
      // const { schedule } = result;
      // const fileName = `Squash_League_Schedule_Division_${selectedDivision}_${team}.ics`;
      // const data = new File([schedule], fileName);
      // const icsFile = window.URL.createObjectURL(data);
      // const downloadBtn = document.createElement('a');
      // downloadBtn.href = icsFile;
      // downloadBtn.download = fileName;
      // downloadBtn.click();
      // window.URL.revokeObjectURL(icsFile);
    } else {
      setAlert('Failed to generate schedule');
    }
    setLoading(false);
  }

  function downloadSchedule() {
    if (!generatedSchedule) {
      setAlert('Failed to download schedule');
      return;
    }
    try {
      setIsDownloading(true);
      const fileName = `Squash_League_Schedule_Division_${selectedDivision}_${team}.ics`;
      const data = new File([generatedSchedule.schedule], fileName);
      const icsFile = window.URL.createObjectURL(data);
      const downloadBtn = document.createElement('a');
      downloadBtn.href = icsFile;
      downloadBtn.download = fileName;
      downloadBtn.click();
      window.URL.revokeObjectURL(icsFile);
    } catch (error) {
      console.log(error);
    } finally {
      setIsDownloading(false);
    }
  }

  function onSelectDivision({
    type,
    url,
    division,
  }: {
    type: string;
    url: string;
    division: string;
  }) {
    setSelectedDivision(`${type}_${division}`);
    setURL(
      'https://www.hksquash.org.hk' + url.replace('detail', 'results_schedules')
    );
  }

  function onReset() {
    setTeams([]);
    setURL('');
    setSelectedDivision('');
    setGeneratedSchedule(null);
    setTeam(null);
  }

  return (
    <>
      <Analytics />
      <Head>
        <title>2024-2025 Squash League Schedule Generator</title>
        <meta name="description" content="League Schedule Generator" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <LoadingOverlay
          visible={loading}
          overlayBlur={2}
          overlayColor={'black'}
          h={'100dvh'}
          pos={'fixed'}
        />
        <div
          className={styles.center}
          style={{
            maxWidth: '500px',
            margin: '0 auto',
          }}
        >
          <Title order={1} sx={{ margin: '20px' }}>
            2024-2025 Squash League Calendar Generator
          </Title>
          {!gotTeams() &&
            divisions.map(({ title, divisions }) => (
              <LeagueSelectDisplay
                key={title}
                title={title}
                divisions={divisions}
                selectedDivision={selectedDivision}
                onSelectDivision={onSelectDivision}
              />
            ))}

          {gotTeams() && (
            <Select
              label="Team"
              placeholder="Pick one"
              data={teams}
              withAsterisk
              sx={{
                ['& .mantine-Select-label']: { color: 'white' },
                width: '250px',
                marginTop: '30px',
              }}
              onChange={onSelectTeam}
            />
          )}

          {generatedSchedule != null && (
            <div
              style={{
                marginTop: '20px',
              }}
            >
              {generatedSchedule?.events.map(
                (item: EventAttributes, index: number) => {
                  const [year, month, day] = item.start;
                  const opponent = item.title?.split('vs')[1].trim();
                  return (
                    <div
                      style={{ marginBottom: '20px' }}
                      key={item.start.toString()}
                    >
                      <Text>
                        {`Week ${index + 1}`} - {`${day}/${month}/${year}`}
                      </Text>
                      <Text size={'md'} fw={700}>{`${opponent}`}</Text>
                      <Text td="underline">{item.location}</Text>
                    </div>
                  );
                }
              )}
            </div>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: gotTeams() ? '250px' : undefined,
              padding: '30px 0',
            }}
          >
            {gotTeams() && (
              <Button variant="default" onClick={onReset}>
                Back
              </Button>
            )}
            {generatedSchedule != null ? (
              <Button
                variant="gradient"
                gradient={{ from: 'indigo', to: 'cyan' }}
                loading={isDownloading}
                onClick={downloadSchedule}
              >
                Download
              </Button>
            ) : (
              <Button
                variant="gradient"
                gradient={{ from: 'indigo', to: 'cyan' }}
                disabled={gotTeams() && !team}
                onClick={gotTeams() ? onGenerate : onNext}
                sx={{ marginBottom: '40px' }}
              >
                {gotTeams() ? 'Generate' : 'Next'}
              </Button>
            )}
          </div>
        </div>
      </main>
      {!!alert && (
        <Transition
          mounted={!!alert}
          transition="slide-down"
          duration={1000}
          timingFunction="ease"
        >
          {(styles) => (
            <Alert
              icon={<IconAlertCircleFilled size={16} />}
              title="Error!"
              color="red"
              sx={{ position: 'absolute', right: 20, left: 20, top: 20 }}
            >
              {alert}
            </Alert>
          )}
        </Transition>
      )}
    </>
  );
}
function LeagueSelectDisplay({
  title,
  divisions,
  selectedDivision,
  onSelectDivision,
}: {
  title: string;
  divisions: { division: string; url: string }[];
  selectedDivision: string;
  onSelectDivision: ({
    type,
    url,
    division,
  }: {
    type: string;
    url: string;
    division: string;
  }) => void;
}) {
  const type = title.toLowerCase();
  return (
    <>
      <Title
        color="#1c7ed6"
        size={'h2'}
        sx={{ marginRight: 'auto', marginLeft: '20px' }}
      >
        {title}
      </Title>
      <div
        style={{
          display: 'flex',
          gap: '10px',
          margin: '10px 20px',
          flexWrap: 'wrap',
          alignSelf: 'flex-start',
          marginBottom: '40px',
        }}
      >
        {divisions.map(({ division, url }) => (
          <Chip
            key={division}
            variant="filled"
            checked={`${type}_${division}` == selectedDivision}
            onClick={() => onSelectDivision({ type, url, division })}
          >
            {division}
          </Chip>
        ))}
      </div>
    </>
  );
}
