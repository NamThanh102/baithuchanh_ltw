import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { matchPath, useLocation } from "react-router-dom";

import "./styles.css";
import models from "../../modelData/models";

/**
 * Define TopBar, a React component of Project 4.
 */
function TopBar () {
  const location = useLocation();
  const [contextText, setContextText] = useState("Users");

    useEffect(() => {
      const userRouteMatch = matchPath("/users/:userId", location.pathname);
      const photoRouteMatch = matchPath("/photos/:userId", location.pathname);

      if (!userRouteMatch && !photoRouteMatch) {
        setContextText("Users");
        return;
      }

      const selectedUserId = (userRouteMatch || photoRouteMatch).params.userId;
      const user = models.userModel(selectedUserId);
      if (!user) {
        setContextText("Users");
        return;
      }

      const userName = `${user.first_name} ${user.last_name}`;
      setContextText(photoRouteMatch ? `Photos of ${userName}` : userName);
    }, [location.pathname]);

    return (
      <AppBar className="topbar-appBar" position="absolute">
        <Toolbar>
          <Typography variant="h6" color="inherit" sx={{ flexGrow: 1 }}>
            Nguyễn Thành Nam-B23DCCN587
          </Typography>
          <Typography variant="h6" color="inherit">
            {contextText}
          </Typography>
        </Toolbar>
      </AppBar>
    );
}

export default TopBar;
