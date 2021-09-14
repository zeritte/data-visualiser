import { Chart } from 'react-google-charts';
import { useAppSelector } from '../../app/hooks';
import { selectRamps } from './mapSlice';

export function BarChart() {
  const rampData = useAppSelector(selectRamps);

  return (
    <Chart
      width={'500px'}
      height={'300px'}
      chartType="BarChart"
      loader={<div>Loading Chart</div>}
      data={[
        [
          'Element',
          'Density',
          { role: 'style' },
          {
            sourceColumn: 0,
            role: 'annotation',
            type: 'string',
            calc: 'stringify'
          }
        ]
      ]}
      options={{
        title: 'Per material',
        width: 600,
        height: 400,
        bar: { groupWidth: '95%' },
        legend: { position: 'none' }
      }}
    />
  );
}
