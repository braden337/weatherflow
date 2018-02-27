// Helper functions
const kelvin = t => t;
const celsius = t => t - 273.15;
const fahrenheit = t => Math.round(celsius(t) * 9 / 5 + 32, 2);
const dashify = x => (x == -1 ? "--" : x);

const temperatureFunctions = { kelvin, celsius, fahrenheit };

// Vue instance
var app = new Vue({
  el: "#app",
  data: {
    city: "",
    temperature_units: "celsius",
    forecasts: []
  },
  created: function() {
    fetch("/forecast", {
      credentials: "same-origin"
    })
      .then(res => res.json())
      .then(forecasts => {
        this.forecasts = this.forecasts.concat(forecasts);
      });
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
      if (typeof t == "number") {
        return temperatureFunctions[this.temperature_units](t);
      }
      return t;
    },
    getForecast: function() {
      if (this.city) {
        let city = this.city;
        this.city = "";
        let last_forecast = this.forecasts.push({
          city,
          low: "⏳",
          high: "⏳",
          pop: "⏳",
          created_at: Date.now()
        });
        fetch("/forecast", {
          method: "POST",
          body: JSON.stringify({ city }),
          headers: {
            "content-type": "application/json"
          },
          credentials: "same-origin"
        })
          .then(res => res.json())
          .then(data => {
            this.forecasts.pop();
            if (!data.error) {
              this.forecasts.push(data);
            } else {
              console.error(data.error);
            }
          });
      }
    }
  },
  filters: {
    percentage: p => dashify(p) + "%",
    date: seconds => moment(seconds).fromNow()
  }
});
