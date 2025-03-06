<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useStore } from 'vuex'
import HelloWorld from './components/HelloWorld.vue'

const route = useRoute()
const store = useStore()
const currentLanguage = computed(() => store.state.currentLanguage)
const isStoreFinder = computed(() => route.name === 'store-finder')

const getLocalizedPath = (path) => {
  return `/${currentLanguage.value}${path}`;
}
</script>

<template>
  <div class="h-screen w-screen flex flex-col">
    <header v-if="!isStoreFinder" class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        <div class="mt-4">

          <nav class="mt-4 flex justify-center lg:justify-start gap-4">
            <RouterLink :to="getLocalizedPath('/stores')" class="min-w-48 text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-md hover:bg-gray-50">Store Finder</RouterLink>
          </nav>
        </div>
      </div>
    </header>

    <main class="flex-1">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: #3b82f6;
  background-color: #eff6ff;
}

nav a.router-link-exact-active:hover {
  background-color: #eff6ff;
}

nav a {
  display: inline-block;
  transition: all 0.2s ease;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
