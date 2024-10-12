<script setup>
import { reactive, ref, computed } from 'vue'
// 遍历获取 public/分类 下的文件目录
const modules = import.meta.glob('/public/分类/**')
const classifications = reactive([]) // 分类名
const items = reactive([]) // 图片
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
// 处理加工好的分类数据
const classificationsTree = computed(() => {
  return classifications.map((text) => {
    return {
      text,
      children: items.filter((item) => item.className === text)
    }
  })
})
console.log(classifications, items)
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
            <div v-for="item in cl.children" :key="item.imgPath" class="item">
              <div class="index" v-if="item.index">{{ item.index }}</div>
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
<style scoped>
.classify {
  --img-width: clamp(5rem, calc((100vw - 150px) / 2), 200px);
}
.right-content {
}
.items-box {
  padding: 1rem;
  display: grid;
  place-content: center;
  grid-gap: 0.8rem;
  grid-template-columns: repeat(auto-fill, var(--img-width));
}
.item {
  position: relative;
}
.item .img {
  width: var(--img-width);
  height: var(--img-width);
}
.item .text {
  text-align: center;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  /* 超出2行显示省略号 */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-break: break-all;
}
.item .index {
  position: absolute;
  top: 0;
  left: 0;
  background-color: var(--app-theme-color);
  color: #fff;
  width: 1rem;
  height: 1rem;
  text-align: center;
  font-size: 0.68rem;
  font-weight: 200;
  z-index: 5;
  opacity: 0.9;
}
</style>
