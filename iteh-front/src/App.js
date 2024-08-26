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
import Bracket from "./Components/Bracket";
import Matches from "./Components/Matches";
import Favorites from "./Components/Favorites";
import PremierLeague from "./Components/PremierLeague";
import ShowMatches from "./Components/ShowMatches";
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
         <Route path="/bracket/:id" element={
            <PrivateRoute>
            <Bracket />
         </PrivateRoute>} />
          <Route path="/matches/:id" element={
            <PrivateRoute>
            <Matches />
         </PrivateRoute>} />
         <Route path="/favourite" element={
          <PrivateRoute>
          <Favorites />
       </PrivateRoute>} />
       <Route path="/premier-league" element={
             <PrivateRoute>
             <PremierLeague />
          </PrivateRoute>} />
          <Route path="/premier-league/matches" element={
          <PrivateRoute>
          <ShowMatches />
       </PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;