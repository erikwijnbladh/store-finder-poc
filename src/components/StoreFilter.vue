<script setup>
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const searchQuery = ref('')
const selectedCategory = ref('')

// Temporary model values to avoid immediate filtering while typing
const tempSearchQuery = ref('')

// Get unique categories from stores
const categories = computed(() => {
  const allStores = store.state.stores
  const uniqueCategories = [...new Set(allStores.map(store => store.content?.Category).filter(Boolean))]
  return uniqueCategories.sort()
})

// Debounce search to avoid too many filter operations while typing
let searchTimeout
const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    searchQuery.value = tempSearchQuery.value
    applyFilters()
  }, 300)
}

// Apply filters to the store
const applyFilters = () => {
  if (searchQuery.value) {
    store.dispatch('updateFilter', { key: 'searchQuery', value: searchQuery.value })
  } else {
    store.dispatch('updateFilter', { key: 'searchQuery', value: '' })
  }
  
  if (selectedCategory.value) {
    store.dispatch('updateFilter', { key: 'category', value: selectedCategory.value })
  } else {
    store.dispatch('updateFilter', { key: 'category', value: '' })
  }
}

// When category changes, update filters
const handleCategoryChange = (event) => {
  selectedCategory.value = event.target.value
  applyFilters()
}


onMounted(() => {
  // Initialize filters from store state if they exist
  if (store.state.filters.searchQuery) {
    tempSearchQuery.value = store.state.filters.searchQuery
    searchQuery.value = store.state.filters.searchQuery
  }
  
  if (store.state.filters.category) {
    selectedCategory.value = store.state.filters.category
  }
})
</script>

<template>
  <div class="bg-white p-4 rounded-lg shadow-md">
    <!-- Entirely vertical layout on mobile, horizontal on larger screens -->
    <div class="flex flex-col space-y-4">
      <!-- Search input with improved styling -->
      <div>
        <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search Stores</label>
        <div class="relative rounded-md shadow-sm">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </div>
          <input
            id="search"
            type="text"
            v-model="tempSearchQuery"
            @input="handleSearch"
            class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
            placeholder="Search by name, address, or city"
          />
        </div>
      </div>
      
      <!-- Category filter -->
      <div>
        <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Filter by Category</label>
        <select
          id="category"
          v-model="selectedCategory"
          @change="handleCategoryChange"
          class="block w-full py-3 pl-3 pr-10 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
        >
          <option value="">All Categories</option>
          <option 
            v-for="category in categories" 
            :key="category" 
            :value="category"
            class="py-1"
          >
            {{ category }}
          </option>
        </select>
      </div>
      
    </div>
    
    <!-- Horizontal layout on medium and larger screens -->
    <div class="hidden md:flex md:flex-row md:gap-4 md:mt-4">
      <!-- This content is for larger screens only, so we hide it on mobile -->
    </div>
  </div>
</template>

<style scoped>
.store-filter {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.filter-group {
  width: 100%;
}

.search-input, .category-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 1rem;
}

@media (min-width: 768px) {
  .store-filter {
    flex-direction: row;
  }
}
</style> 