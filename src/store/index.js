import { createStore } from 'vuex'
import api from '@/services/api'

export default createStore({
  state: {
    stores: [],
    storeFinderPage: null,
    loading: false,
    error: null,
    selectedStore: null,
    filters: {
      searchQuery: '',
      category: ''
    },
    currentLanguage: 'sv_se',
    availableLanguages: [
      { code: 'sv_se', name: 'Svenska' },
      { code: 'en_gb', name: 'English' },
    ]
  },
  mutations: {
    SET_STORES(state, stores) {
      state.stores = stores
    },
    SET_STORE_FINDER_PAGE(state, page) {
      state.storeFinderPage = page
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    SET_SELECTED_STORE(state, store) {
      state.selectedStore = store
    },
    SET_FILTER(state, { key, value }) {
      state.filters[key] = value
    },
    SET_LANGUAGE(state, language) {
      state.currentLanguage = language;
    }
  },
  actions: {
    async fetchStores({ commit, state }) {
      commit('SET_LOADING', true)
      try {
        const stores = await api.getStores(state.currentLanguage)
        commit('SET_STORES', stores)
      } catch (error) {
        console.error('Error fetching stores:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async fetchStoreFinderPage({ commit, state }) {
      commit('SET_LOADING', true)
      try {
        const page = await api.getStoreFinderPage(state.currentLanguage)
        commit('SET_STORE_FINDER_PAGE', page)
      } catch (error) {
        console.error('Error fetching store finder page:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    selectStore({ commit }, store) {
      commit('SET_SELECTED_STORE', store)
    },
    updateFilter({ commit }, { key, value }) {
      commit('SET_FILTER', { key, value })
    },
    changeLanguage({ commit, dispatch }, language) {
      commit('SET_LANGUAGE', language);
      dispatch('fetchStores');
      dispatch('fetchStoreFinderPage');
    }
  },
  getters: {
    filteredStores(state) {
      let result = [...state.stores]
      
      if (state.filters.searchQuery) {
        const searchLower = state.filters.searchQuery.toLowerCase()
        result = result.filter(store => 
          store.content?.Name?.toLowerCase().includes(searchLower) || 
          store.content?.Address?.toLowerCase().includes(searchLower) ||
          store.content?.City?.toLowerCase().includes(searchLower)
        )
      }
      
      if (state.filters.category) {
        result = result.filter(store => 
          store.content?.Category === state.filters.category
        )
      }
      
      return result
    }
  }
}) 