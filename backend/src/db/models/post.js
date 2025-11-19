import mongoose, { Schema } from 'mongoose'

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    contents: String,
    imageURL: String,
    likes: { type: Number, default: 0 },
    likedBy: { type: [Schema.Types.ObjectId], ref: 'user', default: [] },
    tags: [String],
  },
  { timestamps: true },
)

export const Post = mongoose.model('post', postSchema)
