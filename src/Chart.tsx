// Chart.tsx
import React from 'react';
import { drawChart} from './chartUtils';
import type { ItemData } from './types';

/**
 * Props for the Chart component.
 * @interface
 */
interface ChartProps {
    data: ItemData[];
    title: string;
    startYear: number;
    endYear: number;
}

/**
 * Renders a chart using the given data, title, start year, and end year.
 * @param {Object[]} data - The data to be used for the chart.
 * @param {string} title - The title of the chart.
 * @param {number} startYear - The starting year of the chart.
 * @param {number} endYear - The ending year of the chart.
 * @returns {JSX.Element} A canvas element containing the rendered chart.
 */
const Chart: React.FC<ChartProps> = ({ data, title, startYear, endYear }) => {
    React.useEffect(() => {
        drawChart(data, title, startYear, endYear);
    }, [data, title, startYear, endYear]);

    return <canvas id="chartCanvas" width={800} height={450}></canvas>;
};

export default Chart;
