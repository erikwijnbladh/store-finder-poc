<script setup>
import { useStore } from 'vuex'
import { computed } from 'vue'

const store = useStore()
const props = defineProps({
  storeItem: {
    type: Object,
    required: true
  }
})

// Add this computed property to highlight the selected store
const isSelected = computed(() => 
  store.state.selectedStore?.id === props.storeItem.id
)

const selectStore = () => {
  store.dispatch('selectStore', props.storeItem)
}

// Create the optimal Google Maps URL for pinned locations
const googleMapsUrl = computed(() => {
  const storeName = props.storeItem.content?.Name || 'Store Location';
  
  // If we have coordinates, create the most precise pin URL possible
  if (props.storeItem.content?.Latitude && props.storeItem.content?.Longitude) {
    const lat = props.storeItem.content.Latitude;
    const lng = props.storeItem.content.Longitude;
    
    // This format uses three key parameters:
    // - ll: sets the map center at exact coordinates
    // - q: creates a search pin with the store name
    // - z: sets an appropriate zoom level (15 is good for street level)
    return `https://www.google.com/maps?ll=${lat},${lng}&q=${encodeURIComponent(storeName)}&z=15`;
  } else {
    // For locations without coordinates, construct the best address string we can
    const addressString = [
      props.storeItem.content?.Address,
      props.storeItem.content?.City,
      props.storeItem.content?.State,
      props.storeItem.content?.Zip
    ].filter(Boolean).join(', ');
    
    // Use the traditional maps/place format with the store name included
    return `https://www.google.com/maps/place/${encodeURIComponent(storeName)}/${encodeURIComponent(addressString)}`;
  }
})

// Create Google Maps Directions URL
const directionsUrl = computed(() => {
  const storeName = props.storeItem.content?.Name || 'Store Location';
  
  // For directions, we'll use coordinates if available for more precision
  if (props.storeItem.content?.Latitude && props.storeItem.content?.Longitude) {
    const lat = props.storeItem.content.Latitude;
    const lng = props.storeItem.content.Longitude;
    
    // Use the traditional directions format with store name as the destination name
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_name=${encodeURIComponent(storeName)}`;
  } else {
    const destination = [
      props.storeItem.content?.Address,
      props.storeItem.content?.City,
      props.storeItem.content?.State,
      props.storeItem.content?.Zip
    ].filter(Boolean).join(', ');
    
    // For address-based directions
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&destination_name=${encodeURIComponent(storeName)}`;
  }
})
</script>

<template>
  <div class="p-4 border-b border-gray-200 hover:bg-blue-50 transition duration-150">
    <h3 class="text-lg font-semibold text-gray-900">{{ storeItem.content?.Name }}</h3>
    <h4 class="text-base font-medium text-gray-800 capitalize">{{ storeItem.content?.Category }}</h4>
    
    <!-- Clickable address with enhanced Google Maps pin URL -->
    <a 
      :href="googleMapsUrl" 
      target="_blank" 
      rel="noopener noreferrer"
      class="block mt-3 text-blue-600 hover:text-blue-800 hover:underline"
    >
      <div class="flex items-start">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <div>
          <p>{{ storeItem.content?.Address }}</p>
          <p>{{ storeItem.content?.City }}, {{ storeItem.content?.State }} {{ storeItem.content?.Zip }}</p>
        </div>
      </div>
    </a>
    
    <div class="mt-4 flex flex-col space-y-2">
      <!-- Phone number -->
      <a 
        v-if="storeItem.content?.Phone" 
        :href="`tel:${storeItem.content?.Phone}`" 
        class="inline-flex items-center text-gray-700 hover:text-blue-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        {{ storeItem.content?.Phone }}
      </a>
      
      <!-- Email -->
      <a 
        v-if="storeItem.content?.Email" 
        :href="`mailto:${storeItem.content?.Email}`" 
        class="inline-flex items-center text-gray-700 hover:text-blue-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        {{ storeItem.content?.Email }}
      </a>
      
    </div>
  </div>
</template>

<style scoped>
.store-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: white;
}

.store-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #333;
}

.store-address, .store-contact, .store-hours {
  margin-bottom: 0.5rem;
}

.store-address p, .store-contact p, .store-hours p {
  margin: 0.2rem 0;
  color: #555;
}
</style> 