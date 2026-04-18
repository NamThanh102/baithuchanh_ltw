import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Divider,
  Link,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useParams } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

const imageModules = require.context("../../images", false, /\.(png|jpe?g|svg)$/);

function formatDateTime(rawDateTime) {
  const date = new Date(rawDateTime);
  if (Number.isNaN(date.getTime())) {
    return rawDateTime;
  }
  return date.toLocaleString();
}

function resolveImage(fileName) {
  try {
    return imageModules(`./${fileName}`);
  } catch (error) {
    return "";
  }
}

function UserComments() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    Promise.all([fetchModel(`/user/${userId}`), fetchModel(`/user/${userId}/comments`)])
      .then(([userData, commentsData]) => {
        if (cancelled) {
          return;
        }
        setUser(userData || null);
        setComments(commentsData || []);
      })
      .catch(() => {
        if (cancelled) {
          return;
        }
        setUser(null);
        setComments([]);
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
    <Box>
      <Typography variant="h5" gutterBottom>
        Comments of {user.first_name} {user.last_name}
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {comments.length === 0 ? (
        <Typography variant="body1">No comments to display.</Typography>
      ) : (
        comments.map((commentItem) => (
          <Card key={commentItem._id} sx={{ mb: 2 }}>
            <Box className="user-comments-row">
              {resolveImage(commentItem.file_name) ? (
                <Link
                  component={RouterLink}
                  to={`/photos/${commentItem.photo_user_id}/${commentItem.photo_id}`}
                  className="user-comments-link"
                >
                  <CardMedia
                    component="img"
                    image={resolveImage(commentItem.file_name)}
                    alt={commentItem.file_name}
                    className="user-comments-thumb"
                  />
                </Link>
              ) : null}

              <CardContent sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {formatDateTime(commentItem.date_time)}
                </Typography>
                <Typography variant="body1">
                  <Link
                    component={RouterLink}
                    to={`/photos/${commentItem.photo_user_id}/${commentItem.photo_id}`}
                  >
                    {commentItem.comment}
                  </Link>
                </Typography>
              </CardContent>
            </Box>
          </Card>
        ))
      )}
    </Box>
  );
}

export default UserComments;
