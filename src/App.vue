<!-- src/App.vue -->
<template>
  <div id="app">
    <router-view></router-view> <!-- 页面占位，路由组件会显示在这里 -->
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* 可放全局样式 */
:root {
  /* 字体族定义 */
  --font-children-en: 'Nunito', 'Quicksand', 'Rounded Mplus 1c', sans-serif;
  --font-children-zh: 'PingFang SC', 'Lantinghei SC', 'Microsoft YaHei UI', 'SimHei', sans-serif;

  /* 应用到全局 */
  font-family: var(--font-children-en), "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
  
  /* 儿童阅读优化设置 */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  
  /* 针对儿童阅读，建议略微增大默认字号与行高 */
  font-size: 18px; 
  line-height: 1.6;
  letter-spacing: 0.02em; /* 适当增加字间距，防止视觉拥挤 */
}

/* 针对标题，可以尝试更有趣的圆体效果 */
h1, h2, b, strong {
  font-weight: 700;
  font-family: 'Quicksand', var(--font-children-zh);
}
</style>