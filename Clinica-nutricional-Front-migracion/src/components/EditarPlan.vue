<template>
  <div class="editar-plan-container">
    <div class="editar-plan-content">
      <h1 class="form-title">Editar Plan Nutricional</h1>

      <form @submit.prevent="guardarCambios" class="control-form">
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
          <button type="submit" class="submit-button">Guardar Cambios</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "EditarPlan",
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
  created() {
    const planGuardado = localStorage.getItem("planParaEditar");
    console.log(planGuardado);
    if (planGuardado) {
      const datos = JSON.parse(planGuardado);
      this.plan = {
        objetivoPlan: datos.objetivo || "",
        recomendacionInicial: datos.observaciones || "",
        planAlimentario: datos.planAlimentario || "",
        diagnosticoNutricional: datos.diagnostico || "",
      };
    } else {
      this.cargarPlan();
    }
  },
  methods: {
    async cargarPlan() {
      try {
        const id = this.$route.params.id;
        const res = await axios.get(
          `${process.env.VUE_APP_API_URL}/plan-nutricional/${id}`
        );
        this.plan = {
          objetivoPlan: res.data.objetivoPlan,
          recomendacionInicial: res.data.recomendacionInicial,
          planAlimentario: res.data.planAlimentario,
          diagnosticoNutricional: res.data.diagnosticoNutricional,
        };
      } catch (error) {
        console.error("Error al cargar el plan:", error);
        alert("Error al cargar el plan nutricional");
      }
    },
    async guardarCambios() {
      try {
        const id = this.$route.params.id;
        await axios.patch(
          `${process.env.VUE_APP_API_URL}/plan-nutricional/${id}`,
          this.plan
        );
        alert("Cambios guardados correctamente");

        // Eliminar el plan del localStorage después de guardar
        localStorage.removeItem("planParaEditar");

        this.$router.back();
      } catch (error) {
        console.error("Error al guardar cambios:", error);
        alert("Ocurrió un error al guardar los cambios");
      }
    },
  },
};
</script>

<style scoped>
.editar-plan-container {
  width: 100%;
  padding: 2rem;
  display: flex;
  justify-content: center;
}

.editar-plan-content {
  width: 100%;
  max-width: 700px;
  background: #1a202c;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.form-title {
  color: #f9fafb;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  font-size: 1rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 0.5rem;
  display: block;
}

.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #4a5568;
  border-radius: 6px;
  font-size: 1rem;
  background-color: #2d3748;
  color: #f9fafb;
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
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
</style>
