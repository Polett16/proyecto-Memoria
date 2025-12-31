<template>
  <div class="wrapper">
    <side-bar>
      <template slot="links">
        <!-- Nutricionista -->
        <template v-if="userRole === 'Nutricionista'">
          <sidebar-link
            to="/admin/fichaclinica"
            name="Crear Ficha Clinica"
            icon="tim-icons icon-chart-pie-36"
          />
          <sidebar-link
            to="/admin/verfichasclinicas"
            name="Ver Fichas Clinicas"
            icon="tim-icons icon-atom"
          />
          <sidebar-link
            to="/admin/listaPacientes"
            name="Ver Pacientes"
            icon="tim-icons icon-pin"
          />
          <sidebar-link
            to="/admin/verplannutrional"
            name="Planes Nutricionales"
            icon="tim-icons icon-pin"
          />
        </template>

        <!-- Administrador -->
        <template v-else-if="userRole === 'Administrador'">
          <sidebar-link
            to="/admin/gestionusuarios"
            name="Gestión de usuarios"
            icon="tim-icons icon-pin"
          />
          <sidebar-link
            to="/admin/gestionroles"
            name="Gestión de Roles"
            icon="tim-icons icon-pin"
          />
          <sidebar-link
            to="/register"
            name="Registrar admin/nutri"
            icon="tim-icons icon-pin"
          />
        </template>

        <!-- Paciente -->
        <template v-else-if="userRole === 'Paciente'">
          <sidebar-link
            to="/admin/verfichasclinicas"
            name="Ver Fichas Clínicas"
            icon="tim-icons icon-atom"
          />
        </template>
      </template>
    </side-bar>

    <div class="main-panel">
      <top-navbar></top-navbar>
      <dashboard-content @click.native="toggleSidebar"></dashboard-content>
      <content-footer></content-footer>
    </div>
  </div>
</template>

<style lang="scss"></style>
<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "./MobileMenu";

export default {
  components: {
    TopNavbar,
    ContentFooter,
    DashboardContent,
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },

    getToken() {
      return localStorage.getItem("token") || "";
    },

    getUserRole() {
      const token = this.getToken();
      if (!token) return null;

      const payload = token.split(".")[1];
      const base = decodeURIComponent(
        Array.prototype.map
          .call(atob(payload), function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      const parsed = JSON.parse(base);
      return parsed.rols?.[0]?.rol || null;
    },
  },
  computed: {
    userRole() {
      return this.getUserRole();
    },
  },
};
</script>
