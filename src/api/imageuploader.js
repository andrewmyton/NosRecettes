const CLOUD_NAME = 'dv4dnxiln'
const UPLOAD_PRESET = 'recipe'

const form = document.getElementById('upload-image')
form.addEventListener('submit', async (event) => {
  event.preventDefault()

  // 1. Get the file from the input
  const file = document.getElementById('fileInput').files[0]
  if (!file) {
    alert('Please select an image.')
    return
  }

  // 2. Upload the file to Cloudinary
  console.log('Uploading to Cloudinary...')
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)

  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
  const response = await fetch(cloudinaryUrl, {
    method: 'POST',
    body: formData,
  })
  const cloudinaryData = await response.json()
  const imageUrl = cloudinaryData.secure_url

  console.log('Cloudinary URL received:', imageUrl)

  // 3. Put the URL into the hidden input field
  document.getElementById('imageUrl').value = imageUrl

  // 4. Gather all form data into an object
  const postData = {
    caption: document.getElementById('caption').value,
    imageUrl: document.getElementById('imageUrl').value, // Get value from the hidden field
  }

  console.log('Sending this data to our server:', postData)
})
