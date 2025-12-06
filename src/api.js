import axios from "axios";
import { saveAs } from "file-saver";

// src/api.js
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3001/api";
export default API_BASE;


// --- Candidates ---
export async function fetchCandidates() {
  const res = await axios.get(`${API_BASE}/candidates`);
  return res.data;
}

export async function registerCandidate(name, party) {
  const res = await axios.post(`${API_BASE}/candidates`, { name, party });
  return res.data;
}

// --- Voting ---
export async function castVote(voterId, candidateId) {
  const res = await axios.post(`${API_BASE}/vote`, { voterId, candidateId });
  return res.data;
}

// --- Admin / Ledger ---
export async function verifyLedger() {
  const res = await axios.get(`${API_BASE}/verify`);
  return res.data;
}

export async function getLastBlock() {
  const res = await axios.get(`${API_BASE}/last`);
  return res.data;
}

export async function fetchResults() {
  const res = await axios.get(`${API_BASE}/results`);
  return res.data;
}

export async function fetchBlocks() {
  const res = await axios.get(`${API_BASE}/blocks`);
  return res.data;
}

export async function downloadJSON() {
  const res = await axios.get(`${API_BASE}/export/json`, { responseType: "blob" });
  saveAs(res.data, "blockchain.json");
}

export async function downloadCSV() {
  const res = await axios.get(`${API_BASE}/export/csv`, { responseType: "blob" });
  saveAs(res.data, "blockchain.csv");
}

// --- Simple authentication ---
export async function verifyAdminPassword(password) {
  const res = await axios.post(`${API_BASE}/auth/admin`, { password });
  return res.data;
}

export async function verifyCandidatePassword(password) {
  const res = await axios.post(`${API_BASE}/auth/candidate`, { password });
  return res.data;
}
