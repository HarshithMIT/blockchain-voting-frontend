import React, { useState, useEffect } from "react";
import { fetchCandidates, registerCandidate } from "../api";
import { verifyCandidatePassword } from "../api";
import Loader from "./Loader";


const Candidate = () => {
  const [candidates, setCandidates] = useState([]);
  const [name, setName] = useState("");
  const [party, setParty] = useState("");
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");


  // Load existing candidates on mount
  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
  setLoading(true);
  try {
    const data = await fetchCandidates();
    setCandidates(data);
  } catch (err) {
    console.error("❌ Error fetching candidates:", err);
  } finally {
    setLoading(false);
  }
};


  const handleRegister = async () => {
    if (!name || !party) {
      alert("Please fill all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await registerCandidate(name, party);
      alert("✅ Candidate registered successfully!");
      setName("");
      setParty("");
      await loadCandidates();
    } catch (err) {
      alert("❌ Failed to register candidate.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
  try {
    const res = await verifyCandidatePassword(password);
    if (res.success) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  } catch {
    setError("Incorrect password");
  }
};


  return (
    <>
    {!authenticated ? (
      <div className="card" style={{ maxWidth: "400px", margin: "2rem auto", textAlign: "center" }}>
        <h2 className="card-title">Candidate Access</h2>
        <p className="text-muted">Enter the candidate registration password:</p>
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
        <button className="btn btn-primary" onClick={handleLogin} >
          Login
        </button>
        {error && <p style={{ color: "#f87171", marginTop: "1rem" }}>{error}</p>}
      </div>
    ) : (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Register Candidate</h2>
      </div>
      <div className="form-group">
        <label>Candidate Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter candidate name"
        />
      </div>
      <div className="form-group">
        <label>Party Name</label>
        <input
          type="text"
          value={party}
          onChange={(e) => setParty(e.target.value)}
          placeholder="Enter party name"
        />
      </div>
      <button
        className="btn btn-primary"
        onClick={handleRegister}
        disabled={loading}
      >
        {loading ? <div className="spinner" style={{ width: 20, height: 20 }} /> : "Register Candidate"}
      </button>

      <div className="candidate-list">
        <h3>Registered Candidates</h3>
        {loading ? (
          <Loader type="skeleton" count={3} />
        ) : candidates.length === 0 ? (
          <p className="text-center text-muted">No candidates yet</p>
        ) : (
          candidates.map((c) => (
            <div key={c.candidateId} className="candidate-item">
              <div>
                <p className="candidate-name">{c.name}</p>
                <p className="candidate-party">{c.party}</p>
              </div>
              <span className="candidate-id">{c.candidateId}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )}
  </>
);
}

export default Candidate;
