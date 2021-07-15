<template>
  <div class="menu-create">
    <create-or-edit :is-edit="false" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import createOrEdit from './components/createOrEdit.vue'

export default Vue.extend({
  name: 'MenuCreate',
  components: {
    createOrEdit
  },
  data () {
    return {}
  }
})
</script>

<style></style>
