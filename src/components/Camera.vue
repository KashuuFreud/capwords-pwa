<template>
  <div class="camera-container">
    <div v-if="!capturedImage" class="camera-box">
      <video ref="videoRef" autoplay playsinline></video>
      <button @click="takePhoto" class="capture-btn">Take photo</button>
    </div>

    <div v-else class="preview-box">
      <img :src="capturedImage" alt="Captured preview" />
      <div class="action-btns">
        <button @click="reTake" class="retake-btn">Retake</button>
        <button @click="recognizeWord" class="recognize-btn">
          {{ loading ? 'Recognizing...' : 'Recognize word' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { recognizeWordByImage } from '../services'

const router = useRouter()
const videoRef = ref(null)
const capturedImage = ref(null)
const loading = ref(false)
let stream = null

onMounted(async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    })

    if (videoRef.value) {
      videoRef.value.srcObject = stream
    }
  } catch (err) {
    console.error('Failed to get camera permission', err)
    alert('Please allow camera access to use this feature.')
  }
})

const takePhoto = () => {
  const video = videoRef.value
  if (!video || !video.videoWidth || !video.videoHeight) {
    alert('Camera is not ready yet.')
    return
  }

  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  const ctx = canvas.getContext('2d')
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

  capturedImage.value = canvas.toDataURL('image/jpeg')
}

const reTake = () => {
  capturedImage.value = null
}

const recognizeWord = async () => {
  if (!capturedImage.value) {
    alert('Please take a photo first.')
    return
  }

  loading.value = true

  try {
    const blob = await fetch(capturedImage.value).then(response => response.blob())
    const file = new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' })
    const formData = new FormData()
    formData.append('file', file)

    const result = await recognizeWordByImage(formData)

    localStorage.setItem('capturedImage', capturedImage.value)
    localStorage.setItem('capturedImageName', file.name)
    localStorage.setItem('wordResult', JSON.stringify(result))

    router.push('/result')
  } catch (err) {
    console.error('Recognize failed', err)
    alert(err.message || 'Recognize failed, please try again.')
  } finally {
    loading.value = false
  }
}

onUnmounted(() => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
  }
})
</script>

<style scoped>
.camera-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.camera-box,
.preview-box {
  position: relative;
  border-radius: 26px;
  overflow: hidden;
  background: #c56f34;
  box-shadow: 0 10px 30px rgba(112, 96, 50, 0.28);
}

video,
img {
  width: 100%;
  display: block;
  object-fit: cover;
  min-height: 420px;
}

.capture-btn {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  padding: 16px 36px;
  border: none;
  border-radius: 999px;
  background: #63b07f;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.action-btns {
  display: flex;
  gap: 16px;
  padding: 20px;
  justify-content: center;
  background: #fff7ef;
}

.retake-btn {
  padding: 14px 30px;
  border: none;
  border-radius: 999px;
  background: #eb5757;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.recognize-btn {
  padding: 14px 30px;
  border: none;
  border-radius: 999px;
  background: #63b07f;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}
</style>
