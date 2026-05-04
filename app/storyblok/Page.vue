<script setup>                                                                                                                                                                                                                              
  defineProps({ blok: Object })                                                                                                                                                                                                               
  </script>                                                                                                                                                                                                                                   
                                                                                                                                                                                                                                              
  <template>                                                                                                                                                                                                                                  
    <main v-editable="blok" class="max-w-5xl mx-auto px-4 py-12 space-y-16">
      <StoryblokComponent   
        v-for="b in blok.body"                                                                                                                                                                                                                
        :key="b._uid"         
        :blok="b"                                                                                                                                                                                                                             
      />          
    </main>                                                                                                                                                                                                                                   
  </template>