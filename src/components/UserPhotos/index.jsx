import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Divider,
  Link,
  Typography,
} from "@mui/material";

import "./styles.css";
import { Link as RouterLink, useParams } from "react-router-dom";
import models from "../../modelData/models";

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

/**
 * Define UserPhotos, a React component of Project 4.
 */
function UserPhotos () {
    const { userId } = useParams();
    const photos = models.photoOfUserModel(userId);

    if (photos.length === 0) {
      return <Typography variant="body1">No photos to display.</Typography>;
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
