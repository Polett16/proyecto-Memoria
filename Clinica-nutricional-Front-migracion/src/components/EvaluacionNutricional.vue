<template>
  <div class="evaluacion-container">
    <form @submit.prevent="handleSubmit" class="evaluacion-form">
      <h2 class="form-title">Evaluación Nutricional</h2>
      
      <!-- Información del paciente -->
      <section class="form-section">
        <h3 class="section-title">Paciente</h3>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Nombre del paciente</label>
            <input v-model="form.pacienteNombre" placeholder="Nombre completo" required class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">RUT o ID</label>
            <input v-model="form.pacienteRut" placeholder="RUT o identificador" required class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Fecha de evaluación</label>
            <input v-model="form.fecha" type="date" required class="form-input" />
          </div>
        </div>
      </section>

      <!-- Consumo alimentario -->
      <section class="form-section">
        <h3 class="section-title">Consumo Alimentario</h3>
        
        <div class="form-group">
          <label class="form-label">Frecuencia de consumo</label>
          <div class="frequency-grid">
            <div v-for="(grupo, index) in gruposAlimentarios" :key="index" class="frequency-item">
              <label>{{ grupo.nombre }}</label>
              <select v-model="form.consumoAlimentario[grupo.id]" class="form-input">
                <option value="">Seleccione...</option>
                <option v-for="(opcion, i) in opcionesFrecuencia" :key="i" :value="opcion.value">
                  {{ opcion.text }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Alimentos que consume con mayor frecuencia</label>
          <textarea v-model="form.alimentosFrecuentes" class="form-textarea" 
                   placeholder="Ej: Pan blanco en el desayuno, arroz en el almuerzo..."></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Alimentos que no consume</label>
          <textarea v-model="form.alimentosNoConsume" class="form-textarea" 
                   placeholder="Ej: Lácteos, mariscos..."></textarea>
        </div>
      </section>

      <!-- Historial dietético -->
      <section class="form-section">
        <h3 class="section-title">Historial Dietético</h3>
        
        <div class="form-group">
          <label class="form-label">Cambios recientes en la alimentación</label>
          <textarea v-model="form.cambiosAlimentacion" class="form-textarea" 
                   placeholder="Describa cualquier cambio significativo en los últimos meses"></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Dietas anteriores</label>
          <textarea v-model="form.dietasAnteriores" class="form-textarea" 
                   placeholder="Describa dietas que el paciente haya seguido anteriormente"></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Registro de 24 horas</label>
          <textarea v-model="form.registro24h" class="form-textarea tall" 
                   placeholder="Describa todo lo consumido en las últimas 24 horas"></textarea>
        </div>
      </section>

      <!-- Actividad física -->
      <section class="form-section">
        <h3 class="section-title">Actividad Física</h3>
        
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Nivel de actividad</label>
            <select v-model="form.nivelActividad" class="form-input">
              <option value="">Seleccione...</option>
              <option value="sedentario">Sedentario (poco o ningún ejercicio)</option>
              <option value="ligero">Ligero (ejercicio ligero 1-3 días/semana)</option>
              <option value="moderado">Moderado (ejercicio moderado 3-5 días/semana)</option>
              <option value="activo">Activo (ejercicio intenso 6-7 días/semana)</option>
              <option value="muy-activo">Muy activo (ejercicio intenso diario + trabajo físico)</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">Horas de actividad semanal</label>
            <input v-model.number="form.horasActividad" type="number" min="0" max="168" 
                   class="form-input" placeholder="Ej: 5" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Tipo de actividad física</label>
          <textarea v-model="form.tipoActividad" class="form-textarea" 
                   placeholder="Describa los tipos de ejercicio que realiza"></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Objetivos de actividad física</label>
          <textarea v-model="form.objetivosActividad" class="form-textarea" 
                   placeholder="Describa los objetivos del paciente respecto a actividad física"></textarea>
        </div>
      </section>

      <!-- Evaluación final -->
      <section class="form-section">
        <h3 class="section-title">Evaluación Nutricional</h3>
        
        <div class="form-group">
          <label class="form-label">Patrones alimentarios identificados</label>
          <textarea v-model="form.patronesAlimentarios" class="form-textarea" 
                   placeholder="Describa los patrones alimentarios observados"></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Recomendaciones iniciales</label>
          <textarea v-model="form.recomendaciones" class="form-textarea tall" 
                   placeholder="Describa las recomendaciones nutricionales iniciales"></textarea>
        </div>
      </section>

      <div class="form-actions">
        <button type="button" @click="cancelar" class="cancel-button">
          Cancelar
        </button>
        <button type="submit" class="submit-button">
          Guardar Evaluación
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'EvaluacionNutricional',
  data() {
    return {
      form: {
        pacienteNombre: '',
        pacienteRut: '',
        fecha: new Date().toISOString().substr(0, 10),
        consumoAlimentario: {},
        alimentosFrecuentes: '',
        alimentosNoConsume: '',
        cambiosAlimentacion: '',
        dietasAnteriores: '',
        registro24h: '',
        nivelActividad: '',
        horasActividad: null,
        tipoActividad: '',
        objetivosActividad: '',
        patronesAlimentarios: '',
        recomendaciones: ''
      },
      gruposAlimentarios: [
        { id: 'cereales', nombre: 'Cereales y derivados' },
        { id: 'verduras', nombre: 'Verduras y hortalizas' },
        { id: 'frutas', nombre: 'Frutas' },
        { id: 'lacteos', nombre: 'Lácteos' },
        { id: 'proteinas', nombre: 'Carnes, pescados y huevos' },
        { id: 'legumbres', nombre: 'Legumbres' },
        { id: 'grasas', nombre: 'Grasas y aceites' },
        { id: 'azucares', nombre: 'Azúcares y dulces' },
        { id: 'bebidas', nombre: 'Bebidas' }
      ],
      opcionesFrecuencia: [
        { value: 'diario', text: 'Diario' },
        { value: '3-4semana', text: '3-4 veces/semana' },
        { value: '1-2semana', text: '1-2 veces/semana' },
        { value: '1-2mes', text: '1-2 veces/mes' },
        { value: 'rara', text: 'Rara vez' },
        { value: 'nunca', text: 'Nunca' }
      ]
    }
  },
  created() {
    // Inicializar consumo alimentario con valores por defecto
    this.gruposAlimentarios.forEach(grupo => {
      this.$set(this.form.consumoAlimentario, grupo.id, '');
    });
  },
  methods: {
    async handleSubmit() {
      // Validar formulario
      if (!this.validarFormulario()) {
        return;
      }
      
      try {
        const response = await this.guardarEvaluacion();
        
        if (response.success) {
          alert('Evaluación nutricional guardada con éxito');
          this.limpiarFormulario();
        } else {
          alert('Error al guardar la evaluación: ' + response.message);
        }
      } catch (error) {
        console.error('Error al guardar evaluación:', error);
        alert('Ocurrió un error al guardar la evaluación');
      }
    },
    
    async guardarEvaluacion() {

      try {
        const datosParaGuardar = {
          ...this.form,
          consumoAlimentario: JSON.stringify(this.form.consumoAlimentario)
        };
        
        const response = await fetch('/api/evaluaciones', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(datosParaGuardar)
        });
        
        return await response.json();
      } catch (error) {
        console.error('Error en guardarEvaluacion:', error);
        throw error;
      }
    },
    
    validarFormulario() {
      if (!this.form.pacienteNombre) {
        alert('Por favor ingrese el nombre del paciente');
        return false;
      }
      
      if (!this.form.pacienteRut) {
        alert('Por favor ingrese el RUT o identificador del paciente');
        return false;
      }
      
      if (!this.form.fecha) {
        alert('Por favor ingrese la fecha de evaluación');
        return false;
      }
      
      return true;
    },
    
    limpiarFormulario() {
      // Resetear el formulario manteniendo algunos valores por defecto
      this.form = {
        ...this.form,
        pacienteNombre: '',
        pacienteRut: '',
        alimentosFrecuentes: '',
        alimentosNoConsume: '',
        cambiosAlimentacion: '',
        dietasAnteriores: '',
        registro24h: '',
        nivelActividad: '',
        horasActividad: null,
        tipoActividad: '',
        objetivosActividad: '',
        patronesAlimentarios: '',
        recomendaciones: ''
      };
      
      // Resetear frecuencias de consumo
      Object.keys(this.form.consumoAlimentario).forEach(key => {
        this.form.consumoAlimentario[key] = '';
      });
    },
    
    cancelar() {
      if (confirm('¿Está seguro que desea cancelar? Los datos no guardados se perderán.')) {
        this.limpiarFormulario();
        this.$router.push('/pacientes');
      }
    }
  }
}
</script>

<style scoped>
.evaluacion-container {
  width: 100%;
  padding: 2rem;
  display: flex;
  justify-content: center;
}

.evaluacion-form {
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
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eaeaea;
}

.section-title {
  color: #4a5568;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.frequency-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.frequency-item {
  display: flex;
  flex-direction: column;
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

.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  min-height: 80px;
  resize: vertical;
}

.form-textarea.tall {
  min-height: 120px;
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
  background-color: #4299e1;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button:hover {
  background-color: #3182ce;
  transform: translateY(-1px);
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

/* Responsive */
@media (max-width: 768px) {
  .evaluacion-container {
    padding: 1rem;
  }

  .evaluacion-form {
    padding: 1.5rem;
  }

  .form-grid, .frequency-grid {
    grid-template-columns: 1fr;
  }

  .form-title {
    font-size: 1.8rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .submit-button, .cancel-button {
    width: 100%;
  }
}
</style>