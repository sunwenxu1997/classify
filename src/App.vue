<script setup>
import { RouterView, useRouter, useRoute } from 'vue-router'
import { ref, computed, watch } from 'vue'
import { appStore } from '@/stores/app'
const $appStore = appStore()
const $router = useRouter()
const $route = useRoute()
const active = ref(null)
const routerArr = ['/', '/about']
watch(() => $route.path, (path) => {
  active.value = routerArr.indexOf(path)
})
const onChange = (value) => {
  $router.push(routerArr[value])
  active.value = value
}
const likeCount = computed(() => {
  return $appStore.likeCount || $appStore.getLikeCount()
})
</script>

<template>
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  <van-tabbar v-model="active" @change="onChange">
    <van-tabbar-item :name="0" :icon="active == 0 ? 'star' : 'star-o'">分类</van-tabbar-item>
    <van-tabbar-item :name="1" :icon="active == 1 ? 'like' : 'like-o'" :badge="likeCount">喜欢</van-tabbar-item>
  </van-tabbar>
</template>
<style>
</style>
