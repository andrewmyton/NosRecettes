// LikeButton.jsx
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useAuth } from '../contexts/AuthContext.jsx'
import { likePostApi, unlikePostApi } from '../api/likes.js'

export function LikeButton({ postId, initialLikes = 0, initialLikedBy = [] }) {
  const [token, user] = useAuth()

  // State for tracking the likes count and current user's status
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(false)

  // Get the current user ID from the user object if authenticated
  const currentUserId = user ? user._id : null

  // Determine initial 'isLiked' state when the component first mounts
  useEffect(() => {
    if (currentUserId && initialLikedBy.includes(currentUserId)) {
      setIsLiked(true)
    } else {
      setIsLiked(false)
    }
  }, [currentUserId, initialLikedBy])

  const handleLikeToggle = async () => {
    if (!token) {
      alert('You must be logged in to like a post.')
      return
    }

    try {
      let updatedPost = null

      if (isLiked) {
        // UNLIKE operation
        updatedPost = await unlikePostApi(postId, token)
      } else {
        // LIKE operation
        updatedPost = await likePostApi(postId, token)
      }

      // Update local state based on the successful response from the server
      setLikes(updatedPost.likes)
      setIsLiked(!isLiked)
    } catch (error) {
      console.error('Like toggle failed:', error.message)

      // Handle the specific 409 Conflict error from the server
      if (error.message === '409') {
        alert('Action failed due to a state conflict (already liked/unliked).')
      } else if (error.message === '401') {
        alert('You must be logged in to perform this action.')
      } else {
        alert('An unknown error occurred.')
      }
    }
  }

  // If the user is not logged in, just display the count.
  if (!token) {
    return <span>❤️ {likes}</span>
  }

  // Render button if user is logged in
  return (
    <button
      onClick={handleLikeToggle}
      aria-label={isLiked ? 'Unlike post' : 'Like post'}
      style={{
        cursor: 'pointer',
        backgroundColor: 'transparent',
        border: 'none',
        padding: 0,
        fontSize: '1em',
      }}
    >
      <span role='img' aria-label='Heart'>
        {isLiked ? '❤️' : '🤍'}
      </span>{' '}
      {likes}
    </button>
  )
}

LikeButton.propTypes = {
  postId: PropTypes.string.isRequired,
  initialLikes: PropTypes.number,
  initialLikedBy: PropTypes.arrayOf(PropTypes.string),
}
