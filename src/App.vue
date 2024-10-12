<script setup>
import { RouterView, useRouter } from 'vue-router'
import { ref } from 'vue'
const $router = useRouter()
const active = ref(0)
const routerArr = ['/', '/about']
const onChange = (value) => {
  $router.push(routerArr[value])
  active.value = value
}
</script>

<template>
  <div class="app-content">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
  <van-tabbar v-model="active" @change="onChange">
    <van-tabbar-item :name="0" :icon="active == 0 ? 'star' : 'star-o'">分类</van-tabbar-item>
    <van-tabbar-item :name="1" :icon="active == 1 ? 'like' : 'like-o'" badge="5">喜欢</van-tabbar-item>
  </van-tabbar>
</template>
<style>
</style>
