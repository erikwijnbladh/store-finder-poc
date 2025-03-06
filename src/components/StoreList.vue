<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import StoreCard from './StoreCard.vue'

const store = useStore()
const stores = computed(() => store.getters.filteredStores)
const loading = computed(() => store.state.loading)
</script>

<template>
  <div class="h-full overflow-y-auto">
    <div class="sticky top-0 bg-gray-100 p-4 border-b border-gray-200 text-gray-700 font-medium text-sm">
      <span v-if="stores.length > 0">{{ stores.length }} store{{ stores.length !== 1 ? 's' : '' }} found</span>
      <span v-else>No stores found</span>
    </div>
    
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
    </div>
    
    <div v-else-if="stores.length === 0" class="flex flex-col items-center justify-center py-20 text-gray-700 p-8">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-center font-medium">No stores found matching your criteria.</p>
      <p class="text-center text-sm mt-1">Try adjusting your filters or search term.</p>
    </div>
    
    <template v-else>
      <!-- Single column on mobile, multi-column on larger screens -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x md:border-t md:border-gray-200">
        <StoreCard 
          v-for="storeItem in stores" 
          :key="storeItem.id" 
          :store-item="storeItem"
        />
      </div>
    </template>
  </div>
</template> 