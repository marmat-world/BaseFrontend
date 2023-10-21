
export default {
  path: "/member",
  name: "Member",
  redirect: "/welcome",
  meta: {
    icon: "informationLine",
    title: "用户",
    rank: 0
  },
  children: [
    {
      path: "/member",
      name: "Member",
      component: () => import("@/views/member/index.vue"),
      meta: {
        title: "用户",
      }
    }
  ]
} as RouteConfigsTable;