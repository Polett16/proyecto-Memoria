<template>
  <div class="login-full-page">
    <div class="row g-0 h-100">
      <!-- Columna del logo -->
      <div
        class="col-md-6 d-none d-md-flex align-items-center justify-content-center bg-white"
      >
        <div class="text-center p-5">
          <img
            alt="Nutri logo"
            class="logo mb-4"
            src="../../../public/Logo-app.png"
            style="max-width: 300px; height: auto"
          />
          <h2 class="text-dark fs-1 fw-bold">NutriPro</h2>
        </div>
      </div>

      <!-- Columna del formulario -->
      <div class="col-md-6 d-flex align-items-center justify-content-center">
        <div
          class="w-100 bg-white p-4 p-md-5 rounded-start-0 shadow-lg rounded-4"
          style="max-width: 500px"
        >
          <div class="d-block d-md-none text-center mb-4">
            <img
              alt="Nutri logo"
              class="logo"
              src="../../../public/Logo-app.png"
              style="max-width: 150px; height: auto"
            />
          </div>

          <h1 class="text-center text-dark mb-4 fs-2">INICIE SESIÓN</h1>

          <div class="mb-4 w-100">
            <label class="form-label mb-2 fs-5 fw-medium"
              >RUT (sin puntos ni guión)</label
            >
            <input
              type="text"
              class="form-control text-dark py-3 px-4 border border-gray-300 rounded-3"
              placeholder="Ej: 123456789"
              v-model="rut"
              required
            />
          </div>

          <div class="mb-4 w-100">
            <label class="form-label mb-2 fs-5 fw-medium">Contraseña</label>
            <input
              type="password"
              class="form-control text-dark py-3 px-4 border border-gray-300 rounded-3"
              placeholder="Ingrese su contraseña"
              v-model="password"
              required
            />
          </div>

          <div class="text-center my-3">
            <RouterLink
              to="/forgot-password"
              class="text-decoration-none text-purple fw-medium"
            >
              ¿Olvidaste tu contraseña?
            </RouterLink>
          </div>

          <hr class="my-4 text-gray-300" />

          <button
            class="w-100 btn-purple py-3 text-white fw-semibold fs-5"
            @click="iniciarSesion"
          >
            INGRESAR
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Login",
  data() {
    return {
      rut: "",
      password: "",
    };
  },
  methods: {
    validarRut(rut) {
      return /^\d+$/.test(rut);
    },

    async iniciarSesion() {
      if (!this.rut || !this.password) {
        alert("Debe ingresar todos los datos.");
        return;
      }

      if (!this.validarRut(this.rut)) {
        alert("El RUT debe ser solo números.");
        return;
      }

      try {
        const response = await axios.post(
          `${process.env.VUE_APP_API_URL}/auth`,
          {
            rut: parseInt(this.rut),
            password: this.password,
          }
        );

        if (response.status === 201) {
          const token = response.data.jwt;

          // Guardamos el token en localStorage
          localStorage.setItem("token", token);

          // Redirigimos al usuario
          this.$router.push("/admin/dashboard");
        }
      } catch (error) {
        if (error.response) {
          alert(
            `Error: ${error.response.data.message || "Credenciales inválidas"}`
          );
        } else {
          alert("Error de conexión al servidor.");
        }
      }
    },
  },
};
</script>

<style scoped>
/* Variables de color personalizadas */
:root {
  --bs-purple: #b35fc3;
  --bs-gray-300: #e2e8f0;
  --bs-secondary: #4a5568;
}

/* Estructura principal que ocupa toda la pantalla */
.login-full-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
  background-color: #f8f9fa; /* Color de fondo general */
}

/* Asegura que las columnas ocupen toda la altura */
.row.h-100 {
  height: 100% !important;
  margin: 0;
}

/* Clases personalizadas para extender Bootstrap */
.bg-purple {
  background-color: var(--bs-purple);
}

.text-purple {
  color: var(--bs-purple);
}

.btn-purple {
  background-color: #9e4fb0;
  border-color: #9e4fb0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 5px;
}

.btn-purple:hover {
  background-color: #864296;
  border-color: #864296;
  transition: all 0.3s ease;
}

/* Estilos para el enfoque del input */
.form-control:focus {
  border-color: var(--bs-purple);
  box-shadow: 0 0 0 0.25rem rgba(179, 95, 195, 0.25);
}

/* Estilos para el panel del formulario */
.rounded-start-0 {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}

/* Responsive para móviles */
@media (max-width: 767.98px) {
  .rounded-start-0 {
    border-top-left-radius: var(--bs-border-radius) !important;
    border-bottom-left-radius: var(--bs-border-radius) !important;
  }

  .bg-light {
    background-color: white !important;
  }

  .shadow-lg {
    box-shadow: none !important;
  }

  /* Asegurar que el fondo ocupe toda la pantalla en móviles */
  .login-full-page {
    background-color: white;
  }

  .col-md-6.bg-light {
    background-color: white !important;
  }
}
</style>
