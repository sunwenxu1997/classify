<template>
  <div class="classify" style="height: calc(100vh - var(--van-tabbar-height))">
    <DraggableTabs :list="classificationsTree" v-model:active="activeIndex"></DraggableTabs>
    <!-- <van-tree-select
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
              <div class="name" v-if="item.name">{{ item.name }}</div>
            </div>
          </div>
        </div>
      </template>
    </van-tree-select> -->
  </div>
</template>
<script setup>
import { reactive, ref, computed, onActivated, onMounted, toRefs, onUpdated, onBeforeMount } from 'vue'
import { appStore } from '@/stores/app'
import { getClassifyFilesList } from '@/utils'
import DraggableTabs from '@/components/DraggableTabs/index.vue'
const $appStore = appStore()

const state = reactive({
  classTitles: [],
  classItems: [],
  classificationsTree: []
})
const activeIndex = ref(2)
const { classificationsTree } = toRefs(state)
onActivated(() => {
  // 从本地存储中获取喜欢的物品数据
  const likeItems = $appStore.likeItems || $appStore.getLikeItems()
  // 每次进入及时更新 items
  state.classItems.forEach((item) => {
    item.like = likeItems.some((likeItem) => likeItem.imgPath === item.imgPath)
  })
})
onBeforeMount(() => {
  console.log('1')
  const { classTitles, classItems } = getClassifyFilesList()
  state.classTitles = classTitles
  state.classItems = classItems
  const list = state.classItems

  // 根据获取的分类数据，生成树形结构
  state.classificationsTree = state.classTitles.map((name) => {
    return {
      name, // 分类名称
      children: list.filter((item) => item.className === name), // 分类下的物品
      dot: list.some((item) => item.className === name && item.like) // 是否有喜欢的物品
    }
  })
})
onMounted(() => {
  console.log('2')
})
// 点击喜欢
const clickItem = (item) => {
  item.like = !item.like
  // 每次点击喜欢后，在本地存储喜欢数量和对应喜欢的物品数据，缓存在localStorage中
  $appStore.updateLikeItems(state.classItems.filter((item) => item.like))
}
</script>
<style scoped>
.classify {
  /* padding: 0.75rem;
  box-sizing: border-box; */
  overflow: hidden;
}
</style>
