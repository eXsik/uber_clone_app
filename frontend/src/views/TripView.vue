<script setup>
import { useLocationStore } from '@/stores/location';
import { useTripStore } from '@/stores/trip';
import { onMounted, ref } from 'vue';
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import router from '@/router';

const location = useLocationStore();
const trip = useTripStore();

const title = ref('Waiting on driver...');
const message = ref('When a driver accepts the trip, their info will appear here.');

const currentIcon = {
  url: 'https://openmoji.org/data/color/svg/1F920.svg',
  scaledSize: {
    width: 32,
    height: 32
  }
};

const driverIcon = {
  url: 'https://openmoji.org/data/color/svg/1F698.svg',
  scaledSize: {
    width: 24,
    height: 24
  }
}

onMounted(async () => {
  await location.updateCurrentLocation()

  let echo = new Echo({
    broadcaster: 'pusher',
    key: 'mykey',
    cluster: 'mt1',
    wsHost: window.location.hostname,
    wsPort: 6001,
    forceTLS: false,
    disableStats: true,
    enabledTransports: ['ws', 'wss']
  })
  echo.channel(`passenger_${trip.user_id}`)
    .listen('TripAccepted', (event) => {
      trip.$patch(event.trip);
      title.value = 'A driver is on the way!'
      title.message = `${event.trip.driver?.user?.name} is coming in a ${event.trip.driver?.year} ${event.trip.driver?.color} ${event.trip.driver?.make} ${event.trip.driver?.model} with a license plate ${event.trip.driver?.license_plate} to pick you up!`
    })
    .listen('TripLocationUpdated', (event) => {
      trip.$patch(event.trip);
    })
    .listen('TripStarted', (event) => {
      trip.$patch(event.trip);
      location.$patch({
        currentLocation: {
          geometry: event.trip.destination
        }
      })
      
      title.value = "You're on your way!";
      message.value = `You are headed to ${event.trip.destination_name}`;
    })
    .listen('TripEnded', (event) => {
      trip.$patch(event.trip);

      title.value = "You've arrived!";
      message.value = `Hope you enjoyed your ride with ${event.trip.driver.user.name}`;
      
      setTimeout(() => {
        trip.reset();
        location.reset();

        router.push({
          name: 'landing'
        })
      }, 8000);
    })
});
</script>

<template>
  <div class="pt-16">
    <h1 class="text-3xl font-semibold mb-4">
      {{ title }}
    </h1>

    <div class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">
      <div class="bg-white px-4 pt-5 sm:px-6">
        <div>
          <GMapMap ref="gMap" :zoom="14" :center="location.currentLocation.geometry" style="width: 100%; height: 256px;">
            <GMapMarker :position="location.currentLocation.geometry" :icon="currentIcon"></GMapMarker>
            <GMapMarker v-if="trip.driver_location" :position="trip.driver_location" :icon="driverIcon"></GMapMarker>

          </GMapMap>
        </div>
      </div>
      <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
        <span>{{ message }}</span>
      </div>
    </div>
  </div>
</template>
