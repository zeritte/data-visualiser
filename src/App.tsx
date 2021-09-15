import logo from './logo.svg';
import './App.css';
import 'leaflet/dist/leaflet.css';
import { Counter } from './features/counter/Counter';
import { Map } from './features/map/Map';
import { BarChart } from './features/map/BarChart';

function App() {
  return (
    <>
      <BarChart />
      <Map />
    </>
  );
}

export default App;
