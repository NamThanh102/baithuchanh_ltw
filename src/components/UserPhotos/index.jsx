import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Divider,
  Button,
  Link,
  TextField,
  Typography,
} from "@mui/material";

import "./styles.css";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
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
    return fileName ? `/images/${fileName}` : "";
  }
}

/**
 * Define UserPhotos, a React component of Project 4.
 */
function UserPhotos ({ advancedFeatures, currentUser, refreshKey, onDataChanged }) {
  const { userId, photoId } = useParams();
  const navigate = useNavigate();
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [commentInputs, setCommentInputs] = useState({});

    useEffect(() => {
      let cancelled = false;

      const loadPhotos = async () => {
        setLoading(true);
        try {
          const data = await fetchModel(`/photosOfUser/${userId}`);
          if (!cancelled) {
            setPhotos(data || []);
          }
        } catch (error) {
          if (!cancelled) {
            setPhotos([]);
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      };

      loadPhotos();

      return () => {
        cancelled = true;
      };
    }, [userId, refreshKey]);

    const submitComment = async (photoTargetId) => {
      const text = (commentInputs[photoTargetId] || "").trim();
      if (!text) {
        return;
      }

      const response = await fetch(`/commentsOfPhoto/${photoTargetId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ comment: text }),
      });

      if (response.ok) {
        setCommentInputs((prev) => ({ ...prev, [photoTargetId]: "" }));
        const updated = await fetchModel(`/photosOfUser/${userId}`);
        setPhotos(updated || []);
        if (onDataChanged) {
          onDataChanged();
        }
      }
    };

    if (loading) {
      return <CircularProgress size={24} />;
    }

    if (photos.length === 0) {
      return <Typography variant="body1">No photos to display.</Typography>;
    }

    const currentIndex = Math.max(
      0,
      photos.findIndex((photo) => photo._id === photoId)
    );
    const activeIndex = currentIndex >= 0 ? currentIndex : 0;
    const activePhoto = photos[activeIndex];

    const goToPhoto = (nextIndex) => {
      if (nextIndex < 0 || nextIndex >= photos.length) {
        return;
      }
      navigate(`/photos/${userId}/${photos[nextIndex]._id}`);
    };

    if (advancedFeatures) {
      return (
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Button
              variant="outlined"
              disabled={activeIndex === 0}
              onClick={() => goToPhoto(activeIndex - 1)}
            >
              Previous
            </Button>
            <Typography variant="body2" sx={{ alignSelf: "center" }}>
              Photo {activeIndex + 1} of {photos.length}
            </Typography>
            <Button
              variant="outlined"
              disabled={activeIndex === photos.length - 1}
              onClick={() => goToPhoto(activeIndex + 1)}
            >
              Next
            </Button>
          </Box>

          <Card>
            {resolveImage(activePhoto.file_name) ? (
              <CardMedia
                component="img"
                image={resolveImage(activePhoto.file_name)}
                alt={activePhoto.file_name}
              />
            ) : null}
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Posted: {formatDateTime(activePhoto.date_time)}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle1" gutterBottom>
                Comments
              </Typography>

              {currentUser ? (
                <Box sx={{ mb: 2 }}>
                  <TextField
                    label="Add a comment"
                    value={commentInputs[activePhoto._id] || ""}
                    onChange={(event) =>
                      setCommentInputs((prev) => ({
                        ...prev,
                        [activePhoto._id]: event.target.value,
                      }))
                    }
                    fullWidth
                    size="small"
                  />
                  <Button
                    variant="contained"
                    sx={{ mt: 1 }}
                    onClick={() => submitComment(activePhoto._id)}
                  >
                    Submit
                  </Button>
                </Box>
              ) : null}

              {(activePhoto.comments || []).length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No comments.
                </Typography>
              ) : (
                (activePhoto.comments || []).map((comment) => (
                  <div key={comment._id} style={{ marginBottom: 12 }}>
                    <Typography variant="body2" color="text.secondary">
                      {formatDateTime(comment.date_time)}
                    </Typography>
                    <Typography variant="body1">
                      <Link component={RouterLink} to={`/users/${comment.user._id}`}>
                        {comment.user.first_name} {comment.user.last_name}
                      </Link>{" "}
                      {comment.comment}
                    </Typography>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </Box>
      );
    }

    return (
      <div>
        {photos.map((photo) => (
          <Card key={photo._id} sx={{ mb: 3 }}>
            {resolveImage(photo.file_name) ? (
              <CardMedia
                component="img"
                image={resolveImage(photo.file_name)}
                alt={photo.file_name}
              />
            ) : null}
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Posted: {formatDateTime(photo.date_time)}
              </Typography>
              <Divider sx={{ my: 1 }} />

              <Typography variant="subtitle1" gutterBottom>
                Comments
              </Typography>

              {currentUser ? (
                <Box sx={{ mb: 2 }}>
                  <TextField
                    label="Add a comment"
                    value={commentInputs[photo._id] || ""}
                    onChange={(event) =>
                      setCommentInputs((prev) => ({
                        ...prev,
                        [photo._id]: event.target.value,
                      }))
                    }
                    fullWidth
                    size="small"
                  />
                  <Button
                    variant="contained"
                    sx={{ mt: 1 }}
                    onClick={() => submitComment(photo._id)}
                  >
                    Submit
                  </Button>
                </Box>
              ) : null}

              {(photo.comments || []).length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No comments.
                </Typography>
              ) : (
                (photo.comments || []).map((comment) => (
                  <div key={comment._id} style={{ marginBottom: 12 }}>
                    <Typography variant="body2" color="text.secondary">
                      {formatDateTime(comment.date_time)}
                    </Typography>
                    <Typography variant="body1">
                      <Link component={RouterLink} to={`/users/${comment.user._id}`}>
                        {comment.user.first_name} {comment.user.last_name}
                      </Link>{" "}
                      {comment.comment}
                    </Typography>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
}

export default UserPhotos;
