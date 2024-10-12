<script setup>
import { appStore } from '@/stores/app'
import { onActivated, ref } from 'vue'
const $appStore = appStore()
const likeItems = ref([])
onActivated(() => {
  // 每次进入及时更新 likeItems
  likeItems.value = $appStore.likeItems || $appStore.getLikeItems()
})
// 点击删除
const clickItem = (item) => {
  item.like = !item.like
  const arr = likeItems.value
  arr.splice(
    arr.findIndex((likeItem) => likeItem.imgPath === item.imgPath),
    1
  )
  likeItems.value = arr
  $appStore.updateLikeItems(arr.filter((likeItem) => likeItem.imgPath !== item.imgPath))
}
</script>

<template>
  <div class="app-content">
    <div class="items-box" v-if="likeItems.length">
      <div v-for="item in likeItems" :key="item.imgPath" class="item" @click="clickItem(item)">
        <div class="index" v-if="item.index">{{ item.index }}</div>
        <div class="like">
          <van-icon name="delete-o" />
        </div>
        <van-image :src="item.imgPath" lazy-load class="img" fit="cover" position="center">
          <template v-slot:loading>
            <van-loading type="spinner" size="20" />
          </template>
        </van-image>
        <div class="text">{{ item.text }}</div>
      </div>
    </div>
    <van-empty style="margin-top:30vh" v-else image-size="100" description="没有喜欢的~" />
  </div>
</template>

<style scoped>
.items-box {
  --img-width: clamp(5rem, calc(100vw / 3.8), 200px);
}
</style>
