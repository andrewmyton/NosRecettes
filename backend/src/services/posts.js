import { Post } from '../db/models/post.js'
import { User } from '../db/models/user.js'

export async function createPost(
  userId,
  { title, contents, imageURL, likes, tags },
) {
  const post = new Post({
    title,
    author: userId,
    contents,
    imageURL,
    likes,
    tags,
  })
  return await post.save()
}

async function listPosts(
  query = {},
  { sortBy = 'createdAt', sortOrder = 'descending' } = {},
) {
  return await Post.find(query).sort({ [sortBy]: sortOrder })
}

export async function listAllPosts(options) {
  return await listPosts({}, options)
}

export async function listPostsByAuthor(authorUsername, options) {
  const user = await User.findOne({ username: authorUsername })
  if (!user) return []
  return await listPosts({ author: user._id }, options)
}

export async function listPostsByTag(tags, options) {
  return await listPosts({ tags }, options)
}

export async function getPostById(postId) {
  return await Post.findById(postId)
}

export async function updatePost(userId, postId, { title, contents, tags }) {
  return await Post.findOneAndUpdate(
    { _id: postId, author: userId },
    { $set: { title, contents, tags } },
    { new: true },
  )
}

export async function deletePost(userId, postId) {
  return await Post.deleteOne({ _id: postId, author: userId })
}

export async function likePost(postId, userId) {
  // The Query remains the same: Only update if the user has NOT liked it yet.
  const query = {
    _id: postId,
    likedBy: { $ne: userId },
  }

  // Update: We use $inc (for counter) and $addToSet (ensures uniqueness)
  return await Post.findOneAndUpdate(
    query,
    {
      $inc: { likes: 1 },
      $addToSet: { likedBy: userId },
    },
    { new: true },
  )
}

export async function unlikePost(postId, userId) {
  // Query: Only update if the user HAS liked it AND the counter is above 0.
  const query = {
    _id: postId,
    likedBy: userId,
    likes: { $gt: 0 },
  }

  // Update: Decrement counter and $pull (remove) the user from the array.
  return await Post.findOneAndUpdate(
    query,
    {
      $inc: { likes: -1 },
      $pull: { likedBy: userId },
    },
    { new: true },
  )
}
