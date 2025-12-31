<template>
  <div class="modal-overlay" @click.self="cerrarModal">
    <div class="modal-container">
      <div class="modal-header">
        <h3>Nuevo Registro 24 Horas</h3>
        <button @click="cerrarModal" class="close-button">&times;</button>
      </div>

      <form @submit.prevent="guardarRegistro" class="control-form">
        <div
          v-for="(item, index) in registros"
          :key="index"
          class="registro-block"
        >
          <div class="form-group">
            <label>Tipo de comida</label>
            <select v-model="item.fkTipoComida_id" class="form-input" required>
              <option disabled value="">Seleccione tipo de comida</option>
              <option
                v-for="comida in tiposComida"
                :key="comida.id"
                :value="comida.id"
              >
                {{ comida.tipoComida }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Descripción</label>
            <input
              v-model="item.descripcion"
              type="text"
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label>Hora</label>
            <input
              v-model="item.hora"
              type="time"
              class="form-input"
              required
            />
          </div>

          <div class="form-group full-width">
            <button
              type="button"
              @click="quitarRegistro(index)"
              class="eliminar-button"
            >
              Quitar
            </button>
          </div>

          <hr class="divider" />
        </div>

        <button type="button" @click="agregarRegistro" class="submit-button">
          + Agregar otro alimento
        </button>

        <div class="form-actions">
          <button type="button" @click="cerrarModal" class="cancel-button">
            Cancelar
          </button>
          <button type="submit" class="submit-button">Guardar Registro</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    fichaId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      registros: [{ fkTipoComida_id: "", descripcion: "", hora: "" }],
      tiposComida: [],
    };
  },
  mounted() {
    this.cargarTiposComida();
  },
  methods: {
    cerrarModal() {
      this.$emit("cerrar");
    },
    agregarRegistro() {
      this.registros.push({ fkTipoComida_id: "", descripcion: "", hora: "" });
    },
    quitarRegistro(index) {
      this.registros.splice(index, 1);
    },
    async cargarTiposComida() {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_URL}/tipo-comida`
        );
        this.tiposComida = response.data;
      } catch (error) {
        console.error("Error cargando tipos de comida:", error);
      }
    },
    async guardarRegistro() {
      try {
        const payload = {
          fkFicha_id: this.fichaId,
          rRegistro24hTipocomidas: this.registros.map((item) => ({
            fkTipoComida_id: item.fkTipoComida_id,
            descripcion: item.descripcion,
            hora: item.hora,
          })),
        };

        await axios.post(`${process.env.VUE_APP_API_URL}/registro24h`, payload);
        alert("Registro 24 horas guardado exitosamente");
        this.$emit("guardado");
        this.cerrarModal();
      } catch (error) {
        console.error("Error al guardar registro 24 horas:", error);
        alert("Ocurrió un error al guardar el registro");
      }
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eaeaea;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.control-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
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

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.submit-button {
  padding: 0.75rem 1.5rem;
  background-color: #b35fc3;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}

.cancel-button {
  padding: 0.75rem 1.5rem;
  background-color: #e2e8f0;
  color: #4a5568;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}

.eliminar-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #e53e3e;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.divider {
  border: 0;
  height: 1px;
  background: #e2e8f0;
  margin: 1rem 0;
}
</style>
