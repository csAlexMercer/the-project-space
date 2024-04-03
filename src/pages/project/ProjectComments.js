import { useState } from "react";
import { timestamp, projectFirestore, projectStorage } from "../../firebase/config";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFirestore } from "../../hooks/useFirestore";
import Avatar from "../../components/Avatar";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

export default function ProjectComments({ project }) {
  const { updateDocument, response } = useFirestore("projects");
  const { user } = useAuthContext();
  const [newComment, setNewComment] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailError, setThumbnailError] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [fullScreenImage, setFullScreenImage] = useState(null); // Track full-screen image state

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate if new comment is not empty
    if (!newComment.trim()) {
      alert("Please add a comment before submitting.");
      return;
    }

    let imageUrl = "";
    if (thumbnail) {
      const storageRef = projectStorage.ref().child(`images/${thumbnail.name}`);
      await storageRef.put(thumbnail);
      imageUrl = await storageRef.getDownloadURL();
    }

    const commentToAdd = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      content: newComment,
      createdAt: timestamp.fromDate(new Date()),
      id: Math.random(),
      imageUrl: imageUrl,
    };

    await updateDocument(project.id, {
      comments: [...project.comments, commentToAdd],
    });

    if (!response.error) {
      setNewComment("");
      setThumbnail(null);
      setImageUrl("");
    }
  };

  const handleFileChange = (e) => {
    setThumbnail(null);
    let selected = e.target.files[0];

    if (!selected) {
      // Clear previous thumbnail and return
      setThumbnailError(null);
      return;
    }

    if (!selected.type.includes("image")) {
      setThumbnailError("Please select an image!");
      return;
    }
    if (selected.size > 100000) {
      setThumbnailError("Please select an image of size less than 100kb!");
      return;
    }

    setThumbnail(selected);
    setThumbnailError(null);
  };

  // Function to handle opening the image in full screen
  const openFullScreenImage = (imageUrl) => {
    setFullScreenImage(imageUrl);
  };

  // Function to close full screen image
  const closeFullScreenImage = () => {
    setFullScreenImage(null);
  };

  return (
    <div className="project-comments">
      <h4>Project Comments</h4>
      <ul>
        {project.comments.length > 0 &&
          project.comments.map((comment) => (
            <li key={comment.id}>
              <div className="comment-author">
                <Avatar src={comment.photoURL} />
                <p>{comment.displayName}</p>
              </div>
              <div className="comment-date">
                <p>
                  {formatDistanceToNow(comment.createdAt.toDate(), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              <div className="comment-content">
                <p>{comment.content}</p>
                {/* Add onClick to open image in full screen */}
                {comment.imageUrl && (
                  <div
                    className="comment-image-container"
                    onClick={() => openFullScreenImage(comment.imageUrl)}
                  >
                    <img
                      className="comment-image"
                      src={comment.imageUrl}
                      alt="Comment Image"
                    />
                  </div>
                )}
              </div>
            </li>
          ))}
      </ul>

      <form className="add-comment" onSubmit={handleSubmit}>
        <label>
          <span>Add new comment:</span>
          <textarea
            required
            onChange={(e) => setNewComment(e.target.value)}
            value={newComment}
          ></textarea>
        </label>
        <label>
          <span>Image:</span>
          <input type="file" onChange={handleFileChange} />
          {thumbnailError && <div className="error">{thumbnailError}</div>}
        </label>
        <button className="btn">Add Comment</button>
      </form>

      {/* Full screen image display */}
      {fullScreenImage && (
        <div className="overlay" onClick={closeFullScreenImage}>
          <div className="full-screen-image-container">
            <button className="close-btn" onClick={closeFullScreenImage}>
              Close
            </button>
            <img src={fullScreenImage} alt="Full Screen Image" />
          </div>
        </div>
      )}
    </div>
  );
}
