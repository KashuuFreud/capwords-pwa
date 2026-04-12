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
import { useWordStore } from '@/store/wordStore'

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
.camera-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

/* 相机预览框 → 用你们项目的圆角+卡片风格 */
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
}

/* 拍照按钮 → 统一UI风格 */
.capture-btn {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  padding: 16px 36px;
  border: none;
  border-radius: 999px;
  background: #63b07f; /* 项目主绿色 */
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

/* 按钮组 */
.action-btns {
  display: flex;
  gap: 16px;
  padding: 20px;
  justify-content: center;
}

/* 重拍按钮 → 红色系（统一UI） */
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

/* 识别按钮 → 绿色系（统一UI） */
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

/* 识别结果卡片 → 你们项目风格 */
.result-card {
  margin-top: 24px;
  padding: 26px;
  background: #cedb9a; /* 顶部卡片浅黄色 */
  border-radius: 26px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

.result-card h3 {
  margin: 0 0 10px;
  font-size: 28px;
  color: #111;
}

.chinese {
  font-size: 20px;
  color: #222;
  margin: 10px 0;
}

.example {
  color: #444;
  font-size: 16px;
}

/* 添加到词汇本按钮 */
.add-btn {
  margin-top: 18px;
  padding: 14px 28px;
  border: none;
  border-radius: 999px;
  background: #c56f34;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}
</style>