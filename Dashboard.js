import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import axios from 'axios';
import './Dashboard.css';

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [counts, setCounts] = useState({
    newTickets: 0,
    closedToday: 0,
    newReplies: 0,
    followers: 0,
    earnings: 0,
    products: 0,
  });

  useEffect(() => {
    // Fetch the data for the counts
    const fetchCounts = async () => {
      try {
        const countsResponse = await axios.get('/api/dashboard/counts');
        setCounts(countsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchCounts();
  }, []);

  useEffect(() => {
    // Function to animate numbers
    const animateNumbers = (targetValue, setState) => {
      let count = 0;
      const step = Math.ceil(targetValue / 80); // Adjust the step to speed up the animation
      const interval = setInterval(() => {
        if (count < targetValue) {
          count += step;
          if (count > targetValue) count = targetValue; // Ensure count does not exceed targetValue
          setState(count);
        } else {
          clearInterval(interval);
        }
      }, 30); // Reduced interval timing for faster animation
    };

    // Animate numbers for each count
    animateNumbers(10, (value) => setCounts(prevCounts => ({ ...prevCounts, newTickets: value })));
    animateNumbers(100, (value) => setCounts(prevCounts => ({ ...prevCounts, closedToday: value })));
    animateNumbers(20, (value) => setCounts(prevCounts => ({ ...prevCounts, newReplies: value })));
    animateNumbers(50, (value) => setCounts(prevCounts => ({ ...prevCounts, followers: value })));
  }, []); // Empty dependency array ensures this runs once on component mount

  // Data for Pie chart (Sector distribution, replace with your sector data)
  const pieData = {
    labels: ['Research', 'IPR', 'Innovation', 'Startups', 'Support'],
    datasets: [
      {
        data: [40, 30, 20, 50, 10],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  // Data for Line chart (Activity)
  const lineData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Overall dashboard',
        data: [12, 19, 3, 5, 2, 3, 9],
        fill: false,
        borderColor: '#36A2EB',
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      
      {/* Stats cards section */}
      <div className="stats-cards">
        <div className="card">
          <h2>{counts.newTickets >= 10 ? '10+' : counts.newTickets}</h2>
          <p>Start-Ups</p>
        </div>
        <div className="card">
          <h2>{counts.closedToday >= 100 ? '100+' : counts.closedToday}</h2>
          <p>Researches</p>
        </div>
        <div className="card">
          <h2>{counts.newReplies >= 20 ? '20+' : counts.newReplies}</h2>
          <p>Innovations</p>
        </div>
        <div className="card">
          <h2>{counts.followers >= 50 ? '50+' : counts.followers}</h2>
          <p>IPR</p>
        </div>
      </div>

      {/* Activity chart section */}
      <div className="activity-section">
        <h2>Development Activity</h2>
        <Line data={lineData} />
      </div>

      {/* Charts section */}
      <div className="charts-section">
        <div className="chart-card">
          <h2>Sector Distribution</h2>
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
