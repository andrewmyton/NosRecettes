import {
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
} from '../services/posts.js'
import { requireAuth } from '../middleware/jwt.js'

export function postsRoutes(app) {
  app.get('/api/v1/posts', async (req, res) => {
    const { sortBy, sortOrder, author, tag } = req.query
    const options = { sortBy, sortOrder }
    try {
      if (author && tag) {
        return res
          .status(400)
          .json({ error: 'query by either author or tag, not both' })
      } else if (author) {
        return res.json(await listPostsByAuthor(author, options))
      } else if (tag) {
        return res.json(await listPostsByTag(tag, options))
      } else {
        return res.json(await listAllPosts(options))
      }
    } catch (err) {
      console.error('error listing posts', err)
      return res.status(500).end()
    }
  })

  app.get('/api/v1/posts/:id', async (req, res) => {
    const { id } = req.params
    try {
      const post = await getPostById(id)
      if (post === null) return res.status(404).end()
      return res.json(post)
    } catch (err) {
      console.error('error getting post', err)
      return res.status(500).end()
    }
  })

  app.post('/api/v1/posts', requireAuth, async (req, res) => {
    try {
      const post = await createPost(req.auth.sub, req.body)
      return res.json(post)
    } catch (err) {
      console.error('error creating post', err)
      return res.status(500).end()
    }
  })

  app.patch('/api/v1/posts/:id', requireAuth, async (req, res) => {
    try {
      const post = await updatePost(req.auth.sub, req.params.id, req.body)
      return res.json(post)
    } catch (err) {
      console.error('error updating post', err)
      return res.status(500).end()
    }
  })

  app.delete('/api/v1/posts/:id', requireAuth, async (req, res) => {
    try {
      const { deletedCount } = await deletePost(req.auth.sub, req.params.id)
      if (deletedCount === 0) return res.sendStatus(404)
      return res.status(204).end()
    } catch (err) {
      console.error('error deleting post', err)
      return res.status(500).end()
    }
  })

  app.post('/api/v1/posts/:id/like', requireAuth, async (req, res) => {
    const { id: postId } = req.params // Renaming 'id' to 'postId' for clarity
    const userId = req.auth.sub
    try {
      const post = await likePost(postId, userId)

      if (post === null) {
        // If post is null, the ID was valid but no matching document was found
        return res.status(404).end()
      }

      return res.json(post) // Returns the updated post object
    } catch (err) {
      console.error('error liking post', err)
      // Check for potential Mongoose errors (e.g., bad object ID format)
      if (err.name === 'CastError') {
        return res.status(400).end()
      }
      return res.status(500).end()
    }
  })

  app.patch('/api/v1/posts/:id/unlike', requireAuth, async (req, res) => {
    const { id: postId } = req.params
    const userId = req.auth.sub
    try {
      const post = await unlikePost(postId, userId)

      if (post === null) {
        return res.status(404).end()
      }

      return res.json(post) // Returns the updated post object
    } catch (err) {
      console.error('error unliking post', err)
      if (err.name === 'CastError') {
        return res.status(400).end()
      }
      return res.status(500).end()
    }
  })
}
