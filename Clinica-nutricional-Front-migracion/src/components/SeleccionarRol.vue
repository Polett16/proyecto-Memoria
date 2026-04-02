<template>
  <div class="seleccionar-rol-container">
    <div class="card-roles">
      <h1 class="titulo">Seleccione su rol</h1>

      <div class="roles-list">
        <button
          v-for="rol in roles"
          :key="rol.id"
          class="btn-purple rol-button"
          @click="seleccionarRol(rol)"
        >
          {{ rol.nombre }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SeleccionarRol",
  data() {
    return {
      roles: [],
    };
  },
  mounted() {
    const rolesGuardados = JSON.parse(localStorage.getItem("roles")) || [];

    console.log("=== ROLES EN SELECCION ===");
    console.log(rolesGuardados);

    this.roles = rolesGuardados;
  },
  methods: {
    seleccionarRol(rol) {
      console.log("=== ROL SELECCIONADO ===");
      console.log(rol);

      // guardamos el rol activo
      localStorage.setItem("rolActivo", JSON.stringify(rol));

      // redirección según rol
      if (rol.nombre === "Nutricionista") {
        this.$router.push("/admin/dashboard");
        return;
      }

      if (rol.nombre === "Paciente") {
        this.$router.push("/admin/dashboard");
        return;
      }

      // fallback
      this.$router.push("/admin/dashboard");
    },
  },
};
</script>

<style scoped>
.seleccionar-rol-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f8f9fa;

  display: flex;
  align-items: center;
  justify-content: center;
}

.card-roles {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  min-width: 300px;
}

.titulo {
  margin-bottom: 2rem;
  color: #2c3e50;
}

.roles-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* reutilizamos estilo del login */
.btn-purple {
  background-color: #9e4fb0;
  border: none;
  color: white;
  padding: 1rem;
  font-size: 1.1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-purple:hover {
  background-color: #864296;
  transform: translateY(-2px);
}

.rol-button {
  width: 100%;
}
</style>