import React from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";

import "./styles.css";
import models from "../../modelData/models";

/**
 * Define UserList, a React component of Project 4.
 */
function UserList () {
    const users = models.userListModel();
    const location = useLocation();

    return (
      <div>
        <Typography variant="h6" gutterBottom>
          Users
        </Typography>
        <List component="nav">
          {users.map((item) => {
            const selected =
              location.pathname === `/users/${item._id}` ||
              location.pathname === `/photos/${item._id}`;

            return (
              <React.Fragment key={item._id}>
                <ListItem disablePadding>
                  <ListItemButton
                    component={RouterLink}
                    to={`/users/${item._id}`}
                    selected={selected}
                  >
                    <ListItemText primary={`${item.first_name} ${item.last_name}`} />
                  </ListItemButton>
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
