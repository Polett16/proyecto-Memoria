<template>
  <div class="pacientes-container">
    <div class="pacientes-content">
      <div
        v-if="mostrarNotificacion"
        class="notificacion"
        :class="tipoNotificacion"
      >
        {{ mensajeNotificacion }}
      </div>
      <h1 class="form-title">Listado de Pacientes</h1>

      <div class="form-section">
        <h2 class="section-title">Buscar por RUT</h2>
        <div class="form-group">
          <label class="form-label">Ingrese RUT</label>
          <input
            v-model="busqueda"
            placeholder="12.345.678-9"
            class="form-input"
            @input="filtrarPacientes"
          />
        </div>
      </div>

      <div v-if="cargando" class="loading-state">
        <p>Cargando pacientes...</p>
      </div>

      <div v-else-if="pacientesFiltrados.length === 0" class="empty-state">
        <p>No se encontraron pacientes</p>
      </div>

      <div v-else class="patients-list">
        <div
          v-for="paciente in pacientesFiltrados"
          :key="paciente.id"
          class="patient-card"
        >
          <div class="patient-info">
            <h3>{{ paciente.nombre }}</h3>
            <div class="patient-details">
              <span class="detail-label">Rut:</span>
              <span>{{ paciente.rut }}</span>
            </div>

            <div class="patient-details">
              <span class="detail-label">Fecha nacimiento:</span>
              <span>{{ formatoFecha(paciente.fechaNacimiento) }}</span>
            </div>
          </div>
          <button @click="mostrarResumen(paciente)" class="submit-button">
            Ver Resumen
          </button>
        </div>
      </div>
    </div>

    <ResumenPaciente
      v-if="mostrarModalResumen"
      :paciente="pacienteSeleccionado"
      @cerrar="mostrarModalResumen = false"
    />
  </div>
</template>

<script>
import ResumenPaciente from "./ResumenPaciente.vue";

export default {
  components: {
    ResumenPaciente,
  },
  data() {
    return {
      busqueda: "",
      cargando: false,
      pacientes: [],
      pacientesFiltrados: [],
      pacienteSeleccionado: null,
      mostrarModalResumen: false,
      mostrarNotificacion: false,
      mensajeNotificacion: "",
      tipoNotificacion: "info", // puede ser 'info', 'exito', 'error' (porsiacaso)
      timeoutNotificacion: null,
    };
  },
  created() {
    this.cargarPacientes();
  },
  methods: {
    async cargarPacientes() {
      this.cargando = true;
      try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/ficha`);
        const data = await response.json();

        this.pacientes = data.map((ficha) => {
          const usuario = ficha.fkUsuario;

          // Si tiene antropometrias, tomamos el último control
          let ultimaAntropometria = null;
          if (ficha.antropometrias && ficha.antropometrias.length > 0) {
            // Ordenamos para asegurarnos (opcional)
            ficha.antropometrias.sort(
              (a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
            );
            ultimaAntropometria = ficha.antropometrias[0];
          }

          return {
            id: ficha.id,
            nombre: usuario.nombre,
            rut: usuario.rut.toString(),
            fechaNacimiento: usuario.fechaNacimiento,
            telefono: usuario.telefono,
            correo: usuario.correo,
            sexo: usuario.sexo,

            // Datos de control
            peso: ultimaAntropometria?.peso || null,
            imc: ultimaAntropometria?.imc || null,
            ultimaVisita:
              ultimaAntropometria?.fechaCreacion || ficha.fechaCreacion,
          };
        });

        this.pacientesFiltrados = [...this.pacientes];
      } catch (error) {
        console.error("Error al cargar pacientes:", error);
        this.mostrarNotificacionTemporal("Error al cargar pacientes", "error");
      } finally {
        this.cargando = false;
      }
    },

    mostrarNotificacionTemporal(mensaje, tipo = "info", duracion = 3000) {
      // Cancelar notificación previa si existe
      if (this.timeoutNotificacion) {
        clearTimeout(this.timeoutNotificacion);
      }

      this.mostrarNotificacion = true;
      this.mensajeNotificacion = mensaje;
      this.tipoNotificacion = tipo;

      // Ocultar después de la duración especificada
      this.timeoutNotificacion = setTimeout(() => {
        this.mostrarNotificacion = false;
      }, duracion);
    },

    filtrarPacientes() {
      const termino = this.busqueda.toLowerCase();
      this.pacientesFiltrados = this.pacientes.filter(
        (p) =>
          p.nombre.toLowerCase().includes(termino) ||
          p.rut.includes(termino.replace(/[^0-9kK]/g, ""))
      );
    },
    formatoFecha(fecha) {
      if (!fecha) return "N/A";
      const options = { day: "2-digit", month: "2-digit", year: "numeric" };
      return new Date(fecha).toLocaleDateString("es-CL", options);
    },
    formatoRUT(rut) {
      if (!rut) return "";
      const rutLimpio = rut.toString().replace(/[^0-9kK]/g, "");
      if (rutLimpio.length <= 1) return rutLimpio;

      const cuerpo = rutLimpio.slice(0, -1);
      const dv = rutLimpio.slice(-1).toUpperCase();

      return cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "-" + dv;
    },
    mostrarResumen(paciente) {
      this.pacienteSeleccionado = paciente;
      this.mostrarModalResumen = true;
    },
  },
  mounted() {
    // Mostrar notificación al cargar el componente
    if (this.pacientes.length > 0) {
      const ultimoPaciente = this.pacientes[0];
      this.mostrarNotificacionTemporal(
        `La ficha de ${ultimoPaciente.nombre} ha sido evaluada`,
        "exito"
      );
    }

    // para paciente específico que fue evaluado ejemplo
    // this.mostrarNotificacionTemporal(
    //   `La ficha de María Fernández López ha sido evaluada`,
    //   'exito'
    // );
  },
};
</script>

<style scoped>
.notificacion {
  position: fixed;
  top: 60px;
  right: 20px;
  padding: 15px 25px;
  border-radius: 5px;
  color: white;
  font-weight: 500;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: slideIn 0.5s, fadeOut 0.5s 2.5s forwards;
}

.notificacion.info {
  background-color: #4299e1;
}

.notificacion.exito {
  background-color: #48bb78;
}

.notificacion.error {
  background-color: #f56565;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
.pacientes-container {
  width: 100%;
  padding: 2rem;
  display: flex;
  justify-content: center;
}

.pacientes-content {
  width: 100%;
  max-width: 1000px;
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.form-title {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2rem;
}

.form-section {
  margin-bottom: 2rem;
}

.section-title {
  color: #4a5568;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #4a5568;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
}

.form-input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 2rem;
  color: #4a5568;
  font-size: 1.1rem;
}

.patients-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.patient-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.patient-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.12);
}

.patient-info h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
  font-weight: 600;
}

.patient-details {
  display: flex;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  color: #4a5568;
}

.detail-label {
  font-weight: 500;
  margin-right: 0.5rem;
  min-width: 90px;
}

.submit-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #b35fc3;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1.5rem;
}

.submit-button:hover {
  background-color: #9e4fb0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Responsive */
@media (max-width: 768px) {
  .pacientes-container {
    padding: 1rem;
  }

  .pacientes-content {
    padding: 1.5rem;
    box-shadow: none;
  }

  .form-title {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }

  .patients-list {
    grid-template-columns: 1fr;
  }

  .submit-button {
    padding: 0.8rem;
  }
}
</style>
