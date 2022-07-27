<template>
  <v-app>
    <Main>
      <NavBar />
      <Nuxt />
    </Main>
    <Footer />
  </v-app>
</template>
<script>
import Footer from "@/components/core/Footer";
import Main from "@/components/core/Main";
import NavBar from "@/components/core/NavBar";
export default {
  components: {
    Footer,
    Main,
    NavBar
  }
};
</script>