<template>
  <div class="carousel-container">
    <div class="header">
      <ul class="navigation">
        <li v-for="(item, index) in list" :key="index" class="nav-item" @click="clickNavItem(index)">
          {{ item.name }}
        </li>
        <div class="plan"></div>
      </ul>
    </div>
    <!-- 内容区域 -->
    <div id="bounded-flick" class="flicker container margin">
      <ul class="carousel">
        <li v-for="(cl, index) in list" :key="index" class="draggable carousel-item">
          <div v-for="item in cl.children" :key="item.imgPath" class="item" @click="clickItem(item)">
            <!-- <div class="index" v-if="item.index">{{ item.index }}</div> -->
            <!-- <div class="like">
              <van-icon v-if="!item.like" name="like-o" />
              <van-icon v-else name="like" color="var(--app-theme-color)" />
            </div> -->
            <div class="img">
              <img :src="item.imgPath" alt="" />
            </div>
            <!-- <van-image :src="item.imgPath" lazy-load class="img" fit="cover" position="center">
              <template v-slot:loading>
                <van-loading type="spinner" size="20" />
              </template>
            </van-image> -->
            <!-- <div class="name" v-if="item.name">{{ item.name }}</div> -->
          </div>
        </li>
      </ul>
    </div>
    <!-- 导航按钮 -->
    <div class="controls" v-if="showControls">
      <button class="control-button prev" @click="slideTo(activeIndex - 1)">Prev</button>
      <button class="control-button next" @click="slideTo(activeIndex + 1)">Next</button>
    </div>
  </div>
</template>

<script setup>
import { toRefs, reactive, onMounted, watch } from 'vue'
import { animate, createDraggable, utils } from 'animejs'
const props = defineProps({
  list: {
    type: Array,
    required: true,
    default: () => []
  },
  active: {
    type: [Number, String],
    required: true,
    default: 0
  },
  showControls: {
    type: Boolean,
    default: false
  }
})
const state = reactive({
  boundedFlicker: null,
  boundedFlickLength: 0,
  boundedFlickWidth: 280 + 10, //定义每个轮播项的宽度（280px内容 + 10px间距）
  planAnimation: null,
  activeIndex: 0
})
const { activeIndex } = toRefs(state)
const emit = defineEmits(['update:active'])

onMounted(() => {
  state.boundedFlickWidth = utils.get('.carousel-container', 'width', false)
  utils.set(['.carousel-item', '#bounded-flick'], {
    width: `${state.boundedFlickWidth}`
    // height: `${state.boundedFlickWidth}`
  })
  // 创建进度条动画
  /**
   * animate() 方法不解析从 CSS 样式声明中声明的转换，并且转换属性必须直接在元素的内联样式中设置。您可以使用内置的
   * utils.set()
   * 函数来独立设置您的转换值，然后再动画化元素，并定义它们必须设置的顺序。
   */
  utils.set('.plan', { width: `${100 / props.list.length}%`, left: '0%', transformOrigin: 'center' })
  state.planAnimation = animate('.plan', {
    autoplay: false,
    left: '100%',
    ease: 'linear' //如果想要等比动画，这里一定要设置匀速！！！！
  })
  // 创建可拖拽的轮播容器
  state.boundedFlicker = createDraggable('#bounded-flick .carousel', {
    // Array<Number> ([top, right, bottom, left]) 设置X轴可拖动范围
    container: [0, 0, 0, -state.boundedFlickWidth * (props.list.length - 1)],
    y: false, // 禁止垂直拖动
    dragSpeed: 1.5,
    /**
     * 将两个轴或一个特定轴的最终值四舍五入到最接近的指定增量。
     * 如果提供一个 Array 作为增量，它将从数组中选择最接近的值
     */
    snap: state.boundedFlickWidth, // 拖动时以290px为单位吸附（实现分页效果）
    // 更新时
    onUpdate: (e) => {
      getActiveIndex(e.x)
    }
  })

  // 设置轮播容器的总宽度（所有轮播项宽度之和）
  utils.set('#bounded-flick .carousel', {
    width: `${props.list.length * state.boundedFlickWidth}`
  })

  // 初始化下标位置
  clickNavItem(props.active, true)
  listenDraggableScroll()
})
// 获取当前位置下标
const getActiveIndex = (x) => {
  const index = utils.round(x / -state.boundedFlickWidth, 0)
  state.activeIndex = index
  emit('update:active', index)
  updateActiveIndexClass({ index, x })
}

// 事件-导航点击
const clickNavItem = (index, isInit = false) => {
  console.log(index)
  // 根据坐标计算当前位置下标
  animate(state.boundedFlicker, {
    x: -index * state.boundedFlickWidth,
    duration: isInit ? 0 : 500,
    ease: 'out(4)'
  })
}

// 事件-滑动到指定索引
const slideTo = (targetIndex) => {
  const clampedIndex = Math.max(0, Math.min(targetIndex, props.list.length - 1))
  let x = utils.snap(-clampedIndex * state.boundedFlickWidth, state.boundedFlickWidth)
  animate(state.boundedFlicker, {
    x: x,
    duration: 500,
    ease: 'out(4)'
  })
}

// 根据当前下标移除并添加样式
const updateActiveIndexClass = ({ index, x }) => {
  // 控制导航栏的文字效果动画
  utils.$('.nav-item').forEach((el, i) => {
    if (index === i) {
      animate(el, {
        fontWeight: '600',
        scale: 1.2,
        y: -2,
        duration: 500,
        ease: 'out(4)'
      })
    } else {
      animate(el, {
        y: 0,
        scale: 1,
        fontWeight: '200',
        duration: 500,
        ease: 'out(4)'
      })
    }
  })

  // 根据当前拖拽距离同步进度条动画的播放时间，默认动画时间为1000ms
  state.planAnimation.seek((x / (-state.boundedFlickWidth * props.list.length)) * 1000)
}

// 监听滚动条
const listenDraggableScroll = () => {
  let timer = null
  utils.$('.draggable').forEach((el) => {
    el.addEventListener('scroll', (e) => {
      if (timer) clearTimeout(timer)
      // 正在滚动视图时，禁止拖拽boundedFlicker，设置x轴拖着禁用
      state.boundedFlicker.disable()
      timer = setTimeout(() => {
        console.log('scroll')
        state.boundedFlicker.enable()
      }, 500)
    })
  })
}
</script>

<style scoped>
.carousel-container {
  --color: #5a5a5a;
  --color1: #b09def;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}
.header {
  margin: 0.75rem;
}
.carousel-container ul {
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  height: 100%;
}
.container {
  overflow: hidden;
  position: relative;
  flex-grow: 1;
}
.margin {
  border-radius: 0px;
  padding-right: 0px;
}
.carousel-item {
  color: white;
  margin-right: 0px;
  flex-shrink: 0;
  --img-width: clamp(5rem, calc(100vw / 2 - 1px), 200px);
  box-sizing: border-box;
  display: grid;
  grid-gap: 0.5px;
  grid-template-columns: repeat(auto-fill, var(--img-width));
  align-content: start; /* 让网格在容器内靠上对齐 */
  overflow-x: hidden;
  overflow-y: auto;
}
.carousel-item::-webkit-scrollbar {
  width: 0;
  opacity: 0;
}
.carousel-item:nth-child(2n) {
  /* background-color: var(--color1) !important; */
}
.carousel-item:last-child {
  margin-right: 0;
}
.carousel-item .item {
  width: var(--img-width);
  height: var(--img-width);
  position: relative;
  border-right: 0.8px solid #eee;
  border-bottom: 0.8px solid #eee;
}
.carousel-item .item .img {
}
.carousel-item .item .img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.carousel-item .item .text {
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
.carousel-item .item .index,
.carousel-item .item .like {
  position: absolute;
  top: 0;
  z-index: 1;
  opacity: 0.9;
}
.carousel-item .item .index {
  left: 0;
  background-color: var(--app-theme-color);
  color: #fff;
  min-width: 1rem;
  height: 1rem;
  text-align: center;
  font-size: 0.68rem;
  line-height: 1.1rem;
  font-weight: 200;
  padding: 0 0.2rem;
  box-sizing: border-box;
}
.carousel-item .item .like {
  right: 0px;
  color: var(--app-theme-color);
}
.controls {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.control-button {
  border: none;
  color: white;
  font-weight: 200;
  cursor: pointer;
}
.control-button:nth-child(2n) {
  background-color: var(--color);
}
.control-button:active {
  opacity: 0.8;
}
.navigation {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
  flex-wrap: nowrap;
}
.nav-item {
  padding: 10px 0;
  flex: 1;
  cursor: pointer;
  user-select: none;
  /* color: #373737; */
  text-align: center;
  font-size: 14px;
  white-space: nowrap;
}
.plan {
  position: absolute;
  width: 2rem;
  height: 0.2rem;
  background: var(--color);
  z-index: -1;
  left: 0;
  bottom: 0;
  transform: scaleX(0.8);
}
</style>
