const { VITE_HIDE_HOME } = import.meta.env;
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/",
  name: "Member",
  component: Layout,
  redirect: "/welcome",
  meta: {
    icon: "UserFilled",
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