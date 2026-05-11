import './App.css';

import React, { useEffect, useState } from "react";
import { Grid, Paper } from "@mui/material";
import { BrowserRouter as Router, Navigate, Route, Routes, useNavigate } from "react-router-dom";

import LoginRegister from "./components/LoginRegister";
import TopBar from "./components/TopBar";
import UserComments from "./components/UserComments";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "";

function AppContent() {
  const navigate = useNavigate();
  const [advancedFeatures, setAdvancedFeatures] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [listRefreshKey, setListRefreshKey] = useState(0);
  const [photoRefreshKey, setPhotoRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const token = localStorage.getItem("authToken");
    if (!token) {
      setAuthChecked(true);
      return;
    }

    fetch(`${apiBaseUrl}/admin/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          localStorage.removeItem("authToken");
          return null;
        }
        return response.json();
      })
      .then((user) => {
        if (!cancelled && user) {
          setCurrentUser(user);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setAuthChecked(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogin = (user, token) => {
    localStorage.setItem("authToken", token);
    setCurrentUser(user);
    navigate(`/users/${user._id}`, { replace: true });
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await fetch(`${apiBaseUrl}/admin/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } finally {
      localStorage.removeItem("authToken");
      setCurrentUser(null);
      navigate("/login", { replace: true });
    }
  };

  const handleAddPhoto = async (file) => {
    if (!currentUser || !file) {
      return;
    }

    const formData = new FormData();
    formData.append("uploadedphoto", file);

    const token = localStorage.getItem("authToken");
    const response = await fetch(`${apiBaseUrl}/photos/new`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    setListRefreshKey((value) => value + 1);
    setPhotoRefreshKey((value) => value + 1);
    navigate(`/photos/${currentUser._id}`);
  };

  if (!authChecked) {
    return null;
  }

  if (!currentUser) {
    return (
      <Routes>
        <Route path="/login" element={<LoginRegister onLogin={handleLogin} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

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
            <UserList isLoggedIn refreshKey={listRefreshKey} />
          </Paper>
        </Grid>
        <Grid item sm={9}>
          <Paper className="main-grid-item">
            <Routes>
              <Route path="/" element={<Navigate to={`/users/${currentUser._id}`} replace />} />
              <Route path="/login" element={<Navigate to={`/users/${currentUser._id}`} replace />} />
              <Route path="/users" element={<Navigate to={`/users/${currentUser._id}`} replace />} />
              <Route path="/users/:userId" element={<UserDetail />} />
              <Route
                path="/photos/:userId"
                element={<UserPhotos advancedFeatures={advancedFeatures} refreshKey={photoRefreshKey} />}
              />
              <Route
                path="/photos/:userId/:photoId"
                element={<UserPhotos advancedFeatures={advancedFeatures} refreshKey={photoRefreshKey} />}
              />
              <Route path="/comments/:userId" element={<UserComments />} />
              <Route path="*" element={<Navigate to={`/users/${currentUser._id}`} replace />} />
            </Routes>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
