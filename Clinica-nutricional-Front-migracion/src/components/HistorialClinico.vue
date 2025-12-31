<template>
  <div class="modal-overlay" @click.self="cerrar">
    <div class="modal-container historial-modal">
      <div class="modal-header">
        <h2>Historial Clínico</h2>
        <button @click="cerrar" class="close-button">&times;</button>
      </div>
      
      <div class="modal-body">
        <div v-if="paciente" class="paciente-info">
          <h3>{{ paciente.nombre }}</h3>
          <p>RUT: {{ paciente.rut }} | Edad: {{ paciente.edad }} años</p>
        </div>

        <div class="filtros">
          <div class="filtro-group">
            <label>Filtrar por tipo:</label>
            <select v-model="filtroTipo" class="filtro-select">
              <option value="todos">Todos</option>
              <option value="consulta">Consultas</option>
              <option value="control">Controles</option>
              <option value="evaluacion">Evaluaciones</option>
            </select>
          </div>
          <div class="filtro-group">
            <label>Ordenar por:</label>
            <select v-model="orden" class="filtro-select">
              <option value="fecha-desc">Fecha (más reciente primero)</option>
              <option value="fecha-asc">Fecha (más antigua primero)</option>
            </select>
          </div>
        </div>

        <div v-if="loading" class="loading">
          <p>Cargando historial...</p>
        </div>

        <div v-else-if="historialFiltrado.length === 0" class="no-results">
          <p>No se encontraron registros en el historial.</p>
        </div>

        <div v-else class="registros-container">
          <div v-for="registro in historialFiltrado" :key="registro.id" class="registro-card" :class="registro.tipo">
            <div class="registro-header">
              <div class="registro-fecha">
                {{ formatFecha(registro.fecha) }}
              </div>
              <div class="registro-tipo">
                {{ formatoTipo(registro.tipo) }}
              </div>
            </div>

            <div class="registro-content">
              <div v-if="registro.tipo === 'control' || registro.tipo === 'consulta'" class="datos-antropometricos">
                <div class="dato">
                  <span class="dato-label">Peso:</span>
                  <span class="dato-valor">{{ registro.peso }} kg</span>
                </div>
                <div class="dato">
                  <span class="dato-label">Altura:</span>
                  <span class="dato-valor">{{ registro.altura }} cm</span>
                </div>
                <div class="dato">
                  <span class="dato-label">IMC:</span>
                  <span class="dato-valor">{{ registro.imc }}</span>
                </div>
              </div>

              <div class="observaciones">
                <h4>Observaciones:</h4>
                <p>{{ registro.observaciones }}</p>
              </div>

              <div class="plan">
                <h4>Plan:</h4>
                <p>{{ registro.plan }}</p>
              </div>

              <div v-if="registro.profesional" class="profesional">
                <span class="profesional-label">Profesional:</span>
                <span class="profesional-nombre">{{ registro.profesional }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HistorialClinico',
  props: {
    pacienteId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: true,
      paciente: null, // Inicializado como null
      historial: [],
      filtroTipo: 'todos',
      orden: 'fecha-desc'
    }
  },
  computed: {
    historialFiltrado() {
      let registros = [...this.historial];
      
      // Aplicar filtro por tipo
      if (this.filtroTipo !== 'todos') {
        registros = registros.filter(r => r.tipo === this.filtroTipo);
      }
      
      // Aplicar ordenamiento
      if (this.orden === 'fecha-desc') {
        registros.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      } else {
        registros.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
      }
      
      return registros;
    }
  },
  created() {
    this.cargarDatos();
  },
  methods: {
    async cargarDatos() {
      try {
        this.loading = true;
        
        // Simulación de carga de datos para cuando este luego la api
        setTimeout(() => {
          this.paciente = {
            id: this.pacienteId,
            nombre: 'María Fernández López',
            rut: '18.765.432-1',
            edad: 28,
            nutricionistaAsignado: 'nutricionista1'
          };
          
          this.historial = [
            {
              id: '1',
              tipo: 'consulta',
              fecha: '2023-05-20',
              peso: 58.3,
              altura: 162,
              imc: 22.1,
              observaciones: 'Paciente busca mejorar hábitos alimentarios. Sin patologías de base.',
              plan: 'Plan alimentario de 1800 kcal con distribución adecuada de macronutrientes.',
              profesional: 'Dra. Ana Soto'
            },
            {
              id: '2',
              tipo: 'control',
              fecha: '2023-06-15',
              peso: 57.8,
              altura: 162,
              imc: 21.9,
              observaciones: 'Paciente muestra buena adherencia al plan. Ligera reducción de peso.',
              plan: 'Mantener plan actual. Incrementar ingesta de vegetales verdes.',
              profesional: 'Dra. Ana Soto'
            }
          ];
          
          this.loading = false;
        }, 1000);
        
      } catch (error) {
        console.error('Error al cargar historial:', error);
        this.loading = false;
      }
    },
    formatFecha(fecha) {
      const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      return new Date(fecha).toLocaleDateString('es-CL', options);
    },
    formatoTipo(tipo) {
      const tipos = {
        'consulta': 'Consulta Nutricional',
        'control': 'Control Periódico',
        'evaluacion': 'Evaluación Inicial'
      };
      return tipos[tipo] || tipo;
    },
    cerrar() {
      this.$emit('cerrar');
    }
  }
}
</script>

<style scoped>
/* Estilos del modal */
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
  max-width: 900px;
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

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  transition: color 0.2s;
}

.close-button:hover {
  color: #333;
}

.modal-body {
  padding: 1.5rem;
}

/* Estilos específicos del historial */
.historial-modal {
  width: 95%;
  max-width: 1000px;
}

.paciente-info {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.paciente-info h3 {
  margin: 0 0 0.25rem;
  color: #2c3e50;
  font-size: 1.3rem;
}

.paciente-info p {
  margin: 0;
  color: #718096;
  font-size: 0.95rem;
}

.filtros {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f7fafc;
  border-radius: 6px;
}

.filtro-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filtro-group label {
  font-weight: 500;
  color: #4a5568;
  font-size: 0.9rem;
}

.filtro-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  background-color: white;
  font-size: 0.9rem;
  cursor: pointer;
}

.filtro-select:focus {
  outline: none;
  border-color: #b35fc3;
  box-shadow: 0 0 0 3px rgba(179, 95, 195, 0.2);
}

.loading, .no-results {
  text-align: center;
  padding: 2rem;
  color: #4a5568;
  font-size: 1.1rem;
}

.registros-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.registro-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #4299e1;
  transition: transform 0.2s, box-shadow 0.2s;
}

.registro-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.registro-card.control {
  border-left-color: #48bb78;
}

.registro-card.evaluacion {
  border-left-color: #9f7aea;
}

.registro-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: #f7fafc;
  border-bottom: 1px solid #e2e8f0;
}

.registro-fecha {
  font-weight: 500;
  color: #2c3e50;
  font-size: 0.95rem;
}

.registro-tipo {
  padding: 0.25rem 0.75rem;
  background-color: #ebf8ff;
  color: #3182ce;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.registro-card.control .registro-tipo {
  background-color: #f0fff4;
  color: #38a169;
}

.registro-card.evaluacion .registro-tipo {
  background-color: #faf5ff;
  color: #805ad5;
}

.registro-content {
  padding: 1rem;
}

.datos-antropometricos {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px dashed #e2e8f0;
}

.dato {
  display: flex;
  flex-direction: column;
  min-width: 80px;
}

.dato-label {
  font-size: 0.8rem;
  color: #718096;
  margin-bottom: 0.25rem;
}

.dato-valor {
  font-weight: 500;
  color: #2c3e50;
  font-size: 1rem;
}

.observaciones, .plan {
  margin-bottom: 1rem;
}

.observaciones h4, .plan h4 {
  margin: 0 0 0.5rem;
  color: #4a5568;
  font-size: 0.95rem;
  font-weight: 600;
}

.observaciones p, .plan p {
  margin: 0;
  color: #4a5568;
  white-space: pre-line;
  line-height: 1.5;
  font-size: 0.95rem;
}

.profesional {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed #e2e8f0;
  font-size: 0.85rem;
  color: #718096;
  display: flex;
  align-items: center;
}

.profesional-label {
  font-weight: 500;
  margin-right: 0.5rem;
}

.profesional-nombre {
  font-style: italic;
}

/* Ajustes para pantallas pequeñas */
@media (max-width: 768px) {
  .modal-container {
    width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }
  
  .filtros {
    flex-direction: column;
    gap: 1rem;
  }
  
  .registro-card {
    border-left: none;
    border-top: 4px solid #4299e1;
  }
  
  .registro-card.control {
    border-top-color: #48bb78;
  }
  
  .registro-card.evaluacion {
    border-top-color: #9f7aea;
  }
  
  .datos-antropometricos {
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .dato {
    min-width: calc(50% - 0.5rem);
  }
}

@media (max-width: 480px) {
  .modal-header {
    padding: 1rem;
  }
  
  .modal-body {
    padding: 1rem;
  }
  
  .dato {
    min-width: 100%;
  }
  
  .registro-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>