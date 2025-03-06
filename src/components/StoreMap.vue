<script setup>
import { onMounted, computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import 'leaflet/dist/leaflet.css'
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet'

const store = useStore()
const mapRef = ref(null)
const zoom = ref(6)
const center = ref([59.3293, 18.0686]) // Center of stockholm

const stores = computed(() => store.getters.filteredStores)
const selectedStore = computed(() => store.state.selectedStore)

// Center map on selected store
watch(selectedStore, (newStore) => {
  if (newStore && newStore.content?.Latitude && newStore.content?.Longitude) {
    center.value = [
      parseFloat(newStore.content.Latitude),
      parseFloat(newStore.content.Longitude)
    ]
    zoom.value = 12
  }
})

const selectStoreFromMap = (storeItem) => {
  store.dispatch('selectStore', storeItem)
}
</script>

<template>
  <div class="h-full w-full">
    <LMap
      ref="mapRef"
      :zoom="zoom"
      :center="center"
      :useGlobalLeaflet="false"
      class="h-full w-full"
    >
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      />

      <LMarker
        v-for="storeItem in stores"
        :key="storeItem.id"
        :lat-lng="[
          parseFloat(storeItem.content?.Latitude || 0),
          parseFloat(storeItem.content?.Longitude || 0)
        ]"
        @click="selectStoreFromMap(storeItem)"
      >
        <LPopup>
          <div class="p-2">
            <h3 class="text-lg font-medium text-gray-900">{{ storeItem.content?.Name }}</h3>
            <p class="text-sm text-gray-600">{{ storeItem.content?.Address }}</p>
            <p class="text-sm text-gray-600">{{ storeItem.content?.City }}, {{ storeItem.content?.State }}</p>
          </div>
        </LPopup>
      </LMarker>
    </LMap>
  </div>
</template>

<style scoped>
.store-map {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style> 