<template>
  <div class="notas-seguimiento-modal">
    <div class="modal-header">
      <h2>Notas de Seguimiento</h2>
      <button class="close-button" @click="$emit('cerrar')">&times;</button>
    </div>

    <div class="modal-body">
      <div v-if="notas.length === 0" class="no-data">
        <p>No hay notas registradas.</p>
      </div>

      <div v-else class="notas-list">
        <div v-for="(nota, index) in notas" :key="index" class="nota-item">
          <p><strong>{{ formatDate(nota.fecha) }}</strong></p>
          <p>{{ nota.contenido }}</p>
        </div>
      </div>

      <div class="nueva-nota">
        <h3>Agregar nueva nota</h3>
        <textarea v-model="nuevaNota" placeholder="Escribe aquí tu nota..." rows="4"></textarea>
        <button @click="agregarNota" class="submit-button">Guardar Nota</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotasSeguimiento',
  props: {
    pacienteId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      notas: [],
      nuevaNota: ''
    }
  },
  mounted() {
    this.cargarNotasDeEjemplo();
  },
  methods: {
    cargarNotasDeEjemplo() {
      // Simula notas previas
      this.notas = [
        { fecha: '2023-04-10', contenido: 'Nota de seguimiento anterior del paciente.' },
        { fecha: '2023-05-22', contenido: 'Se observó mejoría en los hábitos alimentarios.' }
      ];
    },
    agregarNota() {
      if (!this.nuevaNota.trim()) return;

      this.notas.unshift({
        fecha: new Date().toISOString().split('T')[0],
        contenido: this.nuevaNota.trim()
      });

      this.nuevaNota = '';
    },
    formatDate(fecha) {
      return new Date(fecha).toLocaleDateString('es-CL', {
        day: '2-digit', month: '2-digit', year: 'numeric'
      });
    }
  }
}
</script>

<style scoped>
.notas-seguimiento-modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 700px;
  margin: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-body {
  margin-top: 1.5rem;
}
.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}
.no-data {
  text-align: center;
  color: #666;
  font-style: italic;
  margin-bottom: 1rem;
}
.notas-list {
  margin-bottom: 2rem;
}
.nota-item {
  padding: 1rem;
  background-color: #f7fafc;
  border-radius: 6px;
  margin-bottom: 1rem;
}
.nueva-nota h3 {
  margin-bottom: 0.5rem;
}
textarea {
  width: 100%;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  margin-bottom: 1rem;
}
.submit-button {
  background-color: #b35fc3;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}
</style>
