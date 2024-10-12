import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const appStore = defineStore('app', () => {
    const likeCount = ref(0)
    const likeItems = ref([])
    const getLikeCount = () => {
        return localStorage.getItem('like_count') || null
    }
    const getLikeItems = () => {
        return JSON.parse(localStorage.getItem('like_items')) || []
    }
    function updateLikeItems(items) {
        likeCount.value = items.length
        likeItems.value = items
        localStorage.setItem('like_count', items.length)
        localStorage.setItem('like_items', JSON.stringify(items))
    }

    return { likeCount, getLikeCount, getLikeItems, updateLikeItems }
})
