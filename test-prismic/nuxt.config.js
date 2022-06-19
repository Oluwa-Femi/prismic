// export default {
//   // Global page headers: https://go.nuxtjs.dev/config-head
//   head: {
//     title: 'test',
//     htmlAttrs: {
//       lang: 'en'
//     },
//     meta: [
//       { charset: 'utf-8' },
//       { name: 'viewport', content: 'width=device-width, initial-scale=1' },
//       { hid: 'description', name: 'description', content: '' },
//       { name: 'format-detection', content: 'telephone=no' }
//     ],
//     link: [
//       { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
//     ]
//   },

//   // Global CSS: https://go.nuxtjs.dev/config-css
//   css: [
//   ],

//   // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
//   plugins: [
//   ],

//   // Auto import components: https://go.nuxtjs.dev/config-components
//   components: true,

//   // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
//   buildModules: [
//   ],

//   // Modules: https://go.nuxtjs.dev/config-modules
//   modules: [
//   ],

//   // Build Configuration: https://go.nuxtjs.dev/config-build
//   build: {
//   }
// }

const pkg = require("./package");
const Prismic = require("prismic-javascript");
import { initApi } from "./prismic.config";
module.exports = {
  mode: "universal",
  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: pkg.description },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: ["@/assets/css/global.css"],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js modules
   */
  modules: [],
  generate: {
    routes: function () {
      const homepage = initApi().then((api) => {
        return api
          .query(Prismic.Predicates.at("document.type", "homepage"))
          .then((response) => {
            return response.results.map((payload) => {
              return {
                route: "/",
                payload,
              };
            });
          });
      });
      const aboutPage = initApi().then((api) => {
        return api
          .query(Prismic.Predicates.at("document.type", "about_page"))
          .then((response) => {
            return response.results.map((payload) => {
              return {
                route: "/",
                payload,
              };
            });
          });
      });

      const blogPage = initApi().then((api) => {
        return api
          .query(Prismic.Predicates.at("document.type", "blog_post"))
          .then((response) => {
            return [
              {
                route: `/blog`,
                payload: response.results,
              },
            ];
          });
      });

      const blogPosts = initApi().then((api) => {
        return api
          .query(Prismic.Predicates.at("document.type", "blog_post"))
          .then((response) => {
            return response.results.map((payload) => {
              return {
                route: `/blog/${payload.uid}`,
                payload,
              };
            });
          });
      });
      return Promise.all([homepage, aboutPage, blogPage, blogPosts]).then(
        (values) => {
          return [...values[0], ...values[1], ...values[2], ...values[3]];
        }
      );
    },
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
  },
};
