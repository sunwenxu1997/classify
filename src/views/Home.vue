<script setup>
import { reactive, ref, computed, onActivated } from 'vue'
import { appStore } from '@/stores/app'
const $appStore = appStore()
// 遍历获取 public/分类 下的文件目录
const modules = import.meta.glob('/public/分类/**')
const classifications = reactive([]) // 分类名
const items = reactive([]) // 所有物品
const activeIndex = ref(0)
Object.keys(modules).forEach((path) => {
  // 具体分类物品得一些属性
  let item = {
    className: path.split('/').slice(-2)[0], // 一级分类名称
    imgPath: import.meta.env.BASE_URL + path.split('/public')[1], // 图片路径
    text: path.split('/').slice(-1)[0].split('.')[0] // 图片名称除去.后缀
  }

  // 正则校验路径中是否存在-符号,所以路径中尽量避免不必要的 - 符号
  const reg = /-/
  if (reg.test(path)) {
    item.className = path.split('/').slice(-2)[0].split('-')[1] // 一级分类名称不需要展示序号
  }
  if (reg.test(item.text)) {
    item.index = item.text.split('-')[0] // 序号
    item.text = item.text.split('-')[1] // 图片名称不需要展示序号
  }
  if (!classifications.includes(item.className)) classifications.push(item.className)
  items.push(item)
})
onActivated(() => {
  // 从本地存储中获取喜欢的物品数据
  const likeItems = $appStore.likeItems || $appStore.getLikeItems()
  // 每次进入及时更新 items
  items.forEach((item) => {
    item.like = likeItems.some((likeItem) => likeItem.imgPath === item.imgPath)
  })
})
// 处理加工好的分类数据
const classificationsTree = computed(() => {
  return classifications.map((text) => {
    return {
      text,
      children: items.filter((item) => item.className === text),
      dot: items.some((item) => item.className === text && item.like)
    }
  })
})
// 点击喜欢
const clickItem = (item) => {
  item.like = !item.like
  // 每次点击喜欢后，在本地存储喜欢数量和对应喜欢的物品数据，缓存在localStorage中
  $appStore.updateLikeItems(items.filter((item) => item.like))
}
// console.log(classifications, items)
</script>

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
              <div class="text">{{ item.text }}</div>
            </div>
          </div>
        </div>
      </template>
    </van-tree-select>
  </div>
</template>
<style>
</style>
