import { Post } from '../db/models/post.js'
import { User } from '../db/models/user.js'
import mongoose from 'mongoose'

export async function createPost(userId, { title, contents, imageURL, tags }) {
  const post = new Post({
    title,
    author: userId,
    contents,
    imageURL,
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

const ObjectId = mongoose.Types.ObjectId

export async function likePost(postId, userId) {
  // 1. Convert userId string to Mongoose ObjectId
  // ENSURE 'userId' IS USED HERE:
  const userObjectId = new ObjectId(userId)

  // Query: Only update if the user has NOT liked it yet.
  const query = {
    _id: postId,
    likedBy: { $ne: userObjectId },
  }

  // Update: We use $inc (for counter) and $addToSet
  return await Post.findOneAndUpdate(
    query,
    {
      $inc: { likes: 1 },
      // ENSURE 'userObjectId' IS USED HERE:
      $addToSet: { likedBy: userObjectId },
    },
    { new: true },
  )
}

export async function unlikePost(postId, userId) {
  // 1. Convert userId string to Mongoose ObjectId
  // ENSURE 'userId' IS USED HERE:
  const userObjectId = new ObjectId(userId)

  // Query: Only update if the user HAS liked it AND the counter is above 0.
  const query = {
    _id: postId,
    likedBy: userObjectId, // Use the userObjectId in the query
    likes: { $gt: 0 },
  }

  // Update: Decrement counter and $pull (remove) the ObjectId from the array.
  return await Post.findOneAndUpdate(
    query,
    {
      $inc: { likes: -1 },
      // ENSURE 'userObjectId' IS USED HERE:
      $pull: { likedBy: userObjectId },
    },
    { new: true },
  )
}
