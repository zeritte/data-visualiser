import { Chart } from 'react-google-charts';
import { useAppSelector } from '../../app/hooks';
import { selectRampsPerMaterial, selectRampsPerSize } from './mapSlice';

export function BarChart() {
  const rampDataPerMaterial = useAppSelector(selectRampsPerMaterial);
  const rampDataPerSize = useAppSelector(selectRampsPerSize);

  return (
    <>
      <Chart
        width={'500px'}
        height={'300px'}
        chartType="BarChart"
        loader={<div>Loading Chart</div>}
        data={[
          [
            'Element',
            'Count',
            { role: 'style' },
            {
              sourceColumn: 0,
              role: 'annotation',
              type: 'string',
              calc: 'stringify'
            }
          ],
          ...rampDataPerMaterial.map((i) => [i.name, i.count, null, null])
        ]}
        options={{
          title: 'Per material',
          width: 600,
          height: 400,
          bar: { groupWidth: '95%' },
          legend: { position: 'none' }
        }}
      />
      <Chart
        width={'500px'}
        height={'300px'}
        chartType="BarChart"
        loader={<div>Loading Chart</div>}
        data={[
          [
            'Element',
            'Count',
            { role: 'style' },
            {
              sourceColumn: 0,
              role: 'annotation',
              type: 'string',
              calc: 'stringify'
            }
          ],
          ...rampDataPerSize.map((i) => [i.size, i.count, null, null])
        ]}
        options={{
          title: 'Per material',
          width: 600,
          height: 400,
          bar: { groupWidth: '95%' },
          legend: { position: 'none' }
        }}
      />
    </>
  );
}
