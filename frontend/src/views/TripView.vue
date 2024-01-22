<script setup>
</script>

<template>
 <div class="pt-16">
    <h1 class="text-3xl font-semibold mb-4">
      Waiting on driver...
    </h1>
    
      <div class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">
        <div class="bg-white px-4 pt-5 sm:px-6">
          <div>
            <GMapMap ref="gMap" :zoom="14" style="width: 100%; height: 256px;">
            </GMapMap>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 text-right sm:px-6"> 
            <span>When a driver accepts the trip, their info will appear here.</span>
          </div>
      </div>
  </div>
</template>
