<template>
  <div class="page">
    <h1>Календарь</h1>
    <div class="calendar">
      <Calendar />
    </div>
  </div>
</template>

<script setup lang="ts">
import Calendar from "@/components/Calendar.vue";
</script>

<style scoped>
.page {
  width: 300px;
  margin: 0 auto;
  text-align: center;
}
</style>
