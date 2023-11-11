
export default {
  path: "/demo",
  name: "Demo",
  redirect: "/welcome",
  meta: {
    icon: "IF-pure-iconfont-tabs",
    title: "demo",
    rank: 0
  },
  children: [
    {
      path: "/demo",
      name: "Demo",
      component: () => import("@/views/demo/index.vue"),
      meta: {
        title: "demo",
      }
    }
  ]
} as RouteConfigsTable;