import VueRouter from "vue-router";
import routes from "./routes";
import AuthService from "@/services/AuthService";

// configure router
const router = new VueRouter({
  routes,
  linkExactActiveClass: "active",
  scrollBehavior: (to) => {
    if (to.hash) {
      return { selector: to.hash };
    } else {
      return { x: 0, y: 0 };
    }
  },
});

router.beforeEach((to, from, next) => {
  const token = AuthService.getToken();

  // Si intenta ir a login y ya tiene token lo mando al dashboard
  if (to.path === "/login" && token) {
    return next("/admin/dashboard");
  }

  // Si la ruta requiere auth y no tiene token, lo mando a login
  if (to.matched.some((record) => record.meta.requiresAuth) && !token) {
    return next("/login");
  }

  // Si tiene token, validamos restricciones de roles
  if (token) {
    const userRole = AuthService.getUserRole();
    console.log("Rol detectado:", userRole);

    // Solo el Administrador puede acceder a /register
    if (to.path === "/register" && userRole !== "Administrador") {
      return next("/admin/dashboard");
    }
  }

  next();
});

export default router;
