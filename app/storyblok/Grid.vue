                  
  <script setup>
  defineProps({ blok: Object })
  </script>

 <template>                                                                                                                                                                                                                                  
    <div v-editable="blok" class="grid gap-6 md:grid-cols-3">
      <StoryblokComponent v-for="column in blok.columns" :key="column._uid" :blok="column" />                                                                                                                                                 
    </div>                                                                                                                                                                                                                                    
  </template>