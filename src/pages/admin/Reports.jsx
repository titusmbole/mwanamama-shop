import React, { useState, useEffect } from 'react';
import {
  BarChart3, TrendingUp, Download, Calendar, Filter,
  FileText, PieChart, Users, ShoppingCart, Package,
  DollarSign, Eye, RefreshCw, Mail, Share,
  ArrowUp, ArrowDown, Activity, Clock, Settings
} from 'lucide-react';

const Reports = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedReport, setSelectedReport] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const reportTypes = [
    { id: 'overview', name: 'Business Overview', icon: <BarChart3 size={20} />, count: '12 metrics' },
    { id: 'sales', name: 'Sales Reports', icon: <TrendingUp size={20} />, count: '8 reports' },
    { id: 'customers', name: 'Customer Analytics', icon: <Users size={20} />, count: '6 insights' },
    { id: 'products', name: 'Product Performance', icon: <Package size={20} />, count: '15 products' },
    { id: 'financial', name: 'Financial Reports', icon: <DollarSign size={20} />, count: '4 statements' }
  ];

  const keyMetrics = [
    { 
      title: 'Total Revenue', 
      value: 'KSh 2,450,000', 
      change: '+18.5%', 
      trend: 'up', 
      icon: <DollarSign size={24} />, 
      color: 'success',
      period: 'vs last month'
    },
    { 
      title: 'Orders Processed', 
      value: '1,847', 
      change: '+12.3%', 
      trend: 'up', 
      icon: <ShoppingCart size={24} />, 
      color: 'primary',
      period: 'this month'
    },
    { 
      title: 'Active Customers', 
      value: '892', 
      change: '+8.7%', 
      trend: 'up', 
      icon: <Users size={24} />, 
      color: 'info',
      period: 'active users'
    },
    { 
      title: 'Conversion Rate', 
      value: '3.4%', 
      change: '-2.1%', 
      trend: 'down', 
      icon: <Activity size={24} />, 
      color: 'warning',
      period: 'last 30 days'
    }
  ];

  const recentReports = [
    {
      name: 'Monthly Sales Summary',
      type: 'Sales Report',
      generated: '2 hours ago',
      size: '2.4 MB',
      format: 'PDF',
      status: 'ready',
      downloads: 24
    },
    {
      name: 'Customer Behavior Analysis',
      type: 'Analytics',
      generated: '6 hours ago',
      size: '1.8 MB',
      format: 'Excel',
      status: 'ready',
      downloads: 18
    },
    {
      name: 'Product Performance Q1',
      type: 'Product Report',
      generated: '1 day ago',
      size: '3.2 MB',
      format: 'PDF',
      status: 'ready',
      downloads: 42
    },
    {
      name: 'Financial Statement',
      type: 'Finance',
      generated: '2 days ago',
      size: '1.1 MB',
      format: 'PDF',
      status: 'ready',
      downloads: 15
    }
  ];

  const chartData = [
    { month: 'Jan', sales: 65000, orders: 245 },
    { month: 'Feb', sales: 59000, orders: 198 },
    { month: 'Mar', sales: 80000, orders: 312 },
    { month: 'Apr', sales: 81000, orders: 298 },
    { month: 'May', sales: 95000, orders: 356 },
    { month: 'Jun', sales: 105000, orders: 389 }
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const handleDownload = (reportName, format) => {
    // Simulate download
    console.log(`Downloading ${reportName} as ${format}`);
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{minHeight: '70vh'}}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="text-muted">Loading Reports...</h5>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Bootstrap CSS */}
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      
      <div className="min-vh-100" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
        <div className="container-fluid py-4">
          
          {/* Header */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                  <h1 className="display-5 fw-bold text-white mb-2">
                    <FileText className="me-3" size={32} />
                    Reports & Analytics
                  </h1>
                  <p className="text-white-50 mb-0">Generate insights and track your business performance</p>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <select 
                    value={selectedPeriod} 
                    onChange={(e) => setSelectedPeriod(e.target.value)} 
                    className="form-select form-select-sm bg-white bg-opacity-90"
                    style={{minWidth: '140px'}}
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                    <option value="1y">Last Year</option>
                  </select>
                  <button 
                    onClick={handleRefresh} 
                    className={`btn btn-light btn-sm ${refreshing ? 'disabled' : ''}`}
                    style={{minWidth: '44px', height: '38px'}}
                  >
                    <RefreshCw size={18} className={refreshing ? 'spinner-border spinner-border-sm' : ''} />
                  </button>
                  <button className="btn btn-success btn-sm">
                    <Download size={18} className="me-2" />
                    Export All
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Report Types Navigation */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card border-0 shadow-sm" style={{background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)'}}>
                <div className="card-body py-3">
                  <div className="row g-2">
                    {reportTypes.map((report) => (
                      <div key={report.id} className="col-lg-2 col-md-4 col-6">
                        <button
                          onClick={() => setSelectedReport(report.id)}
                          className={`btn w-100 d-flex flex-column align-items-center gap-2 py-3 ${selectedReport === report.id ? 'btn-primary' : 'btn-outline-secondary'}`}
                        >
                          {report.icon}
                          <div>
                            <div className="fw-medium small">{report.name}</div>
                            <small className="opacity-75">{report.count}</small>
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="row g-4 mb-4">
            {keyMetrics.map((metric, index) => (
              <div key={index} className="col-xl-3 col-lg-4 col-md-6">
                <div className="card border-0 shadow-sm h-100" style={{background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)'}}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className={`p-3 rounded-3 bg-${metric.color} bg-opacity-10`}>
                        <span className={`text-${metric.color}`}>{metric.icon}</span>
                      </div>
                      <div className={`badge ${metric.trend === 'up' ? 'bg-success' : 'bg-danger'} bg-opacity-10 ${metric.trend === 'up' ? 'text-success' : 'text-danger'} d-flex align-items-center gap-1`}>
                        {metric.trend === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                        {metric.change}
                      </div>
                    </div>
                    <h6 className="text-muted mb-2 fw-medium">{metric.title}</h6>
                    <h3 className="fw-bold mb-1 text-dark">{metric.value}</h3>
                    <small className="text-muted">{metric.period}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="row g-4 mb-4">
            
            {/* Charts Section */}
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm h-100" style={{background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)'}}>
                <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center py-3">
                  <h5 className="mb-0 fw-bold">
                    <BarChart3 className="me-2" size={20} />
                    Performance Overview
                  </h5>
                  <div className="btn-group" role="group">
                    <button className="btn btn-sm btn-outline-primary active">Sales</button>
                    <button className="btn btn-sm btn-outline-primary">Orders</button>
                    <button className="btn btn-sm btn-outline-primary">Traffic</button>
                  </div>
                </div>
                <div className="card-body">
                  {/* Simplified Chart Representation */}
                  <div className="row text-center mb-4">
                    {chartData.map((data, index) => (
                      <div key={index} className="col-2">
                        <div className="mb-2">
                          <div 
                            className="bg-primary rounded" 
                            style={{
                              height: `${(data.sales / 1000)}px`,
                              minHeight: '20px',
                              maxHeight: '100px',
                              margin: '0 auto',
                              width: '24px'
                            }}
                          ></div>
                        </div>
                        <small className="text-muted fw-medium">{data.month}</small>
                      </div>
                    ))}
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <div className="bg-primary rounded" style={{width: '12px', height: '12px'}}></div>
                        <span className="small">Sales Revenue</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <div className="bg-info rounded" style={{width: '12px', height: '12px'}}></div>
                        <span className="small">Order Count</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions & Tools */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm mb-4" style={{background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)'}}>
                <div className="card-header bg-transparent border-0 py-3">
                  <h5 className="mb-0 fw-bold">
                    <Settings className="me-2" size={20} />
                    Report Tools
                  </h5>
                </div>
                <div className="card-body">
                  <div className="d-grid gap-2">
                    <button className="btn btn-primary d-flex align-items-center justify-content-center gap-2">
                      <FileText size={18} />
                      Generate Custom Report
                    </button>
                    <button className="btn btn-outline-info d-flex align-items-center justify-content-center gap-2">
                      <Calendar size={18} />
                      Schedule Report
                    </button>
                    <button className="btn btn-outline-success d-flex align-items-center justify-content-center gap-2">
                      <Mail size={18} />
                      Email Reports
                    </button>
                    <button className="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2">
                      <Share size={18} />
                      Share Dashboard
                    </button>
                  </div>
                </div>
              </div>

              {/* Export Formats */}
              <div className="card border-0 shadow-sm" style={{background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)'}}>
                <div className="card-header bg-transparent border-0 py-3">
                  <h6 className="mb-0 fw-bold">Export Formats</h6>
                </div>
                <div className="card-body">
                  <div className="row g-2">
                    <div className="col-6">
                      <button className="btn btn-outline-danger w-100 btn-sm">PDF</button>
                    </div>
                    <div className="col-6">
                      <button className="btn btn-outline-success w-100 btn-sm">Excel</button>
                    </div>
                    <div className="col-6">
                      <button className="btn btn-outline-info w-100 btn-sm">CSV</button>
                    </div>
                    <div className="col-6">
                      <button className="btn btn-outline-warning w-100 btn-sm">JSON</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Reports */}
          <div className="row">
            <div className="col-12">
              <div className="card border-0 shadow-sm" style={{background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)'}}>
                <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center py-3">
                  <h5 className="mb-0 fw-bold">
                    <Clock className="me-2" size={20} />
                    Recent Reports
                  </h5>
                  <button className="btn btn-outline-primary btn-sm">
                    <Eye size={16} className="me-1" />
                    View All
                  </button>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="border-0 fw-semibold">Report Name</th>
                          <th className="border-0 fw-semibold">Type</th>
                          <th className="border-0 fw-semibold">Generated</th>
                          <th className="border-0 fw-semibold">Size</th>
                          <th className="border-0 fw-semibold">Downloads</th>
                          <th className="border-0 fw-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentReports.map((report, index) => (
                          <tr key={index}>
                            <td>
                              <div>
                                <div className="fw-semibold">{report.name}</div>
                                <small className="text-muted">{report.format} Format</small>
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-info bg-opacity-10 text-info">
                                {report.type}
                              </span>
                            </td>
                            <td className="text-muted">{report.generated}</td>
                            <td className="text-muted">{report.size}</td>
                            <td>
                              <span className="badge bg-success bg-opacity-10 text-success">
                                {report.downloads} downloads
                              </span>
                            </td>
                            <td>
                              <div className="btn-group" role="group">
                                <button 
                                  className="btn btn-sm btn-outline-primary" 
                                  title="Download"
                                  onClick={() => handleDownload(report.name, report.format)}
                                >
                                  <Download size={14} />
                                </button>
                                <button className="btn btn-sm btn-outline-secondary" title="View">
                                  <Eye size={14} />
                                </button>
                                <button className="btn btn-sm btn-outline-success" title="Share">
                                  <Share size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bootstrap Icons */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css" 
      />
      
      {/* Bootstrap JS */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
      
      {/* Custom Styles */}
      <style jsx>{`
        .card {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
        }
        
        .btn {
          transition: all 0.2s ease-in-out;
        }
        
        .btn:hover {
          transform: translateY(-1px);
        }
        
        .spinner-border-sm {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .badge {
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        @media (max-width: 768px) {
          .display-5 {
            font-size: 1.8rem;
          }
          
          .card-body {
            padding: 1rem;
          }
          
          .btn-group .btn {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </>
  );
};

export default Reports;