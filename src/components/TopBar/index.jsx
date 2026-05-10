import React, { useEffect, useRef, useState } from "react";
import { AppBar, Button, Checkbox, FormControlLabel, Toolbar, Typography } from "@mui/material";
import { matchPath, useLocation } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

/**
 * Define TopBar, a React component of Project 4.
 */
function TopBar ({ advancedFeatures, onAdvancedFeaturesChange, currentUser, onLogout, onAddPhoto }) {
    const location = useLocation();
    const [contextText, setContextText] = useState("Users");
  const fileInputRef = useRef(null);

    useEffect(() => {
      const userRouteMatch = matchPath("/users/:userId", location.pathname);
      const photoRouteMatch =
        matchPath("/photos/:userId/:photoId", location.pathname) ||
        matchPath("/photos/:userId", location.pathname);
      const commentsRouteMatch = matchPath("/comments/:userId", location.pathname);

      if (!userRouteMatch && !photoRouteMatch && !commentsRouteMatch) {
        setContextText("Users");
        return;
      }

      const activeRoute = userRouteMatch || photoRouteMatch || commentsRouteMatch;
      const selectedUserId = activeRoute.params.userId;
      let cancelled = false;

      fetchModel(`/user/${selectedUserId}`)
        .then((user) => {
          if (cancelled || !user) {
            return;
          }
          const userName = `${user.first_name} ${user.last_name}`;
          if (photoRouteMatch) {
            setContextText(`Photos of ${userName}`);
          } else if (commentsRouteMatch) {
            setContextText(`Comments of ${userName}`);
          } else {
            setContextText(userName);
          }
        })
        .catch(() => {
          if (cancelled) {
            return;
          }

          setContextText("Users");
        });

      return () => {
        cancelled = true;
      };
    }, [location.pathname]);

    return (
      <AppBar className="topbar-appBar" position="absolute">
        <Toolbar>
          <Typography variant="h6" color="inherit" sx={{ flexGrow: 1 }}>
            Nguyễn Thành Nam-B23DCCN587
          </Typography>
          {currentUser ? (
            <Button
              color="inherit"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              sx={{ mr: 2 }}
            >
              Add Photo
            </Button>
          ) : null}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(event) => {
              const [file] = event.target.files || [];
              if (file) {
                onAddPhoto(file);
              }
              event.target.value = "";
            }}
          />
          <FormControlLabel
            sx={{ color: "inherit", mr: 3 }}
            control={(
              <Checkbox
                color="default"
                checked={advancedFeatures}
                onChange={(event) => onAdvancedFeaturesChange(event.target.checked)}
              />
            )}
            label="Enable Advanced Features"
          />
          <Typography variant="body1" color="inherit" sx={{ mr: 2 }}>
            {currentUser ? `Hi ${currentUser.first_name}` : "Please Login"}
          </Typography>
          {currentUser ? (
            <Button color="inherit" onClick={onLogout} sx={{ mr: 2 }}>
              Logout
            </Button>
          ) : null}
          <Typography variant="h6" color="inherit">
            {contextText}
          </Typography>
        </Toolbar>
      </AppBar>
    );
}

export default TopBar;
