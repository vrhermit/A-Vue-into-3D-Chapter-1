<template>
  <a-image
    v-if="!loading"
    color="white"
    :src="imagePath"
    width="0.36"
    height="0.36"
    position="0 0 0.026"
  ></a-image>
</template>

<script>
export default {
  props: {
    item: Object,
  },
  data() {
    return {
      imageResponse: null,
      loading: true,
      errored: false,
    };
  },
  methods: {
    async loadImage() {
      return await this.$http
        .get(
          `https://extendedcollection.com/wp-json/wp/v2/media/${this.item.featured_media}`
        )
        .then((response) => (this.imageResponse = response))

        .catch((error) => {
          console.log(error);
          this.errored = true;
        })
        .finally(() => (this.loading = false));
    },
  },
  computed: {
    imagePath() {
      if (this.loading) {
        return "";
      } else {
        return this.imageResponse.data.media_details.sizes.full.source_url;
      }
    },
  },

  mounted() {
    this.loadImage();
  },
};
</script>

