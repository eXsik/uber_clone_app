<script setup>
import http from '@/helpers/http';
import router from '@/router';
import { useLocationStore } from '@/stores/location';
import { useTripStore } from '@/stores/trip';
import { onMounted, onUnmounted, ref } from 'vue';

const location = useLocationStore();
const trip = useTripStore();

const gMap = ref('null');
const intervalRef = ref('null');

const title = ref('Driving to passanger...');

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

const handlePassangerPickUp = () => {
  http().post(`/api/trip/${trip.id}/start`)
    .then((response) => {
      title.value = "Travelling to destination...";
      location.$patch({
        destination: {
          name: response.data.destination_name,
          geometry: response.data.geometry
        }
      })

      trip.$patch(response.date);
    })
    .catch((error) => {
      console.error(error);
    });
};

const handleCompleteTrip = () => {
  http().post(`/api/trip/${trip.id}/end`)
    .then(() => {
      title.value = 'Trip completed!';

      trip.$patch(response.data);

      
      setTimeout(() => {
        trip.reset();
        location.reset();
  
        router.push({
          name: 'standby'
        })
      }, 3000);

    })
    .catch((error) => {
      console.error(error);
    });
};

const broadcastDriverLoocation = () => {
  http().post(`/api/trip/${trip.id}/location`, {
    driver_location: location.currentLocation.geometry
  })
    .then((response) => { })
    .catch((error) => {
      console.error(error);
    });
}

onMounted(() => {
  gMap.value.$mapPromise.then((mapObject) => {
    updateMapBounds(mapObject);

    intervalRef.value = setInterval(async () => {
      // update the driver's current position and update map bounds
      await location.updateCurrentLocation();

      // update the driver's position in the database
      broadcastDriverLoocation();

      updateMapBounds(mapObject);
    }, 5000);
  });
});

onUnmounted(() => {
  clearInterval(intervalRef.value);

  intervalRef.value = null;
});
</script>

<template>
  <div class="pt-16">
    <h1 class="text-3xl font-semibold mb-4">
      {{ title }}
    </h1>
    <div v-if="!trip.is_complete" class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">
      <div class="bg-white px-4 pt-5 sm:px-6">
        <div>
          <GMapMap ref="gMap" :zoom="14" :center="location.currentLocation.geometry" style="width: 100%; height: 256px;">
            <GMapMarker :position="location.currentLocation.geometry" :icon="currentIcon"></GMapMarker>
            <GMapMarker :position="location.destination.geometry" :icon="destinationIcon" />
          </GMapMap>
        </div>
        <div class="mt-2">
          <p class="text-xl">Going to <strong>place</strong></p>
        </div>
      </div>
      <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
        <button v-if="trip.is_started" @click="handleCompleteTrip"
          class="inline-flex justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none">
          Complete Trip
        </button>
        <button v-else @click="handlePassangerPickUp"
          class="inline-flex justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none">
          Passanger Picked Up
        </button>
      </div>
    </div>
    <div v-else class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">
      <div class="bg-white px-4 py-5 sm:p-6">
        <FinishedAnimationView />
      </div>
    </div>
  </div>
</template>
