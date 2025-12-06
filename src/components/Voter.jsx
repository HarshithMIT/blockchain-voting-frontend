import React, { useEffect, useState } from "react";
import { fetchCandidates, castVote } from "../api";
import Loader from "./Loader";

const Voter = () => {
  const [voterId, setVoterId] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- On component mount ---
  useEffect(() => {
    generateVoterId();
    loadCandidates();

    // ✅ Check localStorage for vote flag
    const voted = localStorage.getItem("hasVoted");
    if (voted === "true") {
      setHasVoted(true);
    }
  }, []);

  // --- Generate a random voter ID ---
  const generateVoterId = () => {
    setVoterId("V" + Math.random().toString(36).substr(2, 9).toUpperCase());
  };

  // --- Load candidates from backend ---
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


  // --- Submit vote ---
  const handleVote = async () => {
    if (!selectedCandidate) {
      alert("Please select a candidate!");
      return;
    }

    try {
      setLoading(true);
      await castVote(voterId, selectedCandidate);

      // ✅ Mark device as having voted
      localStorage.setItem("hasVoted", "true");
      setHasVoted(true);

      alert("✅ Vote recorded successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to record vote. Check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  // --- Main render ---
  return (
    <div className="card">
      {hasVoted ? (
        // 🟢 Already voted message
        <div className="text-center" style={{ padding: "2rem 0" }}>
          <p className="text-muted" style={{ fontSize: "1.2rem" }}>
            🗳️ You have already voted on this device.
          </p>
          <p style={{ fontSize: "0.9rem", color: "#a1a1aa" }}>
            Each device can only vote once to ensure fairness.
          </p>
        </div>
      ) : (
        // 🟡 Voting section
        <>
          <div className="card-header">
            <h2 className="card-title">Cast Your Vote</h2>
          </div>

          <div className="voter-id-box">
            <p className="voter-id-label">Your Voter ID</p>
            <p className="voter-id-value">{voterId}</p>
          </div>

          <h3>Select Candidate</h3>
          {loading ? (
            <Loader type="skeleton" count={4} />
          ) : candidates.length === 0 ? (
            <p className="text-muted">No candidates registered yet.</p>
          ) : (
            candidates.map((c) => (
              <div
                key={c.candidateId}
                className={`candidate-item selectable ${
                  selectedCandidate === c.candidateId ? "selected" : ""
                }`}
                onClick={() => setSelectedCandidate(c.candidateId)}
              >
                <div>
                  <p className="candidate-name">{c.name}</p>
                  <p className="candidate-party">{c.party}</p>
                </div>
              </div>
            ))
          )}
          <button
            className="btn btn-primary"
            onClick={handleVote}
            disabled={!selectedCandidate || loading}
          >
            {loading ? "Submitting..." : "Submit Vote"}
          </button>
        </>
      )}
    </div>
  );
};

export default Voter;
