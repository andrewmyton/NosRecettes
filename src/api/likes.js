export const likePostApi = async (postId, token) => {
  // POST /api/v1/posts/:id/like
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/posts/${postId}/like`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  )
  if (!res.ok) {
    throw new Error(res.status)
  }
  return await res.json()
}

export const unlikePostApi = async (postId, token) => {
  // PATCH /api/v1/posts/:id/unlike
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/posts/${postId}/unlike`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  )
  if (!res.ok) {
    throw new Error(res.status)
  }
  return await res.json()
}
