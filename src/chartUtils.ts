import type { ItemData } from './types';

/**
 * Calculates the average data for each year based on the provided data.
 * @param data - An array of ItemData objects containing the data.
 * @returns An object with keys representing years and values representing the average data for that year.
 */
export function calculateAverage(data: ItemData[]): {[year: string]: number} {
    const averageData: {[year: string]: {total: number; count: number}} = {};
    for (const entry of data) {
        const year = entry.t.substr(0, 4);
        if (!averageData[year]) {
            averageData[year] = {
                total: entry.v,
                count: 1
            };
        } else {
            averageData[year].total += entry.v;
            averageData[year].count += 1;
        }
    }

    const result: {[year: string]: number} = {};
    for (const year in averageData) {
        result[year] = averageData[year].total / averageData[year].count;
    }

    return result;
}

/**
 * Draws a chart based on the provided data.
 * @param data - An array of ItemData objects containing data.
 * @param title - The title of the chart.
 * @param startYear - The starting year of the chart.
 * @param endYear - The ending year of the chart.
 */
export function drawChart(data: ItemData[], title: string, startYear: number, endYear: number) {
    const filteredData = data.filter(entry => {
        const year = parseInt(entry.t.substr(0, 4));
        return year >= startYear && year <= endYear;
    });

    const averageData = calculateAverage(filteredData);
    const canvas = document.getElementById('chartCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    const years = Object.keys(averageData);
    const dataValues = Object.values(averageData);

    const minVal = Math.min(...dataValues);
    const maxVal = Math.max(...dataValues);
    const valRange = maxVal - minVal;

    const chartWidth = canvas.width - 100;
    const chartHeight = canvas.height - 100;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'black';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(title, 400, 20);

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';

    // Draw the X-axis and Y-axis
    ctx.beginPath();
    ctx.moveTo(50, 0);
    ctx.lineTo(50, chartHeight);
    ctx.lineTo(canvas.width, chartHeight);
    ctx.stroke()    

    ctx.font = 'normal 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Add x axis labels (years) if there are more than 40 years in the range to avoid overlapping labels use only every 10th year
    const yearCount = years.length;
    const yearStep = yearCount > 40 ? 10 : 2;

    for (let i = 0; i < years.length; i += yearStep) {
        const x = 50 + (i / (years.length - 1)) * chartWidth;
        const y = chartHeight + 20;

        ctx.fillText(years[i], x, y);
    }
    

    // Add y axis labels
    const labelCount = 10;

    for (let i = 0; i <= labelCount; i++) {
        const labelValue = minVal + (i / labelCount) * valRange;
        const x = 40;
        const y = chartHeight - (i / labelCount) * chartHeight + 6; // Adjusted position to center the labels

        ctx.fillText(labelValue.toFixed(1), x, y);
    }


    // Draw data points
    ctx.beginPath();
    for (let i = 0; i < years.length; i++) {
        const x = 50 + (i / (years.length - 1)) * chartWidth;
        const y = chartHeight - ((dataValues[i] - minVal) / valRange) * chartHeight;

        ctx.lineTo(x, y);
        ctx.arc(x, y, 2, 0, 2 * Math.PI);
    }
    ctx.strokeStyle = "blue";
    ctx.stroke();
}