import React, { useEffect, useState, useRef } from "react";
import { verifyAdminPassword } from "../api";
import {
  fetchCandidates,
  fetchResults,
  verifyLedger,
  fetchBlocks,
  downloadJSON,
  downloadCSV,
} from "../api";
import { Chart, ArcElement, Tooltip, Legend, PieController } from "chart.js";

Chart.register(PieController, ArcElement, Tooltip, Legend);

const Admin = () => {
  const [candidates, setCandidates] = useState([]);
  const [results, setResults] = useState({});
  const [blocks, setBlocks] = useState([]);
  const [chainValid, setChainValid] = useState(true);
  const [loading, setLoading] = useState(true);
  const [expandedBlock, setExpandedBlock] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Button loaders
  const [csvLoading, setCsvLoading] = useState(false);
  const [jsonLoading, setJsonLoading] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);

  const chartRef = useRef(null);

  useEffect(() => {
    if (candidates.length > 0) drawChart();
    // eslint-disable-next-line
  }, [results, candidates]);

  // --- Auto-refresh dashboard every 10 seconds ---
useEffect(() => {
  if (!authenticated) return; // don't auto-refresh if not logged in

  const interval = setInterval(() => {
    loadData();
  }, 30000); // refresh every 10 seconds

  return () => clearInterval(interval); // cleanup on unmount
}, [authenticated]);


  const loadData = async () => {
    setLoading(true);
    try {
      const cand = await fetchCandidates();
      const res = await fetchResults();
      const verify = await verifyLedger();
      const blockData = await fetchBlocks();

      setCandidates(cand);
      setResults(res.counts || {});
      setChainValid(verify.valid);
      setBlocks(blockData);
    } catch (err) {
      console.error("❌ Error loading admin data:", err);
    } finally {
      setLoading(false);
      drawChart();
    }
  };

  const handleLogin = async () => {
    try {
      const res = await verifyAdminPassword(password);
      if (res.success) {
        setAuthenticated(true);
        setError("");
        loadData();
      } else {
        setError("Incorrect password");
      }
    } catch {
      setError("Incorrect password");
    }
  };

  const handleDownloadCSV = async () => {
    setCsvLoading(true);
    try {
      await downloadCSV();
    } finally {
      setCsvLoading(false);
    }
  };

  const handleDownloadJSON = async () => {
    setJsonLoading(true);
    try {
      await downloadJSON();
    } finally {
      setJsonLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshLoading(true);
    try {
      await loadData();
    } finally {
      setRefreshLoading(false);
    }
  };

  const drawChart = () => {
    const canvas = document.getElementById("voteChart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Destroy old chart safely if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const labels = candidates.map((c) => c.name);
    const data = candidates.map((c) => results[c.candidateId] || 0);

    chartRef.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: [
              "#60a5fa",
              "#34d399",
              "#fbbf24",
              "#f87171",
              "#a78bfa",
              "#f472b6",
              "#22d3ee",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#ffffff", // ✅ white font color
              font: {
                size: 14,
                family: "'Segoe UI', sans-serif",
              },
            },
          },
          tooltip: {
            titleColor: "#ffffff",
            bodyColor: "#ffffff",
            backgroundColor: "#27272a",
          },
        },
        elements: {
          arc: {
            borderColor: "#18181b",
          },
        },
        animation: {
            duration: 800,
            easing: "easeInOutQuart",
          },
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  };

  const toggleBlock = (id) => {
    setExpandedBlock(expandedBlock === id ? null : id);
  };

  return (
    <>
      {!authenticated ? (
        <div
          className="card"
          style={{
            maxWidth: "400px",
            margin: "2rem auto",
            textAlign: "center",
          }}
        >
          <h2 className="card-title">Admin Access</h2>
          <p className="text-muted">Enter admin password to continue:</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              border: "1px solid #3f3f46",
              width: "100%",
              marginBottom: "1rem",
              color: "#fff",
              backgroundColor: "#18181b",
            }}
          />
          <button className="btn btn-primary" onClick={handleLogin}>
            Login
          </button>
          {error && (
            <p style={{ color: "#f87171", marginTop: "1rem" }}>{error}</p>
          )}
        </div>
      ) : (
        <div className="card card-wide">
          <div className="card-header">
                            <p
                  className="text-muted"
                  style={{
                    fontSize: "0.8rem",
                    marginTop: "0.25rem",
                    textAlign: "right",
                    color: "#a1a1aa",
                  }}
                >
                  🔄 Live updates every 10 seconds
                </p>
            <h2 className="card-title">Admin Dashboard</h2>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                className="btn btn-secondary"
                onClick={handleDownloadCSV}
                disabled={csvLoading}
              >
                {csvLoading ? (
                  <div
                    className="spinner"
                    style={{ width: "20px", height: "20px" }}
                  ></div>
                ) : (
                  "Download CSV"
                )}
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleDownloadJSON}
                disabled={jsonLoading}
              >
                {jsonLoading ? (
                  <div
                    className="spinner"
                    style={{ width: "15px", height: "15px" }}
                  ></div>
                ) : (
                  "Download JSON"
                )}
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleRefresh}
                disabled={refreshLoading}
              >
                {refreshLoading ? (
                  <div
                    className="spinner"
                    style={{ width: "20px", height: "20px" }}
                  ></div>
                ) : (
                  "Refresh"
                )}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center">
              <div className="spinner"></div>
              <p className="text-muted">Loading dashboard data...</p>
            </div>
          ) : (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <p className="stat-label">Blockchain Validity</p>
                  <p
                    className={`stat-value ${
                      chainValid ? "validity-valid" : "validity-invalid"
                    }`}
                  >
                    {chainValid ? "✓ Valid" : "✗ Invalid"}
                  </p>
                </div>
                <div className="stat-card">
                  <p className="stat-label">Total Votes</p>
                  <p className="stat-value">
                    {Object.values(results).reduce((a, b) => a + b, 0)}
                  </p>
                </div>
              </div>

              <h3>Vote Distribution</h3>
              <div
                style={{
                  maxWidth: "400px",
                  height: "400px",
                  margin: "0 auto",
                }}
              >
                <canvas id="voteChart"></canvas>
              </div>

              <h3>Blockchain Explorer</h3>
              {blocks
                .slice()
                .reverse()
                .map((b) => (
                  <div key={b.blockId} className="block-item">
                    <div
                      className="block-header"
                      onClick={() => toggleBlock(b.blockId)}
                    >
                      <div>
                        <p className="candidate-name">Block #{b.blockId}</p>
                        <p className="candidate-party">
                          Candidate ID: {b.data?.candidateId || "N/A"}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: "0.75rem", color: "#a1a1aa" }}>
                          {new Date(b.timestamp).toLocaleString()}
                        </p>
                        <p style={{ fontSize: "0.75rem", color: "#71717a" }}>
                          {expandedBlock === b.blockId ? "▼" : "▶"} Details
                        </p>
                      </div>
                    </div>
                    {expandedBlock === b.blockId && (
                      <div className="block-details">
                        <pre>{JSON.stringify(b, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                ))}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Admin;
