<template>
  <div class="menu-create">
    <create-or-edit :is-edit="true" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import createOrEdit from './components/createOrEdit.vue'

export default Vue.extend({
  name: 'MenuEdit',
  components: {
    createOrEdit
  },
  data () {
    return {}
  }
})
</script>

<style></style>
