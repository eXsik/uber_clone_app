import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'

const getUserLocation = async () => {
  return new Promise((res, rej) => {
    navigator.geolocation.getCurrentPosition(res, rej)
  });
};

export const useLocationStore = defineStore('location', () => {
  const destination = reactive({
    name: '',
    address: '',
    geometry: {
      lat: null,
      lng: null
    }
  });

  const currentLocation = reactive({
    geometry: {
      lat: null,
      lng: null
    }
  });

  const updateCurrentLocation = async () => {
    const userLoaction = await getUserLocation();

    currentLocation.geometry = {
      lat: userLoaction.coords.latitude,
      lng: userLoaction.coords.longitude
    }
  };

  return { destination, currentLocation, updateCurrentLocation }
});
