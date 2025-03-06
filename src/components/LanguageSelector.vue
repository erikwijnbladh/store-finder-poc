<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';

const store = useStore();
const router = useRouter();
const route = useRoute();

const currentLanguage = computed(() => store.state.currentLanguage);
const availableLanguages = computed(() => store.state.availableLanguages);

const changeLanguage = (language) => {
  // If language changed, navigate to the same page but with new language code
  if (language !== currentLanguage.value) {
    const currentPath = route.fullPath;
    const newPath = currentPath.replace(`/${currentLanguage.value}/`, `/${language}/`);
    
    // First update the store to reload content
    store.dispatch('changeLanguage', language);
    
    // Then update the URL (without triggering another content reload)
    router.push(newPath);
  }
};
</script>

<template>
  <div class="language-selector">
    <select 
      v-model="currentLanguage" 
      @change="changeLanguage($event.target.value)"
      class="bg-white rounded-md border border-gray-300 py-2 px-3 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
    >
      <option 
        v-for="language in availableLanguages" 
        :key="language.code" 
        :value="language.code"
      >
        {{ language.name }}
      </option>
    </select>
  </div>
</template> 