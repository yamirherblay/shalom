<template>
  <div v-if="showMarquee" class="marquee-bar" :class="{ absolute }">
    <div class="marquee-content column items-center q-gutter-xs">
      <q-btn
        v-if="showButton && buttonLabel"
        dense
        flat
        class="bg-grey-10 text-yellow"
        @click="$emit('button-click')"
        >{{ buttonLabel }}</q-btn
      >
      <div class="marquee-track">
        <span>{{ message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string;
  showButton?: boolean;
  buttonLabel?: string;
  absolute?: boolean;
  showMarquee?: boolean;
}>();

defineEmits<{
  (e: 'button-click'): void;
}>();
</script>

<style scoped>
.marquee-bar {
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(169, 168, 169, 0.92);
  color: #000;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  z-index: 2;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
.marquee-bar.absolute {
  position: absolute;
}

.marquee-track {
  white-space: nowrap;
  display: inline-block;
  padding-left: 100%;
  font-weight: 600;
  font-size: 1.125rem;
  animation: marquee-scroll 15s linear infinite;
}

@keyframes marquee-scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .marquee-track {
    animation: none;
    padding-left: 0;
  }
}
</style>
