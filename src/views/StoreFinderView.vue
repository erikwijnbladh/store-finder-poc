<script setup>
import { onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import StoreFilter from '@/components/StoreFilter.vue'
import StoreList from '@/components/StoreList.vue'
import LanguageSelector from '@/components/LanguageSelector.vue'

const store = useStore()
const route = useRoute()
const currentLanguage = computed(() => route.params.lang || 'sv_se')
const isLoading = computed(() => store.state.loading)

onMounted(async () => {
  // Ensure the store language matches the URL
  if (store.state.currentLanguage !== currentLanguage.value) {
    store.dispatch('changeLanguage', currentLanguage.value)
  } else {
    // If language already matches, still need to load content
    await store.dispatch('fetchStores')
    await store.dispatch('fetchStoreFinderPage')
  }
})
</script>

<template>
  <div class="min-h-screen w-full flex flex-col bg-gray-50">
    <div class="bg-white shadow">
      <div class="px-4 py-3 flex justify-between items-center">
        <h1 class="text-xl font-bold text-gray-900">Store Finder</h1>
        <LanguageSelector />
      </div>
    </div>
    
    <div class="flex-1 overflow-hidden">
      <!-- Loading overlay -->
      <div v-if="isLoading" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent"></div>
      </div>
      
      <div class="px-4 py-4 max-w-7xl mx-auto">
        <StoreFilter class="mb-4" />
        
        <!-- Store list -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <StoreList />
        </div>
      </div>
    </div>
  </div>
</template> 