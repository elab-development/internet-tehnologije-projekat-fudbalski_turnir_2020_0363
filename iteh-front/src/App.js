// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import GuestLogin from "./Components/GuestLogin";
import PrivateRoute from "./Components/PrivateRout";
import Tournaments from "./Components/Tournaments";
import CreateTournament from "./Components/CreateTournament";
import AddTeams from "./Components/AddTeams";
import CreateNewTeam from "./Components/CreateNewTeam";
import Teams from "./Components/Teams"; 
import Players from "./Components/Players";
const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/guest" element={<GuestLogin />} />
         <Route path="/tournaments" element={
            <PrivateRoute>
            <Tournaments />
         </PrivateRoute>} />
         <Route path="/create-tournament" element={
             <PrivateRoute>
                <CreateTournament />
             </PrivateRoute>
            } />
          <Route path="/add-teams" element={
            <PrivateRoute>
                <AddTeams />
             </PrivateRoute>} />
          <Route path="/create-new-team" element={<PrivateRoute>
                <CreateNewTeam />
             </PrivateRoute>} />
             <Route path="/teams" element={
            <PrivateRoute>
            <Teams />
         </PrivateRoute>} /> 
          <Route path="/players" element={
            <PrivateRoute>
            <Players />
         </PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;