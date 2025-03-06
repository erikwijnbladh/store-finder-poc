import Storyblok from '@/plugins/storyblok'

export default {
  async getStores(language = 'sv_se') {
    try {
      const response = await Storyblok.get('cdn/stories', {
        starts_with: `${language}/stores/`,
        version: 'published'
      })
      return response.data.stories
    } catch (error) {
      console.error('Error fetching stores:', error)
      return []
    }
  },
  
  async getStoreFinderPage(language = 'sv_se') {
    try {
      const response = await Storyblok.get(`cdn/stories/${language}/store-finder`, {
        version: 'published'
      })
      return response.data.story
    } catch (error) {
      console.error('Error fetching store finder page:', error)
      return null
    }
  }
} 