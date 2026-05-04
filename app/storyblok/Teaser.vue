  <script setup>                                                                                                                                                                                                                              
  defineProps({ blok: Object })
  </script>

  <template>                                                                                                                                                                                                                                  
    <div v-editable="blok" class="text-center">
      <h2 class="text-3xl font-semibold text-gray-700">{{ blok.headline }}</h2>                                                                                                                                                               
    </div>                                                                                                                                                                                                                                    
  </template>