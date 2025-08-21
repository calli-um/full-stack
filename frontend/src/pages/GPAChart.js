import react, {useState, useEffect} from 'react';
import {Line} from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const GPAChart =()=>{
    const [data, setData] = useState([]);

    useEffect(()=>{
        fetch('http://localhost:8000/students/gpa-analytics/')
        .then(res=>res.json())
        .then(setData);
    },[])

    const chartData = {
        labels: data.map(item => `Sem ${item.semester}`),
        datasets:[{
            label: 'Avg GPA per semester',
            data: data.map(item=>item.avg_gpa),
            fill: false,
            tension: 0.1,
        }]
    };

     const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="gpa-chart" style={{ width: '500px', height: '300px' }}>
      <h3 style={{ textAlign: 'center', fontSize: '16px' }}>GPA Trend (Avg per semester)</h3>
      <div style={{ width: '100%', height: '100%' }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>

    );
};
export default GPAChart;