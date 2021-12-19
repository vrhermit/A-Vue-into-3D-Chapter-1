<template>
  <div>
    <div style="height: calc(50vw); width: calc(90vw)">
      <a-scene embedded>
        <!-- Player Rig -->
        <a-entity id="rig">
          <a-camera id="camera">
            <!-- Enable the cursor to test a desktop browser -->
            <!-- <a-cursor></a-cursor> -->
          </a-camera>
          <a-entity
            laser-controls="hand: left; model: true;"
            raycaster="near: 0.1; far: 3; objects: .clickable"
          ></a-entity>
          <a-entity
            laser-controls="hand: right; model: true;"
            raycaster="near: 0.1; far: 3; objects: .clickable"
          ></a-entity>
        </a-entity>
        <!-- End Player Rig -->

        <a-plane
          position="0 0 -4"
          rotation="-90 0 0"
          width="10"
          height="10"
          :color="this.$brand.dark4"
        ></a-plane>
        <a-sky :color="this.$brand.light1"></a-sky>
        <Logo3D position="-1.25  2.8 -1.4" />

        <!-- Loading Data: Directly from the EC API or the saved objects in local storage -->
        <template v-if="!loading">
          <a-entity position="0 0.1 -1.4">
            <template v-if="this.dataSource === 'fav'">
              <ItemCard3D
                v-for="(item, index) in favorites"
                v-bind:key="'fav-' + item.id"
                v-bind:item="item"
                v-bind:startPosition="calculatePosition(index)"
              />
            </template>
            <template v-else>
              <ItemCard3D
                v-for="(item, index) in itemResponse.data"
                v-bind:key="'api-' + item.id"
                v-bind:item="item"
                v-bind:startPosition="calculatePosition(index)"
              />
            </template>
          </a-entity>
        </template>

        <!-- Control Panel Prototype: This could be refactored into reusable buttons and controls. -->
        <a-entity id="controlPanel" position="0 1 -0.5" rotation="-35 0 0">
          <a-box
            position="0 0 -0.02"
            scale="0.1 0.1 0.1"
            width="10"
            height="2"
            depth="1"
            :color="this.$brand.dark3"
          >
          </a-box>
          <a-entity scale="0.1 0.1 0.1">
            <a-box
              position="-4.0 0 0"
              :color="this.$brand.dark2"
              control-button-hover
              class="clickable"
              v-on:click="changeLayout('rowSingle')"
            >
              <a-troika-text
                :color="this.$brand.light1"
                position="-0 0 0.56"
                max-width="0.34"
                font-size="0.24"
                value="1x12"
              ></a-troika-text>
            </a-box>
            <a-box
              position="-2.8 0 0"
              :color="this.$brand.dark2"
              control-button-hover
              class="clickable"
              v-on:click="changeLayout('rowDouble')"
            >
              <a-troika-text
                :color="this.$brand.light1"
                position="-0 0 0.56"
                max-width="0.34"
                font-size="0.24"
                value="2x6"
              ></a-troika-text>
            </a-box>
            <a-box
              position="-1.6 0 0"
              :color="this.$brand.dark2"
              control-button-hover
              class="clickable"
              v-on:click="changeLayout('rowTriple')"
            >
              <a-troika-text
                :color="this.$brand.light1"
                position="-0 0 0.56"
                max-width="0.34"
                font-size="0.24"
                value="3x4"
              ></a-troika-text>
            </a-box>

            <a-box
              position="0 0 0"
              :color="this.$brand.dark2"
              control-button-hover
              class="clickable"
              v-on:click="loadPrevious()"
            >
              <a-troika-text
                :color="this.$brand.light1"
                position="-0 0 0.56"
                max-width="0.34"
                font-size="0.5"
                value="<"
              ></a-troika-text>
            </a-box>
            <a-box
              position="1.2 0 0"
              :color="this.$brand.dark2"
              control-button-hover
              class="clickable"
              v-on:click="loadNext()"
            >
              <a-troika-text
                :color="this.$brand.light1"
                position="-0 0 0.56"
                max-width="0.34"
                font-size="0.5"
                value=">"
              ></a-troika-text>
            </a-box>

            <a-box
              position="3.2 0.3 0"
              width="2"
              height="0.5"
              :color="buttonColorAPI"
              control-button-hover
              class="clickable"
              v-on:click="changeDataSource('api')"
            >
              <a-troika-text
                :color="this.$brand.light1"
                position="-0 0 0.56"
                max-width="2"
                font-size="0.33"
                value="API Data"
              ></a-troika-text>
            </a-box>
            <a-box
              position="3.2 -0.3 0"
              width="2"
              height="0.5"
              :color="buttonColorFAV"
              control-button-hover
              class="clickable"
              v-on:click="changeDataSource('fav')"
            >
              <a-troika-text
                :color="this.$brand.light1"
                position="-0 0 0.56"
                max-width="1"
                font-size="0.3"
                value="Favorites"
              ></a-troika-text>
            </a-box>
          </a-entity>
        </a-entity>
        <!-- End Control Panel -->
      </a-scene>
    </div>
    <p>
      <b>A note about Favorites:</b>
      If you favorite items from the list in this demo, the data is stored in
      LocalStoage. The UI is limted to loading only the first 12 favorites found
      in LocalStoage. The Page controls will not work for the Favorites data.
      You can export your favorites data as JSON with the button below, but you
      will need to open the page in a new window (outside of the CodeSandbox
      UI).
    </p>
    <button @click="exportFavData()">Export Favorites (JSON)</button>
  </div>
</template>



<script>
import Logo3D from "./Logo3D.vue";
import ItemCard3D from "./ItemCard3D.vue";
import { rowSingle, rowDouble, rowTriple } from "@/helpers/formation.js";
import "@/helpers/aframe-components.js";

export default {
  components: {
    Logo3D,
    ItemCard3D,
  },
  data() {
    return {
      loading: true,
      errored: false,
      page: 1,
      perPage: 12,
      layoutType: "rowTriple",
      dataSource: "api",
      itemResponse: null,
      favorites: [],
    };
  },
  methods: {
    async loadAPIData() {
      this.loading = true;
      return await this.$http
        .get("https://extendedcollection.com/wp-json/wp/v2/library?", {
          params: this.axiosParams,
        })
        .then((response) => (this.itemResponse = response))

        .catch((error) => {
          console.log(error);
          this.errored = true;
        })
        .finally(() => (this.loading = false));
    },
    // TODO: Refactor the favorite data loading process to match all features of the API list
    loadFavData() {
      this.loading = true;
      const storage = { ...localStorage };
      const keys = Object.keys(storage);
      let loadedFavorites = [];
      for (let key of keys) {
        if (key.toString().substring(0, 5) === "item_") {
          const item = JSON.parse(localStorage[key]);
          if (item.isFavorite) {
            loadedFavorites.push(item);
          }
        }
      }
      // Return only the first 12 favorites from local storate.
      this.favorites = loadedFavorites.slice(0, 11);
      this.loading = false;
    },
    // A stub to export favorites from LocalStorage to a JSON file.
    exportFavData() {
      const storage = { ...localStorage };
      const keys = Object.keys(storage);
      let loadedFavorites = [];
      for (let key of keys) {
        if (key.toString().substring(0, 5) === "item_") {
          const item = JSON.parse(localStorage[key]);
          if (item.isFavorite) {
            loadedFavorites.push(item);
          }
        }
      }
      // Do something with the export
      const exportData = JSON.stringify(loadedFavorites);

      let exportEl = document.createElement("a");
      exportEl.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(exportData)
      );
      exportEl.style.display = "none";
      exportEl.setAttribute("download", "ec-labs-favorites.json");
      document.body.appendChild(exportEl);
      exportEl.click();
      document.body.removeChild(exportEl);
    },

    changeDataSource(value) {
      this.dataSource = value;
      if (value === "fav") {
        this.loadFavData();
      }
    },

    loadPrevious() {
      if (this.page > 1) {
        this.page = this.page - 1;
        this.loadAPIData();
      }
    },
    loadNext() {
      if (this.page < this.itemResponse.headers["x-wp-totalpages"]) {
        this.page = this.page + 1;
        this.loadAPIData();
      }
    },
    changeLayout(layout) {
      this.layoutType = layout;
    },

    calculatePosition(index) {
      switch (this.layoutType) {
        case "rowSingle":
          return rowSingle[index];

        case "rowDouble":
          return rowDouble[index];

        case "rowTriple":
          return rowTriple[index];

        default:
          return rowSingle[index];
      }
    },
  },
  computed: {
    axiosParams() {
      const fields = [
        "id",
        "link",
        "title",
        "date",
        "acf",
        "featured_media",
        "categories",
        "tags",
      ];
      const params = new URLSearchParams();
      params.append("page", this.page);
      params.append("per_page", this.perPage);
      params.append("_embed", true);
      params.append("_fields", fields);

      return params;
    },
    // Used to change the color of the control panel buttons to reflect the current data source selected
    buttonColorAPI() {
      return this.dataSource === "api" ? this.$brand.blue : this.$brand.dark2;
    },
    buttonColorFAV() {
      return this.dataSource === "fav" ? this.$brand.blue : this.$brand.dark2;
    },
  },
  mounted() {
    // localStorage.clear();
    this.loadAPIData();
  },
};
</script>
