import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import {
  Alert,
  Button,
  Input,
  LoadingOverlay,
  Select,
  SelectItem,
  Textarea,
  Transition,
  Text,
  Title,
} from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { IconAlertCircleFilled } from "@tabler/icons-react";
import * as ics from "ics";

export default function Home() {
  const [url, setURL] = useInputState("");
  const [teams, setTeams] = useState<SelectItem[]>([]);
  const [team, setTeam] = useState<string | null>(null);
  const [alert, setAlert] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onNext() {
    setLoading(true)
    const response = await fetch("/api/teams", {
      method: "POST",
      body: JSON.stringify({ url }),
    });

    const result = await response.json();
    if (result.status === "success") {
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
    setLoading(true)
    const response = await fetch("/api/schedule", {
      method: "POST",
      body: JSON.stringify({
        url,
        team,
      }),
    });
    const result = await response.json();
    if (result.message === "success") {
      const { schedule } = result;
      const data = new File([schedule], "league_schedule.ics");
      const icsFile = window.URL.createObjectURL(data);
      const downloadBtn = document.createElement("a");
      downloadBtn.href = icsFile;
      downloadBtn.download = "league_schedule.ics";
      downloadBtn.click();
      window.URL.revokeObjectURL(icsFile)
    } else {
      setAlert('Failed to generate iCal file')
    }
    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>League Schedule Generator</title>
        <meta name="description" content="League Schedule Generator" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <LoadingOverlay visible={loading} overlayBlur={2} overlayColor={"black"} />
        <div className={styles.center}>
          <Title order={1} sx={{ margin: '20px'}}>League Schedule to iCalendar Generator</Title>
          <Textarea
            placeholder="URL of Schedule and Results of your division in Hong Kong Squash website"
            label="URL"
            withAsterisk
            onChange={setURL}
            value={url}
            minRows={4}
            sx={{ ["& .mantine-Textarea-label"]: { color: "white" }, width: "250px" }}
          />

          {teams.length > 0 && (
            <Select
              label="Team"
              placeholder="Pick one"
              data={teams}
              withAsterisk
              sx={{
                ["& .mantine-Select-label"]: { color: "white" },
                width: "250px",
                marginTop: "30px",
              }}
              onChange={setTeam}
            />
          )}

          <Button
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan" }}
            sx={{ marginTop: "20px" }}
            disabled={gotTeams() && !team}
            onClick={gotTeams() ? onGenerate : onNext}
          >
            {gotTeams() ? "Generate" : "Next"}
          </Button>
        </div>
      </main>
      {!!alert && (
        <Transition mounted={!!alert} transition="slide-down" duration={1000} timingFunction="ease">
          {(styles) => (
            <Alert
              icon={<IconAlertCircleFilled size={16} />}
              title="Error!"
              color="red"
              sx={{ position: "absolute", right: 20, left: 20, top: 20 }}
            >
              {alert}
            </Alert>
          )}
        </Transition>
      )}
    </>
  );
}
