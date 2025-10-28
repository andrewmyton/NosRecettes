import PropTypes from 'prop-types'
import { User } from './User.jsx'
import { Link } from 'react-router-dom'
import slug from 'slug'

export function Post({
  title,
  contents,
  imageURL,
  author,
  _id,
  fullPost = false,
}) {
  return (
    <article>
      {fullPost ? (
        <h3>{title}</h3>
      ) : (
        <Link to={`/posts/${_id}/${slug(title)}`}>
          <h3>{title}</h3>
        </Link>
      )}
      {fullPost && <div>{contents}</div>}
      <div>
        <img src={imageURL} alt={title} height='200' width='200' />
      </div>

      {author && (
        <em>
          {fullPost && <br />}
          Written by <User id={author} />
        </em>
      )}
    </article>
  )
}

Post.propTypes = {
  title: PropTypes.string.isRequired,
  contents: PropTypes.string,
  author: PropTypes.string,
  imageURL: PropTypes.string,
  _id: PropTypes.string.isRequired,
  fullPost: PropTypes.bool,
}
