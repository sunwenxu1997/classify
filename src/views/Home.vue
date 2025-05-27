<template>
  <div class="classify">
    <van-tree-select
      v-model:main-active-index="activeIndex"
      height="calc(100vh - var(--van-tabbar-height))"
      :items="classificationsTree"
    >
      <template #content>
        <div class="right-content">
          <div v-for="(cl, index) in classificationsTree" :key="index" v-show="activeIndex === index" class="items-box">
            <div v-for="item in cl.children" :key="item.imgPath" class="item" @click="clickItem(item)">
              <div class="index" v-if="item.index">{{ item.index }}</div>
              <div class="like">
                <van-icon v-if="!item.like" name="like-o" />
                <van-icon v-else name="like" color="var(--app-theme-color)" />
              </div>
              <van-image :src="item.imgPath" lazy-load class="img" fit="cover" position="center">
                <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                </template>
              </van-image>
              <div class="text" v-if="item.text">{{ item.text }}</div>
            </div>
          </div>
        </div>
      </template>
    </van-tree-select>
  </div>
</template>
<script setup>
import { reactive, ref, computed, onActivated } from 'vue'
import { appStore } from '@/stores/app'
import { getClassifyFilesList } from '@/utils'
const $appStore = appStore()
const { classTitles, classItems } = getClassifyFilesList()
const state = reactive({
  classTitles,
  classItems
})
const activeIndex = ref(0)
// 根据获取的分类数据，生成树形结构
const classificationsTree = computed(() => {
  const list = state.classItems
  return state.classTitles.map((text) => {
    return {
      text, // 分类名称
      children: list.filter((item) => item.className === text), // 分类下的物品
      dot: list.some((item) => item.className === text && item.like) // 是否有喜欢的物品
    }
  })
})
console.log(classificationsTree.value)
onActivated(() => {
  // 从本地存储中获取喜欢的物品数据
  const likeItems = $appStore.likeItems || $appStore.getLikeItems()
  // 每次进入及时更新 items
  state.classItems.forEach((item) => {
    item.like = likeItems.some((likeItem) => likeItem.imgPath === item.imgPath)
  })
})
// 点击喜欢
const clickItem = (item) => {
  item.like = !item.like
  // 每次点击喜欢后，在本地存储喜欢数量和对应喜欢的物品数据，缓存在localStorage中
  $appStore.updateLikeItems(state.classItems.filter((item) => item.like))
}
</script>
<style></style>
