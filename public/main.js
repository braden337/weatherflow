/* global Vue fetch moment */
// Helper functions
const kelvin = t => t;
const celsius = t => t - 273.15;
const fahrenheit = t => celsius(t) * 9 / 5 + 32;
const dashify = x => (x == -1 ? "--" : x);
const roundHundredths = x => Math.round(x * 100) / 100;

const temperatureFunctions = { kelvin, celsius, fahrenheit };

// Global variables
const FETCH_OPTIONS = {
  headers: {
    "content-type": "application/json"
  },
  credentials: "same-origin"
};

let cityInput;

// Vue instance
var app = new Vue({
  el: "#app",
  error: "",
  data: {
    city: "",
    temperature_units: "celsius",
    forecasts: [],
    cities: []
  },
  created: function() {
    fetch("/forecasts", {
      credentials: "same-origin"
    })
      .then(res => res.json())
      .then(forecasts => {
        this.forecasts = this.forecasts.concat(forecasts);
      });
  },
  mounted: function() {
    cityInput = document.getElementById("city");
    cityInput.focus();
  },
  computed: {
    descendingForecasts: function() {
      return Array.from(this.forecasts).reverse();
    },
    units: function() {
      let degree_symbol = this.temperature_units != "kelvin" ? "°" : " ";
      return degree_symbol + this.temperature_units.toUpperCase()[0];
    }
  },
  methods: {
    convertTemperature: function(t) {
      t = dashify(t);
      if (typeof t === "number") {
        t = temperatureFunctions[this.temperature_units](t);
        t = roundHundredths(t);
      }
      return t;
    },
    getForecast: async function(e) {
      this.forecasts.push({
        city: e.target.innerText,
        low: "⏳",
        high: "⏳",
        pop: "⏳",
        created_at: Date.now()
      });

      const whichCity = [...e.target.parentNode.children].indexOf(e.target);

      Object.assign(FETCH_OPTIONS, {
        method: "POST",
        body: JSON.stringify({ prediction: this.cities[whichCity] })
      });

      this.cities = []

      let place = await (await fetch("/coordinates", FETCH_OPTIONS)).json();

      console.log(place);
      Object.assign(FETCH_OPTIONS, {
        method: "POST",
        body: JSON.stringify({ place })
      });

      let forecast = await (await fetch("/forecasts", FETCH_OPTIONS)).json();
      this.forecasts.pop();
      this.forecasts.push(forecast);
    },
    getCities: async function() {
      if (this.city) {
        let city = this.city;
        this.city = "";
        cityInput.blur();

        Object.assign(FETCH_OPTIONS, {
          method: "POST",
          body: JSON.stringify({ city })
        });

        let { predictions } = await (await fetch(
          "/cities",
          FETCH_OPTIONS
        )).json();

        this.cities = predictions;

        // console.log(place);
        // Object.assign(FETCH_OPTIONS, {
        //   method: "POST",
        //   body: JSON.stringify({ place })
        // });

        // let forecast = await (await fetch("/forecasts", FETCH_OPTIONS)).json();

        // console.log(forecast);
        // .then(res => res.json())
        // .then(data => {
        //   this.forecasts.pop();
        //   if (!data.error) {
        //     this.error = "";
        //     this.forecasts.push(data);
        //   } else {
        //     this.error = data.error;
        //     console.error(data.error);
        //   }
        // });
      }
    }
  },
  filters: {
    percentage: p => dashify(p) + "%",
    date: seconds => moment(seconds).fromNow()
  }
});
