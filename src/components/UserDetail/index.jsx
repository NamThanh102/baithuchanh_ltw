import React, { useEffect, useState } from "react";
import { Button, CircularProgress, Divider, Typography } from "@mui/material";

import "./styles.css";
import { Link as RouterLink, useParams } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      let cancelled = false;

      setLoading(true);
      fetchModel(`/user/${userId}`)
        .then((data) => {
          if (!cancelled) {
            setUser(data);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setUser(null);
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
    }, [userId]);

    if (loading) {
      return <CircularProgress size={24} />;
    }

    if (!user) {
      return <Typography variant="body1">User not found.</Typography>;
    }

    return (
        <>
          <Typography variant="h5" gutterBottom>
            {user.first_name} {user.last_name}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" gutterBottom>
            <strong>Location:</strong> {user.location}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Occupation:</strong> {user.occupation}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Description:</strong> {user.description}
          </Typography>

          <Button component={RouterLink} to={`/photos/${user._id}`} variant="contained">
            View Photos
          </Button>
        </>
    );
}

export default UserDetail;
