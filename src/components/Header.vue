<template>
    <component :is="type" :profile="profile"></component>
</template>
<script>
import HeaderStandard from './headers/HeaderStandard.vue'
import HeaderInit from './headers/HeaderInit.vue'

export default {
  name: 'Header',
  components: {
    HeaderStandard,
    HeaderInit
  },
  props: ['type', 'profile']
}
</script>