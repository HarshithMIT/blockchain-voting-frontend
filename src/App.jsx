import React, { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Candidate from "./components/Candidate";
import Voter from "./components/Voter";
import Admin from "./components/Admin";
import { Blockchain } from "./blockchain/blockchain";

const App = () => {
  const [activeTab, setActiveTab] = useState("voter");
  const [candidates, setCandidates] = useState([]);
  const [votes, setVotes] = useState({});
  const blockchain = new Blockchain();

  return (
    <div className="app">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main>
        {activeTab === "candidate" && (
          <Candidate
            candidates={candidates}
            setCandidates={setCandidates}
            votes={votes}
            setVotes={setVotes}
          />
        )}
        {activeTab === "voter" && (
          <Voter
            candidates={candidates}
            blockchain={blockchain}
            votes={votes}
            setVotes={setVotes}
          />
        )}
        {activeTab === "admin" && (
          <Admin blockchain={blockchain} candidates={candidates} votes={votes} />
        )}
      </main>
    </div>
  );
};

export default App;
