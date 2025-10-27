import PropTypes from 'prop-types'
import { User } from './User.jsx'

export function Post({ title, contents, imageURL, author }) {
  return (
    <article>
      <h3>{title}</h3>
      <div>{contents}</div>
      <div>
        <img src={imageURL} alt={title} height='200' width='200' />
      </div>

      {author && (
        <em>
          <br />
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
}
