import { useEffect, useState, useRef } from "react";
import { getClaimReport } from "../../api/claimApi";
import {
  FiClipboard,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiDownload,
  FiFilter,
  FiCalendar,
  FiPieChart,
  FiBarChart2,
  FiTrendingUp,
} from "react-icons/fi";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const AdminClaimReportPage = () => {
  const reportRef = useRef(null);

  const [reportData, setReportData] = useState({
    totalClaims: 0,
    pendingClaims: 0,
    approvedClaims: 0,
    rejectedClaims: 0,
    recentClaims: [],
    claimsByMonth: [],
    claimsByCategory: [],
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await getClaimReport();
        // Process data for charts
        const processedData = processReportData(data);
        setReportData(processedData);
      } catch (error) {
        alert("Failed to load claim report");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  const processReportData = (data) => {
    // Process monthly claims from aggregation
    const claimsByMonth = (data.monthlyClaims || []).map((item) => ({
      month: `${item._id.year}-${String(item._id.month).padStart(2, "0")}`,
      count: item.count,
    }));

    // Process category claims from aggregation
    const claimsByCategory = (data.categoryClaims || []).map((item) => ({
      category: item._id || "Unknown",
      count: item.count,
    }));

    return {
      ...data,
      claimsByMonth,
      claimsByCategory,
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  const getClaimStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return styles.badgeGreen;
      case "pending":
        return styles.badgeOrange;
      case "rejected":
        return styles.badgeRed;
      default:
        return styles.badgeGray;
    }
  };

  const formatStatusText = (status) => {
    if (!status) return "Unknown";
    return status.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleExportCSV = () => {
    const filteredClaims = getFilteredClaims();
    const csvContent = [
      ["Claim ID", "Item Title", "Category", "Claimant", "Status", "Date"],
      ...filteredClaims.map((claim) => [
        claim._id,
        claim.itemId?.title || "N/A",
        claim.itemId?.category || "N/A",
        claim.fullName,
        claim.status,
        formatDate(claim.createdAt),
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `claim_report_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`claim_report_${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (error) {
      alert("Failed to generate PDF");
    }
  };

  const getFilteredClaims = () => {
    let filtered = reportData.recentClaims || [];

    if (statusFilter !== "all") {
      filtered = filtered.filter((claim) => claim.status === statusFilter);
    }

    if (dateRange.start) {
      filtered = filtered.filter(
        (claim) => new Date(claim.createdAt) >= new Date(dateRange.start)
      );
    }

    if (dateRange.end) {
      filtered = filtered.filter(
        (claim) => new Date(claim.createdAt) <= new Date(dateRange.end)
      );
    }

    return filtered;
  };

  const clearFilters = () => {
    setDateRange({ start: "", end: "" });
    setStatusFilter("all");
  };

  if (loading) {
    return <div style={styles.loading}>Loading claim report...</div>;
  }

  const filteredClaims = getFilteredClaims();
  const pieData = [
    { name: "Approved", value: reportData.approvedClaims, color: "#16a34a" },
    { name: "Pending", value: reportData.pendingClaims, color: "#f97316" },
    { name: "Rejected", value: reportData.rejectedClaims, color: "#dc2626" },
  ].filter((item) => item.value > 0);

  const statCards = [
    {
      label: "Total Claims",
      value: reportData.totalClaims,
      icon: <FiClipboard size={20} />,
      accent: "#f8fafc",
      iconColor: "#475569",
    },
    {
      label: "Pending Claims",
      value: reportData.pendingClaims,
      icon: <FiClock size={20} />,
      accent: "#fff7ed",
      iconColor: "#f97316",
    },
    {
      label: "Approved Claims",
      value: reportData.approvedClaims,
      icon: <FiCheckCircle size={20} />,
      accent: "#ecfdf5",
      iconColor: "#16a34a",
    },
    {
      label: "Rejected Claims",
      value: reportData.rejectedClaims,
      icon: <FiXCircle size={20} />,
      accent: "#fef2f2",
      iconColor: "#dc2626",
    },
  ];

  return (
    <div style={styles.page} ref={reportRef}>
      <div style={styles.header}>
        <h1 style={styles.title}>Claim Report</h1>
        <div style={styles.exportButtons}>
          <button style={styles.exportButton} onClick={handleExportCSV}>
            <FiDownload size={16} />
            Export CSV
          </button>
          <button style={{ ...styles.exportButton, backgroundColor: "#dc2626" }} onClick={handleExportPDF}>
            <FiDownload size={16} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === "overview" ? styles.activeTab : {}),
          }}
          onClick={() => setActiveTab("overview")}
        >
          <FiPieChart size={16} />
          Overview
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === "charts" ? styles.activeTab : {}),
          }}
          onClick={() => setActiveTab("charts")}
        >
          <FiBarChart2 size={16} />
          Charts
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === "details" ? styles.activeTab : {}),
          }}
          onClick={() => setActiveTab("details")}
        >
          <FiTrendingUp size={16} />
          Details
        </button>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        {statCards.map((card, index) => (
          <div key={index} style={{ ...styles.statCard, backgroundColor: card.accent }}>
            <div style={{ ...styles.statIcon, color: card.iconColor }}>
              {card.icon}
            </div>
            <div>
              <p style={styles.statValue}>{card.value}</p>
              <p style={styles.statLabel}>{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      {(activeTab === "overview" || activeTab === "charts") && (
        <div style={styles.chartsGrid}>
          {/* Status Distribution Pie Chart */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Status Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Trends Line Chart */}
          {reportData.claimsByMonth.length > 0 && (
            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>Monthly Trends</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={reportData.claimsByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={{ fill: "#f97316" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Category Distribution Bar Chart */}
          {reportData.claimsByCategory.length > 0 && (
            <div style={{ ...styles.chartCard, gridColumn: "span 2" }}>
              <h3 style={styles.chartTitle}>Claims by Category</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={reportData.claimsByCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      {(activeTab === "overview" || activeTab === "details") && (
        <div style={styles.filterSection}>
          <div style={styles.filterHeader}>
            <FiFilter size={18} />
            <span style={styles.filterTitle}>Filters</span>
          </div>
          <div style={styles.filterRow}>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>
                <FiCalendar size={14} /> Start Date
              </label>
              <input
                type="date"
                style={styles.filterInput}
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>
                <FiCalendar size={14} /> End Date
              </label>
              <input
                type="date"
                style={styles.filterInput}
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Status</label>
              <select
                style={styles.filterInput}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <button style={styles.clearButton} onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Claims Table */}
      {(activeTab === "overview" || activeTab === "details") && (
        <div style={styles.section}>
          <div style={styles.tableHeader}>
            <h2 style={styles.sectionTitle}>
              Claims ({filteredClaims.length} results)
            </h2>
          </div>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Item</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Claimant</th>
                  <th style={styles.th}>Student ID</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredClaims.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={styles.emptyCell}>
                      No claims found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredClaims.map((claim) => (
                    <tr key={claim._id}>
                      <td style={styles.td}>{claim.itemId?.title || "N/A"}</td>
                      <td style={styles.td}>{claim.itemId?.category || "N/A"}</td>
                      <td style={styles.td}>{claim.fullName}</td>
                      <td style={styles.td}>{claim.studentId || "N/A"}</td>
                      <td style={styles.td}>
                        <span style={getClaimStatusStyle(claim.status)}>
                          {formatStatusText(claim.status)}
                        </span>
                      </td>
                      <td style={styles.td}>{formatDate(claim.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: {
    padding: "24px",
    maxWidth: "1400px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "700",
    color: "#111827",
  },
  exportButtons: {
    display: "flex",
    gap: "12px",
  },
  exportButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    backgroundColor: "#f97316",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
  },
  tabs: {
    display: "flex",
    gap: "8px",
    marginBottom: "24px",
    borderBottom: "2px solid #e5e7eb",
    paddingBottom: "12px",
  },
  tab: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
    color: "#6b7280",
    transition: "all 0.2s",
  },
  activeTab: {
    backgroundColor: "#f97316",
    color: "white",
  },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
    marginBottom: "32px",
  },
  chartCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  chartTitle: {
    margin: "0 0 16px 0",
    fontSize: "16px",
    fontWeight: "600",
    color: "#374151",
  },
  filterSection: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  filterHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "16px",
    color: "#374151",
  },
  filterTitle: {
    fontWeight: "600",
    fontSize: "16px",
  },
  filterRow: {
    display: "flex",
    gap: "16px",
    alignItems: "flex-end",
    flexWrap: "wrap",
  },
  filterGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  filterLabel: {
    fontSize: "13px",
    color: "#6b7280",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  filterInput: {
    padding: "8px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "14px",
    minWidth: "150px",
  },
  clearButton: {
    padding: "8px 16px",
    backgroundColor: "#f3f4f6",
    color: "#374151",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
  },
  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  emptyCell: {
    padding: "40px",
    textAlign: "center",
    color: "#6b7280",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "16px",
    marginBottom: "32px",
  },
  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  statIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    fontSize: "24px",
  },
  statValue: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "700",
    color: "#111827",
  },
  statLabel: {
    margin: "4px 0 0 0",
    fontSize: "14px",
    color: "#6b7280",
  },
  section: {
    marginTop: "32px",
  },
  sectionTitle: {
    margin: "0 0 16px 0",
    fontSize: "20px",
    fontWeight: "600",
    color: "#111827",
  },
  tableContainer: {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    overflow: "hidden",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    padding: "12px 16px",
    textAlign: "left",
    fontWeight: "600",
    color: "#374151",
    borderBottom: "1px solid #e5e7eb",
    backgroundColor: "#f9fafb",
  },
  td: {
    padding: "12px 16px",
    borderBottom: "1px solid #e5e7eb",
  },
  badgeGreen: {
    padding: "4px 8px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "500",
    backgroundColor: "#ecfdf5",
    color: "#16a34a",
  },
  badgeOrange: {
    padding: "4px 8px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "500",
    backgroundColor: "#fff7ed",
    color: "#f97316",
  },
  badgeRed: {
    padding: "4px 8px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "500",
    backgroundColor: "#fef2f2",
    color: "#dc2626",
  },
  badgeGray: {
    padding: "4px 8px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "500",
    backgroundColor: "#f3f4f6",
    color: "#6b7280",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "200px",
    fontSize: "18px",
    color: "#6b7280",
  },
};

export default AdminClaimReportPage;