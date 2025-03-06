import StoryblokClient from 'storyblok-js-client'

const Storyblok = new StoryblokClient({
  accessToken: '9QUSOPI7wtnQBZo7m4rJvQtt', // Replace with your actual token
  cache: {
    clear: 'auto',
    type: 'memory'
  }
})

export default Storyblok 