<template>
  <section class="q-pa-md">
    <div class="container">
      <div class="text-h6 text-weight-bold q-mb-xs">{{ props.title }}</div>
      <div class="text-body1 text-grey-8">
        <slot>
          {{ content }}
        </slot>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  content?: string;
}
const props = defineProps<Props>();
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
}
</style>
