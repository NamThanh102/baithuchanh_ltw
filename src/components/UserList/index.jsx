import React, { useEffect, useState } from "react";
import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

/**
 * Define UserList, a React component of Project 4.
 */
function UserList () {
    const [users, setUsers] = useState([]);
  const [statsByUserId, setStatsByUserId] = useState({});
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
      let cancelled = false;

      Promise.all([fetchModel("/user/list"), fetchModel("/user/stats/list")])
        .then(([userData, statsData]) => {
          if (!cancelled) {
            setUsers(userData || []);

            const mappedStats = {};
            (statsData || []).forEach((item) => {
              if (item && item._id) {
                mappedStats[item._id] = {
                  photoCount: item.photoCount || 0,
                  commentCount: item.commentCount || 0,
                };
              }
            });
            setStatsByUserId(mappedStats);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setUsers([]);
            setStatsByUserId({});
          }
        })
        .finally(() => {
          if (!cancelled) {
            setLoading(false);
          }
        });

      return () => {
        cancelled = true;
      };
    }, []);

    if (loading) {
      return <CircularProgress size={24} />;
    }

    return (
      <div>
        <Typography variant="h6" gutterBottom>
          Users
        </Typography>
        <List component="nav">
          {users.map((item) => {
            const stats = statsByUserId[item._id] || { photoCount: 0, commentCount: 0 };
            const selected =
              location.pathname === `/users/${item._id}` ||
              location.pathname === `/photos/${item._id}` ||
              location.pathname === `/comments/${item._id}`;

            return (
              <React.Fragment key={item._id}>
                <ListItem disablePadding>
                  <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <ListItemButton
                      component={RouterLink}
                      to={`/users/${item._id}`}
                      selected={selected}
                      sx={{ flexGrow: 1 }}
                    >
                      <ListItemText primary={`${item.first_name} ${item.last_name}`} />
                    </ListItemButton>

                    <Chip
                      label={stats.photoCount}
                      size="small"
                      color="success"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={stats.commentCount}
                      size="small"
                      color="error"
                      clickable
                      component={RouterLink}
                      to={`/comments/${item._id}`}
                      sx={{ mr: 1 }}
                    />
                  </Box>
                </ListItem>
              <Divider />
              </React.Fragment>
            );
          })}
        </List>
      </div>
    );
}

export default UserList;
