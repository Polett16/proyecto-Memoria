<template>
  <div class="modal-overlay" @click.self="cerrarModal">
    <div class="modal-container">
      <div class="modal-header">
        <h3>Nuevo Plan Nutricional</h3>
        <button @click="cerrarModal" class="close-button">&times;</button>
      </div>

      <form @submit.prevent="guardarPlan" class="control-form">
        <div class="form-group">
          <label>Objetivo del Plan</label>
          <textarea
            v-model="plan.objetivoPlan"
            class="form-textarea"
            required
          ></textarea>
        </div>

        <div class="form-group">
          <label>Recomendación Inicial</label>
          <textarea
            v-model="plan.recomendacionInicial"
            class="form-textarea"
            required
          ></textarea>
        </div>

        <div class="form-group">
          <label>Plan Alimentario</label>
          <textarea
            v-model="plan.planAlimentario"
            class="form-textarea"
            required
          ></textarea>
        </div>

        <div class="form-group">
          <label>Diagnóstico Nutricional</label>
          <textarea
            v-model="plan.diagnosticoNutricional"
            class="form-textarea"
            required
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="button" @click="cerrarModal" class="cancel-button">
            Cancelar
          </button>
          <button type="submit" class="submit-button">Guardar</button>
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
      plan: {
        objetivoPlan: "",
        recomendacionInicial: "",
        planAlimentario: "",
        diagnosticoNutricional: "",
      },
    };
  },
  methods: {
    cerrarModal() {
      this.$emit("cerrar");
    },
    async guardarPlan() {
      try {
        const payload = {
          ...this.plan,
          fkFicha_id: this.fichaId,
        };

        await axios.post(
          `${process.env.VUE_APP_API_URL}/plan-nutricional`,
          payload
        );
        alert("Plan nutricional guardado correctamente");
        this.$emit("guardado");
        this.cerrarModal();
      } catch (error) {
        console.error("Error al guardar el plan nutricional:", error);
        alert("Ocurrió un error al guardar el plan");
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

.form-input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
}

.form-input.disabled {
  background-color: #f7fafc;
  color: #4a5568;
}

.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
}

.form-textarea:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.submit-button {
  padding: 0.75rem 1.5rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button:hover {
  background-color: #3e8e41;
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
  transition: all 0.3s ease;
}

.cancel-button:hover {
  background-color: #cbd5e0;
}

@media (max-width: 768px) {
  .modal-container {
    width: 95%;
  }

  .form-actions {
    flex-direction: column;
  }

  .submit-button,
  .cancel-button {
    width: 100%;
  }
}
</style>
