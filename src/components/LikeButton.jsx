// LikeButton.jsx
import { useState } from 'react'
import PropTypes from 'prop-types'

export const LikeButton = ({ likes }) => {
  const [liked, setLiked] = useState(false) // State to track if the item is liked
  const [likesCount, setLikesCount] = useState(likes) // State to track the number of likes

  const toggleLike = () => {
    setLiked(!liked) // Toggle the liked status
    setLikesCount(liked ? likesCount - 1 : likesCount + 1) // Adjust likes count
  }

  return (
    <button
      onClick={toggleLike}
      style={{
        backgroundColor: liked ? 'red' : 'gray',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        cursor: 'pointer',
      }}
    >
      {liked ? 'Liked' : 'Like'} ({likesCount})
    </button>
  )
}

LikeButton.propTypes = {
  likes: PropTypes.number,
}
export default LikeButton
