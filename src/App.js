import "./App.css";

import React, { useState } from "react";
import { Grid, Paper } from "@mui/material";
import { BrowserRouter as Router, Navigate, Route, Routes, useNavigate } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserComments from "./components/UserComments";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";

const RequireAuth = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppContent = () => {
  const [advancedFeatures, setAdvancedFeatures] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [photoRefreshKey, setPhotoRefreshKey] = useState(0);
  const [listRefreshKey, setListRefreshKey] = useState(0);
  const navigate = useNavigate();

  const handleLogin = (user) => {
    setCurrentUser(user);
    navigate(`/users/${user._id}`);
  };

  const handleLogout = async () => {
    try {
      await fetch("/admin/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setCurrentUser(null);
      navigate("/login");
    }
  };

  const handleAddPhoto = async (file) => {
    if (!file || !currentUser) {
      return;
    }

    const formData = new FormData();
    formData.append("photo", file);

    const response = await fetch("/photos/new", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (response.ok) {
      setPhotoRefreshKey((value) => value + 1);
      setListRefreshKey((value) => value + 1);
      navigate(`/photos/${currentUser._id}`);
    }
  };

  const handleDataChanged = () => {
    setPhotoRefreshKey((value) => value + 1);
    setListRefreshKey((value) => value + 1);
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TopBar
            advancedFeatures={advancedFeatures}
            onAdvancedFeaturesChange={setAdvancedFeatures}
            currentUser={currentUser}
            onLogout={handleLogout}
            onAddPhoto={handleAddPhoto}
          />
        </Grid>
        <div className="main-topbar-buffer" />
        <Grid item sm={3}>
          <Paper className="main-grid-item">
            <UserList isLoggedIn={Boolean(currentUser)} refreshKey={listRefreshKey} />
          </Paper>
        </Grid>
        <Grid item sm={9}>
          <Paper className="main-grid-item">
            <Routes>
              <Route
                path="/"
                element={
                  <Navigate
                    to={currentUser ? `/users/${currentUser._id}` : "/login"}
                    replace
                  />
                }
              />
              <Route
                path="/login"
                element={<LoginRegister onLogin={handleLogin} />}
              />
              <Route
                path="/users/:userId"
                element={
                  <RequireAuth user={currentUser}>
                    <UserDetail />
                  </RequireAuth>
                }
              />
              <Route
                path="/photos/:userId"
                element={
                  <RequireAuth user={currentUser}>
                    <UserPhotos
                      advancedFeatures={advancedFeatures}
                      currentUser={currentUser}
                      refreshKey={photoRefreshKey}
                      onDataChanged={handleDataChanged}
                    />
                  </RequireAuth>
                }
              />
              <Route
                path="/photos/:userId/:photoId"
                element={
                  <RequireAuth user={currentUser}>
                    <UserPhotos
                      advancedFeatures={advancedFeatures}
                      currentUser={currentUser}
                      refreshKey={photoRefreshKey}
                      onDataChanged={handleDataChanged}
                    />
                  </RequireAuth>
                }
              />
              <Route
                path="/comments/:userId"
                element={
                  <RequireAuth user={currentUser}>
                    <UserComments />
                  </RequireAuth>
                }
              />
              <Route
                path="/users"
                element={
                  <RequireAuth user={currentUser}>
                    <UserList isLoggedIn={Boolean(currentUser)} refreshKey={listRefreshKey} />
                  </RequireAuth>
                }
              />
            </Routes>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
