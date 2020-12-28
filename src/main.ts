import Vue from "vue";
import App from "./App.vue";
import Login from "./Login.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";

import { Neo4JAccessLayer } from "./api/Neo4jAccessLayer";
import { Component } from "vue-router/types/router";
import { DaemonController } from "./api/applications/DaemonController";

Vue.config.productionTip = false;

console.log("Launching Olympus");

// Test Neo4J Connection
// If connected, render the app view, otherwise ask for a login
Neo4JAccessLayer.connect();
const neo4jAl: Neo4JAccessLayer = Neo4JAccessLayer.getInstance();

let el: Component;

neo4jAl
  .testConnection()
  .then((res: any) => {
    // Successful connection
    router.replace("/main");
    el = App;
  })
  .catch(err => {
    // Cannot connect to the Neo4j instance
    console.warn("Connection to Neo4j failed.", err);
    router.replace("/login");
    el = Login;
  })
  .finally(() => {
    new Vue({
      router: router,
      vuetify,
      render: h => h(el)
    }).$mount("#app");
  });

// Launch the Tag Daemon
const daemon: DaemonController = DaemonController.getInstance();
daemon.run();
