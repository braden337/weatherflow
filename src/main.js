require("babel-polyfill");
import moment from "moment";
import Vue from "vue/dist/vue.esm.js";

// Helper functions
const roundHundredths = x => Math.round(x * 100) / 100;

const kelvin = t => roundHundredths(t);
const celsius = t => roundHundredths(t - 273.15);
const fahrenheit = t => roundHundredths(celsius(t) * 9 / 5 + 32);

// if a temperature was missing from the forecast API,
// it will be -1 and we will fill it with dashes
const dashify = x => (x == -1 ? "--" : x);

const temperatureFunctions = { kelvin, celsius, fahrenheit };

// fetch options
const HEADERS = {
  headers: {
    "content-type": "application/json"
  }
};

const CREDENTIALS = {
  credentials: "same-origin"
};

const POST = {
  method: "POST"
};

// Vue instance
var app = new Vue({
  el: "#app",
  data: {
    city: "",
    temperature_units:
      window.localStorage.getItem("temperature_units") || "celsius",
    forecasts: [],
    predictions: [],
    error: "",
    cityInput: null
  },
  created: function() {
    window
      .fetch("/forecasts", { ...CREDENTIALS })
      .then(res => res.json())
      .then(forecasts => {
        this.forecasts = this.forecasts.concat(forecasts);
      });
  },
  mounted: function() {
    this.cityInput = document.getElementById("city");
    if (window.innerWidth > 992) {
      // only focus if "maybe" we're in a desktop sized browser
      this.cityInput.focus();
    }
  },
  computed: {
    descendingForecasts: function() {
      return Array.from(this.forecasts).reverse();
    },
    units: function() {
      let degree_symbol = !this.kelvin ? "°" : " ";
      return degree_symbol + this.temperature_units.toUpperCase()[0];
    },
    celsius: function() {
      return this.temperature_units === "celsius";
    },
    fahrenheit: function() {
      return this.temperature_units === "fahrenheit";
    },
    kelvin: function() {
      return this.temperature_units === "kelvin";
    }
  },
  watch: {
    temperature_units: function(newUnits) {
      window.localStorage.setItem("temperature_units", newUnits);
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
    getPredictions: async function() {
      if (this.city) {
        let city = this.city;
        this.city = "";
        this.cityInput.blur();

        this.error = "";

        let body = JSON.stringify({ city });

        let { predictions, error } = await (await window.fetch("/cities", {
          ...HEADERS,
          ...CREDENTIALS,
          ...POST,
          body
        })).json();

        if (typeof error !== "undefined") {
          this.error = error;
        } else {
          this.predictions = predictions;
        }
      }
    },
    getForecast: async function(e) {
      this.forecasts.push({
        city: e.target.innerText,
        low: "⏳",
        high: "⏳",
        pop: "⏳",
        created_at: Date.now()
      });

      // This finds the index of the clicked button in the list group
      const whichCity = [...e.target.parentNode.children].indexOf(e.target);

      let body = JSON.stringify({ prediction: this.predictions[whichCity] });

      this.predictions = [];

      let { forecast, error } = await (await window.fetch("/forecasts", {
        ...HEADERS,
        ...CREDENTIALS,
        ...POST,
        body
      })).json();

      this.forecasts.pop();
      if (forecast) {
        this.forecasts.push(forecast);
      } else {
        this.error = forecast.error;
      }
    }
  },
  filters: {
    percentage: p => dashify(p) + "%",
    date: seconds => moment(seconds).fromNow()
  }
});
