<script setup>
import { useLocationStore } from '@/stores/location';
import { onMounted, ref } from 'vue';

const location = useLocationStore();
const gMap = ref('null');

const currentIcon = {
    url: 'https://openmoji.org/data/color/svg/1F698.svg',
    scaledSize: {
        width: 32,
        height: 32
    }
}

const destinationIcon = {
    url: 'https://openmoji.org/data/color/svg/1F920.svg',
    scaledSize: {
        width: 24,
        height: 24
    }
}

const updateMapBounds = (mapObject) => {
  let originPoint = new google.maps.LatLng(location.currentLocation.geometry),
        destinationPoint = new google.maps.LatLng(location.destination.geometry),
        latLngBounds = new google.maps.LatLngBounds();


    latLngBounds.extend(originPoint);
    latLngBounds.extend(destinationPoint);

    mapObject.fitBounds(latLngBounds);
};

onMounted(() => {
  gMap.value.$mapPromise.then((mapObject) => {
    updateMapBounds(mapObject);

    setInterval(async () => {
      // update the driver's current position and update map bounds
      await location.updateCurrentLocation();
      
      updateMapBounds(mapObject);
    }, 5000);
  });
});
</script>

<template>
  <div class="pt-16">
    <h1 class="text-3xl font-semibold mb-4">
      Driving to passanger...
    </h1>
    <div class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">
      <div class="bg-white px-4 pt-5 sm:px-6">
        <div>
          <GMapMap ref="gMap" :zoom="14" :center="location.currentLocation.geometry" style="width: 100%; height: 256px;">
            <GMapMarker :position="location.currentLocation.geometry" :icon="currentIcon"></GMapMarker>
            <GMapMarker :position="location.destination.geometry" :icon="destinationIcon" />
            current icon {{ location.currentLocation.geometry }}
            destination icon {{ location.destination.geometry }}
          </GMapMap>
        </div>
        <div class="mt-2">
          <p class="text-xl">Going to <strong>place</strong></p>
        </div>
      </div>
      <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
        <span>When a driver accepts the trip, their info will appear here.</span>
      </div>
    </div>
  </div>
</template>
