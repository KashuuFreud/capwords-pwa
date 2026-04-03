<template>
  <div class="camera-container">
    <!-- 相机预览 -->
    <div v-if="!capturedImage" class="camera-box">
      <video ref="videoRef" autoplay playsinline></video>
      <button @click="takePhoto" class="capture-btn">拍照</button>
    </div>

    <!-- 拍照后预览 -->
    <div v-else class="preview-box">
      <img :src="capturedImage" alt="拍摄的图片" />
      <div class="action-btns">
        <button @click="reTake" class="retake-btn">重拍</button>
        <button @click="recognizeWord" :loading="loading" class="recognize-btn">
          {{ loading ? '识别中...' : '识别单词' }}
        </button>
      </div>
    </div>

    <!-- 识别结果 -->
    <div v-if="recognizedWord" class="result-card">
      <h3>{{ recognizedWord.english }}</h3>
      <p class="chinese">{{ recognizedWord.chinese }}</p>
      <p v-if="recognizedWord.example" class="example">例句：{{ recognizedWord.example }}</p>
      <button @click="addToVocab" class="add-btn">添加到词汇本</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useWordStore } from '@/stores/wordStore'

const wordStore = useWordStore()
const videoRef = ref(null)
const capturedImage = ref(null)
const recognizedWord = ref(null)
const loading = ref(false)
let stream = null

// 初始化相机
onMounted(async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' } // 后置摄像头
    })
    videoRef.value.srcObject = stream
  } catch (err) {
    console.error('相机权限获取失败', err)
    alert('请允许相机权限以使用拍照识词功能')
  }
})

// 拍照
const takePhoto = () => {
  const canvas = document.createElement('canvas')
  const video = videoRef.value
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
  capturedImage.value = canvas.toDataURL('image/jpeg')
}

// 重拍
const reTake = () => {
  capturedImage.value = null
  recognizedWord.value = null
}

// 识别单词
const recognizeWord = async () => {
  loading.value = true
  try {
    // base64转FormData
    const blob = await (await fetch(capturedImage.value)).blob()
    const formData = new FormData()
    formData.append('image', blob, 'word.jpg')

    const res = await wordStore.recognizeImageWord(formData)
    recognizedWord.value = res
  } catch (err) {
    alert('识别失败，请重试')
  } finally {
    loading.value = false
  }
}

// 添加到词汇本
const addToVocab = async () => {
  const res = await wordStore.addWord(recognizedWord.value)
  if (res) {
    alert('添加成功！')
    recognizedWord.value = null
    capturedImage.value = null
  }
}

// 关闭相机
onUnmounted(() => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
  }
})
</script>

<style scoped>
.camera-container { max-width: 600px; margin: 0 auto; padding: 20px; }
.camera-box, .preview-box { position: relative; border-radius: 12px; overflow: hidden; }
video, img { width: 100%; display: block; }
.capture-btn, .retake-btn, .recognize-btn, .add-btn {
  padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;
}
.capture-btn { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); background: #409eff; color: #fff; }
.action-btns { display: flex; gap: 10px; padding: 15px; justify-content: center; }
.retake-btn { background: #f56c6c; color: #fff; }
.recognize-btn { background: #67c23a; color: #fff; }
.result-card { margin-top: 20px; padding: 20px; border: 1px solid #eee; border-radius: 12px; }
.chinese { font-size: 18px; color: #333; margin: 10px 0; }
.example { color: #666; }
.add-btn { margin-top: 15px; background: #409eff; color: #fff; }
</style>