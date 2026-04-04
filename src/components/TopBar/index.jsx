import React, { useEffect, useState } from "react";
import { AppBar, Checkbox, FormControlLabel, Toolbar, Typography } from "@mui/material";
import { matchPath, useLocation } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";
import models from "../../modelData/models";

/**
 * Define TopBar, a React component of Project 4.
 */
function TopBar ({ advancedFeatures, onAdvancedFeaturesChange }) {
    const location = useLocation();
    const [contextText, setContextText] = useState("Users");

    useEffect(() => {
      const userRouteMatch = matchPath("/users/:userId", location.pathname);
      const photoRouteMatch =
        matchPath("/photos/:userId/:photoId", location.pathname) ||
        matchPath("/photos/:userId", location.pathname);

      if (!userRouteMatch && !photoRouteMatch) {
        setContextText("Users");
        return;
      }

      const selectedUserId = (userRouteMatch || photoRouteMatch).params.userId;
      let cancelled = false;

      fetchModel(`/user/${selectedUserId}`)
        .then((user) => {
          if (cancelled || !user) {
            return;
          }
          const userName = `${user.first_name} ${user.last_name}`;
          setContextText(photoRouteMatch ? `Photos of ${userName}` : userName);
        })
        .catch(() => {
          if (cancelled) {
            return;
          }

          const user = models.userModel(selectedUserId);
          if (!user) {
            setContextText("Users");
            return;
          }

          const userName = `${user.first_name} ${user.last_name}`;
          setContextText(photoRouteMatch ? `Photos of ${userName}` : userName);
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
          <Typography variant="h6" color="inherit">
            {contextText}
          </Typography>
        </Toolbar>
      </AppBar>
    );
}

export default TopBar;
