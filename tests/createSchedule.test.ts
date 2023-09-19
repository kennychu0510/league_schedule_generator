import createIcalFile from '@/helpers/createIcalFile';
import { getTeams } from '@/helpers/getTeams';
import axios from 'axios';
import { describe, it } from 'vitest';

const url = 'https://www.hksquash.org.hk/public/index.php/leagues/results_schedules/id/D00382/league/Squash/year/2023-2024/pages_id/25.html'

describe('div 4 kcc', () => {
  it('get all schedule', async() => {
    const { data } = await axios.get(url);
    const teams = await getTeams(data)
    const schedule = createIcalFile(data, 'Kowloon Cricket Club 4', url)
    
  })
})