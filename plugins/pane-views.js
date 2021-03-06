import Vue from "vue";

import Pages from '@/apps/Pages/index.vue'
import Files from '@/apps/Files/index.vue'

import listify from '@/apps/util-views/components/listify/1.2.vue'
import loading from '@/apps/util-views/components/loading/index.vue'
import formBuilder from '@/apps/util-views/components/dqFormBuilder/index.vue'
import raw from '@/apps/util-views/components/raw/index.vue'
import uniview from '@/apps/util-views/components/uniview/index.vue'
import dqpanepgnate from '@/apps/util-views/components/dqpanepgnate/index.vue'
import objectify from '@/apps/util-views/components/objectify/objectify-flat-settings.vue'
import serviceMaker from '@/apps/util-views/components/serviceMaker/index.vue'
import simpleNavs from '@/apps/util-views/components/simpleNavs/index.vue'

Vue.component("pageContent", Pages);
Vue.component("Files", Files)
Vue.component("listify", listify)
Vue.component("loading", loading)
Vue.component("formBuilder",formBuilder)
Vue.component("raw",raw)
Vue.component("uniview", uniview)
Vue.component("dqpanepgnate", dqpanepgnate)
Vue.component("objectify", objectify)
Vue.component("serviceMaker", serviceMaker)
Vue.component("simpleNavs", simpleNavs)

import JsonViewer from 'vue-json-viewer/ssr'
Vue.use(JsonViewer)
Vue.component('JsonViewer',JsonViewer)