<template>
  <img
    :src="currentSrc"
    :alt="alt"
    :class="imageClass"
    @error="handleImageError"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { DEFAULT_PRODUCT_IMAGE } from '@/utils/constants';

const props = defineProps<{
  src?: string;
  alt: string;
  imageClass?: string;
}>();

const currentSrc = ref(props.src || DEFAULT_PRODUCT_IMAGE);

const handleImageError = () => {
  if (currentSrc.value !== DEFAULT_PRODUCT_IMAGE) {
    currentSrc.value = DEFAULT_PRODUCT_IMAGE;
  }
};

onMounted(() => {
  if (!props.src || props.src.startsWith('data:')) {
    currentSrc.value = DEFAULT_PRODUCT_IMAGE;
  }
});
</script> 