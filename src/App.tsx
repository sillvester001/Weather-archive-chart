import { useState, useEffect } from 'react';
import { fetchDataFromDB} from './utils';
import type { ItemData } from './types';
import Chart from './Chart';

function App() {
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [temperature, setTemperature] = useState<ItemData[]>([]);
  const [precipitation, setPrecipitation] = useState<ItemData[]>([]);
  const [yearRange, setYearRange] = useState<number[]>([1881, 2006]);
  const [temperatureChartVisible, setTemperatureChartVisible] = useState(true);

  useEffect(() => {
    async function fetchAllData() {
      const temperatureData = await fetchDataFromDB('temperature', yearRange);
      setTemperature(temperatureData);

      const precipitationData = await fetchDataFromDB('precipitation', yearRange);
      setPrecipitation(precipitationData);

      setLoading(false);
      setDataLoaded(true);

      // Populate the select options based on available data
      const startYearSelect = document.getElementById('startdate') as HTMLSelectElement;
      const endYearSelect = document.getElementById('enddate') as HTMLSelectElement;

      const startYear = temperature.length > 0 ? parseInt(temperature[0].t) : 1881;
      const endYear = temperature.length > 0 ? parseInt(temperature[temperature.length - 1].t) : 2006;

      for (let i = startYear; i <= endYear; i++) {
        const option = document.createElement('option');
        option.value = i.toString();
        option.text = i.toString();
        startYearSelect.add(option);
        endYearSelect.add(option.cloneNode(true) as HTMLOptionElement);
      }

      startYearSelect.value = yearRange[0].toString();
      endYearSelect.value = yearRange[1].toString();

    }

    fetchAllData();
  }, [yearRange]);

  const handleYearRangeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const startYear = parseInt((document.getElementById('startdate') as HTMLSelectElement).value);
    const endYear = parseInt((document.getElementById('enddate') as HTMLSelectElement).value);
    if (startYear > endYear) {
      alert('Start year must be less than or equal to end year');
      return;
    }
    setYearRange([startYear, endYear]);
  };

  return (
    <div className="main">
      {loading ? (
        <div className="loading-text">Loading...</div>
      ) : dataLoaded && (
        
        <>
          
          <div className="button-container">
          <h2>Weather Archive</h2>
            <button onClick={() => setTemperatureChartVisible(true)}>Temperature</button>
            <button onClick={() => setTemperatureChartVisible(false)}>Precipitation</button>
          </div>
          <div className="container">
            <div> 
              <label>Start date</label>
              <select id="startdate" value={yearRange[0]} onChange={handleYearRangeChange}></select>
              <label>End date</label>
              <select id="enddate" value={yearRange[1]} onChange={handleYearRangeChange}></select>
            </div>
            
            <div className="chart-canvas-container">
              {temperatureChartVisible && (
                <Chart data={temperature} title="Temperature" startYear={yearRange[0]} endYear={yearRange[1]} />
              )}
              {!temperatureChartVisible && (
                <Chart data={precipitation} title="Precipitation" startYear={yearRange[0]} endYear={yearRange[1]} />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;