import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Payment from './PaymentTable'
import { UsersIcon, ChartBarIcon, ChartSpline, Files, UsersRound, FilterIcon } from 'lucide-react';
import accessibility from 'highcharts/modules/accessibility';
import { UserState } from '../../../context/UserContext';
import axios from 'axios';
import { notify } from '../../../Utiles/Notification';
import Loader from '../../../Utiles/Loader';

if (typeof Highcharts === 'object') {
  accessibility(Highcharts);
}
const AdminDashboard = () => {

  const { user } = UserState();
  const [loading, setLoading] = useState(false);
  const [cust, setCust] = useState()
  const [revenue, setRevanue] = useState()
  const [chartRevenue, setChartrevenue] = useState()
  const [months, setMonths] = useState()
  const [breakDown, setBreakdown] = useState()
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const [selectedPeriod, setSelectedPeriod] = useState('12months');
  const [pie, setPie] = useState([])
  const [stats, setStats] = useState({
    entrepreneur: 0,
    investor: 0,
    agent: 0
  });
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState({
    year: new Date().getFullYear(),
    month: null,
    week: null
  });

  const pieChartOptions = {
    chart: {
      type: 'pie',
      height: 200,
    },
    title: {
      text: null
    },
    plotOptions: {
      pie: {
        innerSize: '60%',
        colors: ['#4F46E5', '#86efac'],
        dataLabels: {
          enabled: false
        }
      }
    },
    series: [{
      name: 'Users',
      data: [
        ['Active', cust?.totalActiveUser],
        ['Inactive', cust?.totalinActiveUser]
      ]
    }],
    credits: {
      enabled: false
    }
  };

  const formatDateRange = (startDate) => {
    const start = new Date(startDate);

    const formatDate = (date) => {
      const month = date.toLocaleString("en-US", { month: "short" }); 
      return month.toUpperCase();
    };

    return `${formatDate(start)}`;
  }

  const chartOptions = {
    accessibility: {
      description: 'Financial overview chart showing document sales, subscription, and PPL/PPC revenue over time.',
      announceNewData: {
        announcementFormatter: function (allSeries, newSeries, newPoint) {
          if (newPoint) {
            return 'New point added: ' + newPoint.category + ', value ' + newPoint.y;
          }
          return false;
        }
      }
    },
    chart: {
      type: 'spline',
      height: 400,
      backgroundColor: 'transparent',
    },
    title: {
      text: null
    },
    xAxis: {
      categories: months,
      lineColor: '#E5E7EB',
      tickColor: '#E5E7EB',
      labels: {
        style: {
          color: '#6B7280',
          fontSize: '12px'
        }
      }
    },
    yAxis: {
      title: {
        text: null
      },
      labels: {
        formatter: function () {
          if (this.value >= 1000000) {
            return (this.value / 1000000) + 'M';
          } else if (this.value >= 1000) {
            return (this.value / 1000) + 'k';
          }
          return this.value;
        },
        style: {
          color: '#6B7280',
          fontSize: '12px'
        }
      },
      gridLineColor: '#E5E7EB',
      // tickPositions: [0, 50000, 100000, 500000, 10000, 50000]
    },
    legend: {
      enabled: false
    },
    credits: {
      enabled: false
    },
    tooltip: {
      shared: true,
      backgroundColor: 'white',
      borderColor: '#E5E7EB',
      borderRadius: 8,
      formatter: function () {
        let tooltipText = '<b>' + this.x + '</b><br/>';
        this.points.forEach(function (point) {
          tooltipText += '<span style="color:' + point.color + '">●</span> ' +
            point.series.name + ': $' +
            Highcharts.numberFormat(point.y, 0) + '<br/>';
        });
        return tooltipText;
      }
    },
    series: [{
      name: 'Legal',
      data: chartRevenue?.legal,
      color: '#7C3AED',
      marker: {
        enabled: false
      },
      dashStyle: 'ShortDash'
    }, {
      name: 'Subscription',
      data: chartRevenue?.subscription,
      color: '#EC4899',
      marker: {
        enabled: false
      },
      dashStyle: 'ShortDash'
    }, {
      name: 'Lead',
      data: chartRevenue?.lead,
      color: '#60A5FA',
      marker: {
        enabled: false
      },
      dashStyle: 'ShortDash'
    }, {
      name: 'Verification',
      data: chartRevenue?.verification,
      color: '#F97316',
      marker: {
        enabled: false
      },
      dashStyle: 'ShortDash'
    }, {
      name: 'Promotion',
      data: chartRevenue?.promotion,
      color: '#D946EF',
      marker: {
        enabled: false
      },
      dashStyle: 'ShortDash'
    }],
    plotOptions: {
      spline: {
        lineWidth: 2,
        states: {
          hover: {
            lineWidth: 3
          }
        }
      }
    }
  };


  const getCustdata = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/total_user_data`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (response?.data?.status) {
        setCust(response.data);
      }
    } catch (error) {
      notify("error", error.message);
    }
    setLoading(false);
  }

  const getRevenue = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/admin_revenu_data`, {},{
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (response?.data?.status) {
        setRevanue(response.data);

        const datas = Object.keys(response.data.monthly_revenue).reduce((acc, key) => {
          const revenues = response.data.monthly_revenue[key].map(item => item.total_revenue);
          acc[key] = revenues
          return acc
        }, {})

        setChartrevenue(datas)

        const month = response.data.monthly_revenue?.subscription.map(list =>
          formatDateRange(list.month)
        )

        console.log(month,'months');
        

        setMonths(month)
      }
    } catch (error) {
      notify("error", error.message);
    }
    setLoading(false);
  }

  const getBreakdown = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/admin_revenue_breakdown`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (response?.data?.status) {
        setBreakdown(response.data);
        const data = response.data?.percentage_breakdown.map(list => ({
          name:list.role,
          y:Number(list.percentage)
        }))
        setPie(data)
      }
    } catch (error) {
      notify("error", error.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    getBreakdown()
    getRevenue();
    getCustdata();
  }, [])

  const last30days = (ent, inv, age, all) => {
    const total = (ent + inv + age) / all * 100;
    return total ?? 0
  }

  const last30daysNew = (ent, inv, age) => {
    const total = (ent + inv + age);
    return total ?? 0
  }

  const optionss = {
    chart: {
      type: 'pie',
      custom: {},
      // events: {
      //   render() {
      //     const chart = this,
      //       series = chart.series[0];
      //     let customLabel = chart.options.chart.custom.label;

      //     if (!customLabel) {
      //       customLabel = chart.options.chart.custom.label =
      //         chart.renderer.label(
      //           'Total<br/>' +
      //           '<strong>2 877 820</strong>'
      //         )
      //           .css({
      //             color: '#000',
      //             textAnchor: 'middle'
      //           })
      //           .add();
      //     }

      //     const x = series.center[0] + chart.plotLeft,
      //       y = series.center[1] + chart.plotTop -
      //       (customLabel.attr('height') / 2);

      //     customLabel.attr({
      //       x,
      //       y
      //     });

      //     // Set font size based on chart diameter
      //     customLabel.css({
      //       fontSize: `${series.center[2] / 12}px`
      //     });
      //   }
      // }
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    title: {
      text: 'By User (Entrepreneurs, Investors, Agents)'
    },
    subtitle: {
      text: ''
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.0f}%</b>'
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      series: {
        allowPointSelect: true,
        cursor: 'pointer',
        borderRadius: 4,
        dataLabels: [{
          enabled: true,
          distance: 20,
          format: '{point.name}'
        }, {
          enabled: true,
          distance: -15,
          format: '{point.percentage:.0f}%',
          style: {
            fontSize: '0.9em'
          }
        }],
        showInLegend: true
      }
    },
    credits: {
      enabled: false
    },
    series: [{
      name: 'Registrations',
      colorByPoint: true,
      innerSize: '60%',
      data: pie
    }]
  };

  const getCustomerStats = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/getCustomerStats`, 
        filter,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      
      if (response?.data?.status) {
        setStats(response.data.data);
      }
    } catch (error) {
      notify("error", error.message || "Failed to fetch customer stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCustomerStats();
  }, [filter]);

  const getTotalSignups = () => {
    return stats.entrepreneur + stats.investor + stats.agent;
  };

  const getFilterLabel = () => {
    if (filter.week && filter.month && filter.year) {
      return `Week ${filter.week}, ${getMonthName(filter.month)} ${filter.year}`;
    } else if (filter.month && filter.year) {
      return `${getMonthName(filter.month)} ${filter.year}`;
    } else if (filter.year) {
      return `${filter.year}`;
    } else if (filter.week) {
      return `Week ${filter.week}`;
    } else {
      return "All Time";
    }
  };

  const getMonthName = (monthNumber) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[monthNumber - 1];
  };

  const handleFilterChange = (name, value) => {
    setFilter(prev => ({
      ...prev,
      [name]: value === "" ? null : parseInt(value)
    }));
  };

  const resetFilter = () => {
    setFilter({
      year: new Date().getFullYear(),
      month: null,
      week: null
    });
  };

  return (
    <>
      {loading && <Loader />}
      <h1 className="text-2xl container my-4 mx-auto font-semibold mb-6">Dashboard</h1>
      <div className="grid container mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-start justify-between">
            <div className='w-full'>
              <div className="flex items-center gap-2">
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <UsersIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <span className="text-gray-600">Total User</span>
              </div>
              <div className="mt-4 text-3xl font-semibold">{cust?.totalUser}</div>
              <div className="mt-4 space-y-2 ">
                <div className="flex justify-between">
                  <span className="text-gray-600">• Entrepreneurs</span>
                  <span>{cust?.Entcount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">• Investors</span>
                  <span>{cust?.Intcount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">• Agents</span>
                  <span>{cust?.Agecount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm relative">
      <div className="flex items-start justify-between">
        <div className="w-full">
          <div className="flex items-center gap-2">
            <div className="bg-green-100 p-3 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-gray-600">New Sign-ups</span>
            
            <div className="ml-auto relative">
              <button 
                onClick={() => setShowFilter(!showFilter)}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-indigo-600 border border-gray-200 rounded-md px-3 py-1 transition-colors"
              >
                <FilterIcon className="w-4 h-4" />
                <span>{getFilterLabel()}</span>
              </button>
              
              {showFilter && (
                <div className="absolute right-0 top-full mt-1 bg-white shadow-lg rounded-md p-4 z-20 border border-gray-200 w-64">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Year</label>
                      <select
                        className="w-full border border-gray-200 rounded-md px-2 py-1 text-sm"
                        value={filter.year || ""}
                        onChange={(e) => handleFilterChange("year", e.target.value)}
                      >
                        <option value="">Any</option>
                        {[2022, 2023, 2024, 2025].map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Month</label>
                      <select
                        className="w-full border border-gray-200 rounded-md px-2 py-1 text-sm"
                        value={filter.month || ""}
                        onChange={(e) => handleFilterChange("month", e.target.value)}
                      >
                        <option value="">Any</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                          <option key={month} value={month}>{getMonthName(month)}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Week</label>
                      <select
                        className="w-full border border-gray-200 rounded-md px-2 py-1 text-sm"
                        value={filter.week || ""}
                        onChange={(e) => handleFilterChange("week", e.target.value)}
                      >
                        <option value="">Any</option>
                        {Array.from({ length: 5 }, (_, i) => i + 1).map(week => (
                          <option key={week} value={week}>Week {week}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <button
                        onClick={resetFilter}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Reset
                      </button>
                      <button
                        onClick={() => setShowFilter(false)}
                        className="bg-indigo-600 text-white text-sm px-3 py-1 rounded-md hover:bg-indigo-700"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4 text-3xl font-semibold">
            {getTotalSignups()}
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Entrepreneurs</span>
              </div>
              <span className="font-medium">{stats.entrepreneur}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Investors</span>
              </div>
              <span className="font-medium">{stats.investor}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Agents</span>
              </div>
              <span className="font-medium">{stats.agent}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-600 mb-4">Active vs. Inactive Users</h3>
          <HighchartsReact highcharts={Highcharts} options={pieChartOptions} />
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
              <span className="text-sm text-gray-600">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-300"></div>
              <span className="text-sm text-gray-600">Inactive</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-start justify-between">
            <div className='w-full'>
              <div className="flex items-center gap-2">
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <ChartSpline className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-gray-600">Total Projects</span>
              </div>
              <div className="mt-4 text-3xl font-semibold">{cust?.totalProject}</div>
              <div className="mt-4 space-y-2 ">
                <div className="flex justify-between">
                  <span className="text-gray-600">• Active Project</span>
                  <span>{cust?.totalActiveProject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">• Private Project</span>
                  <span>{cust?.totalPrivateProject}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            <div className="bg-pink-100 p-3 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-pink-600" />
            </div>
            <span className="text-gray-600">Total Project Pitches</span>
          </div>
          <div className="mt-4 text-3xl font-semibold">1,250</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            <div className="bg-purple-100 p-3 rounded-lg">
              <ChartSpline className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-gray-600">Total Submitted Projects</span>
          </div>
          <div className="mt-4 text-3xl font-semibold">500</div>
        </div> */}

        {/* <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            <div className="bg-green-100 p-3 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-gray-600">Active Deal</span>
          </div>
          <div className="mt-4 text-3xl font-semibold">2,758</div>
        </div> */}

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <Files className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-gray-600">Legal documents shared</span>
          </div>
          <div className="mt-4 text-3xl font-semibold">{cust?.totalSharedDocument}</div>
        </div>

        {/* <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            <div className="bg-orange-100 p-3 rounded-lg">
              <UsersRound className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-gray-600">Mentorship sessions booked</span>
          </div>
          <div className="mt-4 text-3xl font-semibold">50</div>
        </div> */}
      </div>

      <h2 className="text-2xl container mx-auto px-4 md:px-0 font-semibold text-gray-900 my-6">Financial Overview</h2>
      <div className="bg-white container mx-auto px-4  rounded-2xl shadow-sm p-6">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center">
            <div>
              <div className="mt-2">
                <span className="text-gray-500">Total revenue</span>
                <div className="text-3xl font-semibold">${revenue?.overall_revenue}</div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                <span className="text-sm text-gray-600">Legal</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                <span className="text-sm text-gray-600">Subscription</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                <span className="text-sm text-gray-600">Lead</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-sm text-gray-600">Verification</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-fuchsia-600"></div>
                <span className="text-sm text-gray-600">Promotion</span>
              </div>
            </div>

            {/* <div className="flex space-x-2">
              <button
                className={`px-4 py-2 rounded-lg text-sm ${selectedPeriod === '7days'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
                onClick={() => setSelectedPeriod('7days')}
              >
                7 days
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm ${selectedPeriod === '30days'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
                onClick={() => setSelectedPeriod('30days')}
              >
                30 days
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm ${selectedPeriod === '12months'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
                onClick={() => setSelectedPeriod('12months')}
              >
                12 months
              </button>
            </div> */}
          </div>

          <div className="w-full">
            <HighchartsReact
              highcharts={Highcharts}
              options={chartOptions}
            />
          </div>
        </div>
      </div>
      <div className="grid container mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <HighchartsReact highcharts={Highcharts} options={optionss} />
        </div>
      </div>
      {/* <div className='my-6 container mx-auto rounded-2xl overflow-hidden'>
        <Payment />
      </div> */}
    </>
  );
};

export default AdminDashboard;