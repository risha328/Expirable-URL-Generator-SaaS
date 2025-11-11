import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalLinks: 0,
        totalClicks: 0,
        activeLinks: 0
    });

    const [chartData, setChartData] = useState({
        labels: [],
        dailyClicks: [],
        activeUsers: []
    });

    const [loading, setLoading] = useState(true);
    const [chartLoading, setChartLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('7d');

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:5001/admin/dashboard/stats', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setStats({
                        totalUsers: data.totalUsers || 0,
                        totalLinks: data.totalLinks || 0,
                        totalClicks: data.totalClicks || 0,
                        activeLinks: data.activeLinks || 0
                    });
                } else {
                    console.error('Failed to fetch dashboard stats');
                    // Set default values if API fails
                    setStats({
                        totalUsers: 0,
                        totalLinks: 0,
                        totalClicks: 0,
                        activeLinks: 0
                    });
                }
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
                // Set default values if API fails
                setStats({
                    totalUsers: 0,
                    totalLinks: 0,
                    totalClicks: 0,
                    activeLinks: 0
                });
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    // Fetch chart data when timeRange changes
    useEffect(() => {
        const fetchChartData = async () => {
            setChartLoading(true);
            try {
                const response = await fetch(`http://localhost:5001/admin/dashboard/chart-data?timeRange=${timeRange}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setChartData({
                        labels: data.labels || [],
                        dailyClicks: data.dailyClicks || [],
                        activeUsers: data.activeUsers || []
                    });
                } else {
                    console.error('Failed to fetch chart data');
                    // Set default empty data if API fails
                    setChartData({
                        labels: [],
                        dailyClicks: [],
                        activeUsers: []
                    });
                }
            } catch (error) {
                console.error('Error fetching chart data:', error);
                // Set default empty data if API fails
                setChartData({
                    labels: [],
                    dailyClicks: [],
                    activeUsers: []
                });
            } finally {
                setChartLoading(false);
            }
        };

        fetchChartData();
    }, [timeRange]);

    // Generate fallback labels based on time range
    const generateFallbackLabels = (range) => {
        const now = new Date();
        const startDate = new Date();

        switch (range) {
            case '7d':
                startDate.setDate(now.getDate() - 7);
                const labels = [];
                for (let i = 0; i < 7; i++) {
                    const date = new Date(startDate);
                    date.setDate(startDate.getDate() + i);
                    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    labels.push(dayNames[date.getDay()]);
                }
                return labels;
            case '30d':
                return Array.from({length: 30}, (_, i) => `Day ${i + 1}`);
            case '90d':
                const weekLabels = [];
                for (let i = 0; i < 90; i++) {
                    const date = new Date(startDate);
                    date.setDate(startDate.getDate() + i);
                    const weekNum = Math.floor(i / 7) + 1;
                    const dayOfWeek = date.getDay();
                    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    weekLabels.push(`Week ${weekNum}.${dayNames[dayOfWeek]}`);
                }
                return weekLabels;
            default:
                return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        }
    };

    // Daily Clicks Data (Bar Chart)
    const dailyClicksData = {
        labels: chartData.labels.length > 0 ? chartData.labels : generateFallbackLabels(timeRange),
        datasets: [
            {
                label: 'Daily Clicks',
                data: chartData.dailyClicks.length > 0 ? chartData.dailyClicks : [0, 0, 0, 0, 0, 0, 0],
                backgroundColor: 'rgba(68, 136, 239, 0.8)',
                borderColor: 'rgba(68, 68, 239, 1)',
                borderWidth: 2,
                borderRadius: 6,
                borderSkipped: false,
            }
        ]
    };

    // Active Users Trend Data (Line Chart)
    const activeUsersData = {
        labels: chartData.labels.length > 0 ? chartData.labels : generateFallbackLabels(timeRange),
        datasets: [
            {
                label: 'Active Users',
                data: chartData.activeUsers.length > 0 ? chartData.activeUsers : [0, 0, 0, 0, 0, 0, 0],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgb(59, 130, 246)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            }
        ]
    };

    // Chart options
    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                    label: function(context) {
                        return `Clicks: ${context.parsed.y.toLocaleString()}`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    maxRotation: 45,
                    minRotation: 45
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                    callback: function(value) {
                        return value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value;
                    }
                }
            }
        }
    };

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: false
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    maxRotation: 45,
                    minRotation: 45
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            }
        }
    };

    const StatCard = ({ title, value, icon, change, changeType, linkTo }) => {
        const ChangeIcon = changeType === 'increase' ? 
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg> :
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>;

        const cardContent = (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                        <p className="text-3xl font-bold text-gray-900">
                            {loading ? (
                                <div className="h-8 bg-gray-200 rounded animate-pulse w-20"></div>
                            ) : (
                                new Intl.NumberFormat().format(value)
                            )}
                        </p>
                        {change && (
                            <div className={`flex items-center mt-2 text-sm ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                                {ChangeIcon}
                                <span className="ml-1 font-medium">{change}% from last period</span>
                            </div>
                        )}
                    </div>
                    <div className="p-3 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg">
                        {icon}
                    </div>
                </div>
            </div>
        );

        if (linkTo) {
            return (
                <Link to={linkTo} className="block hover:scale-105 transform transition-transform duration-200">
                    {cardContent}
                </Link>
            );
        }

        return cardContent;
    };

    const ChartCard = ({ title, chartType, data, options }) => {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                        {['7d', '30d', '90d'].map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
                                    timeRange === range 
                                        ? 'bg-white text-gray-900 shadow-sm' 
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="h-64">
                    {chartLoading ? (
                        <div className="h-full flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                        </div>
                    ) : chartType === 'bar' ? (
                        <Bar data={data} options={options} />
                    ) : (
                        <Line data={data} options={options} />
                    )}
                </div>
            </div>
        );
    };

    return (
        <AdminLayout>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
                <p className="text-gray-600">Welcome back! Here's what's happening with your platform today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                    }
                    change={12.5}
                    changeType="increase"
                    linkTo="/admin/users"
                />
                
                <StatCard
                    title="Total Links"
                    value={stats.totalLinks}
                    icon={
                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                    }
                    change={8.3}
                    changeType="increase"
                    linkTo="/admin/links"
                />
                
                <StatCard
                    title="Total Clicks"
                    value={stats.totalClicks}
                    icon={
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                        </svg>
                    }
                    change={23.7}
                    changeType="increase"
                />
                
                <StatCard
                    title="Active Links"
                    value={stats.activeLinks}
                    icon={
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    }
                    change={-2.1}
                    changeType="decrease"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <ChartCard
                    title="Daily Clicks"
                    chartType="bar"
                    data={dailyClicksData}
                    options={barChartOptions}
                />
                
                <ChartCard
                    title="Active Users Trend"
                    chartType="line"
                    data={activeUsersData}
                    options={lineChartOptions}
                />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        to="/admin/users"
                        className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors duration-200 group"
                    >
                        <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors duration-200">
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="font-medium text-gray-900">Manage Users</p>
                            <p className="text-sm text-gray-500">View and manage user accounts</p>
                        </div>
                    </Link>
                    
                    <Link
                        to="/admin/links"
                        className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors duration-200 group"
                    >
                        <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors duration-200">
                            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="font-medium text-gray-900">Manage Links</p>
                            <p className="text-sm text-gray-500">Monitor and manage shortened links</p>
                        </div>
                    </Link>
                    
                    <Link
                        to="/admin/analytics"
                        className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200 group"
                    >
                        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-200">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="font-medium text-gray-900">View Analytics</p>
                            <p className="text-sm text-gray-500">Detailed analytics and reports</p>
                        </div>
                    </Link>
                </div>
            </div>
        </AdminLayout>
    );
}