import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import LandingView from '@/views/LandingView.vue'
import axios from 'axios'
import LocationView from '@/views/LocationView.vue'
import MapView from '@/views/MapView.vue'
import TripViewVue from '@/views/TripView.vue'
import StandbyViewVue from '@/views/StandbyView.vue'
import DriverViewVue from '@/views/DriverView.vue'
import DrivingViewVue from '@/views/DrivingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/landing',
      name: 'landing',
      component: LandingView
    }, 
    {
      path: '/location',
      name: 'location',
      component: LocationView
    },
    {
      path: '/map',
      name: 'map',
      component: MapView
    },    
    {
      path: '/trip',
      name: 'trip',
      component: TripViewVue
    }, 
    {
      path: '/standby',
      name: 'standby',
      component: StandbyViewVue
    }, 
    {
      path: '/driver',
      name: 'driver',
      component: DriverViewVue
    },  
    {
      path: '/driving',
      name: 'driving',
      component: DrivingViewVue
    },
  ]
})

router.beforeEach((to, from) => {
  if (to.name === 'login') {
    return true;
  }

  if (!localStorage.getItem('token')) {
    return {
      name: 'login'
    }
  }

  checkTokenAuthenticity();
})

const checkTokenAuthenticity = () => {
  axios.get('http://localhost/api/user', {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    }
  })
  .then(() => {})
  .catch((error) => {
    localStorage.removeItem('token');

    router.push({
      name: 'login',
    }); 
  })  
};

export default router
