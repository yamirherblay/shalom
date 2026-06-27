<template>
  <div v-if="showMarquee" class="marquee-bar" :class="{ absolute }">
    <div class="marquee-content column items-center q-gutter-xs">
      <q-btn
        v-if="showButton && buttonLabel"
        dense
        flat
        class="bg-dark text-amber"
        @click="$emit('button-click')"
      >{{ buttonLabel }}</q-btn>
      <div class="marquee-track" :key="currentMessage">
        <span>{{ currentMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = withDefaults(defineProps<{
  message: string;
  messages?: string[];
  showButton?: boolean;
  buttonLabel?: string;
  absolute?: boolean;
  showMarquee?: boolean;
}>(), {
  messages: () => [],
});

defineEmits<{
  (e: 'button-click'): void;
}>();

const all = computed(() =>
  props.messages.length ? props.messages : [props.message],
);

const index = ref(0);
const currentMessage = computed(() => all.value[index.value % all.value.length]);

let timer: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  if (all.value.length > 1) {
    timer = setInterval(() => {
      index.value++;
    }, 5000);
  }
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>
.marquee-bar {
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  background: #2D4A3B;
  color: #E8A838;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 8px;
  z-index: 2;
}
.marquee-bar.absolute {
  position: absolute;
}

.marquee-track {
  white-space: nowrap;
  display: inline-block;
  padding-left: 100%;
  font-weight: 500;
  font-size: 0.95rem;
  animation: marquee-scroll 15s linear infinite;
  transition: opacity 0.4s ease;
}

@keyframes marquee-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}

@media (prefers-reduced-motion: reduce) {
  .marquee-track {
    animation: none;
    padding-left: 0;
  }
}
</style>
