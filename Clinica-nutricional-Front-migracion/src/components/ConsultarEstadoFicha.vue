<template>
  <div class="estado-container">
    <div class="estado-content">
      <h1 class="form-title">Consultar Estado de Fichas</h1>

      <div class="form-section">
        <h2 class="section-title">Buscar por paciente</h2>
        <div class="form-group">
          <label class="form-label">Nombre o RUT</label>
          <input 
            v-model="busqueda" 
            placeholder="Ej: Ana López o 19.753.159-8"
            class="form-input"
            @input="filtrarFichas"
          />
        </div>
      </div>

      <div v-if="cargando" class="loading-state">
        <p>Cargando fichas...</p>
      </div>

      <div v-else-if="fichasFiltradas.length === 0" class="empty-state">
        <p>No se encontraron fichas</p>
      </div>

      <div v-else class="fichas-list">
        <div v-for="ficha in fichasFiltradas" :key="ficha.id" class="ficha-card">
          <h3>{{ ficha.nombre }}</h3>
          <p><strong>RUT:</strong> {{ ficha.rut }}</p>
          <p><strong>Edad:</strong> {{ ficha.edad }} años</p>
          <p><strong>Estado:</strong> 
            <span :class="ficha.estado === 'activo' ? 'estado-activo' : 'estado-inactivo'">
              {{ ficha.estado }}
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import dayjs from "dayjs"

export default {
  name: 'EstadoFichas',
  data() {
    return {
      busqueda: '',
      cargando: false,
      fichas: [],
      fichasFiltradas: []
    }
  },
  created() {
    this.cargarFichas()
  },
  methods: {
    async cargarFichas() {
      this.cargando = true
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/ficha`)
        const fichasAPI = response.data

        this.fichas = fichasAPI.map(ficha => {
          const usuario = ficha.fkUsuario || {}
          const nacimiento = usuario.fechaNacimiento
          const edad = nacimiento ? dayjs().diff(dayjs(nacimiento), 'year') : 'N/A'
          const estado = ficha.fechaEliminacion ? 'inactivo' : 'activo'

          return {
            id: ficha.id,
            nombre: usuario.nombre || 'Sin nombre',
            rut: usuario.rut || 'Sin RUT',
            edad,
            estado
          }
        })

        this.fichasFiltradas = [...this.fichas]
      } catch (error) {
        console.error("Error al cargar fichas:", error)
        this.fichas = []
        this.fichasFiltradas = []
      } finally {
        this.cargando = false
      }
    },
    filtrarFichas() {
      const termino = this.busqueda.toLowerCase()
      this.fichasFiltradas = this.fichas.filter(f =>
        f.nombre.toLowerCase().includes(termino) ||
        f.rut.toString().includes(this.busqueda)
      )
    }
  }
}
</script>

<style scoped>
.estado-container {
  width: 100%;
  padding: 2rem;
  display: flex;
  justify-content: center;
}

.estado-content {
  width: 100%;
  max-width: 900px;
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

.section-title,
.form-label {
  font-size: 1.2rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 0.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #4a5568;
  border-radius: 6px;
  font-size: 1rem;
  background-color: #2d3748;
  color: #f9fafb;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 2rem;
  color: #cbd5e0;
}

.fichas-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.ficha-card {
  background: #2d3748;
  border: 1px solid #4a5568;
  border-radius: 8px;
  padding: 1.5rem;
  color: #edf2f7;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: 0.3s;
}

.ficha-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
}

.estado-activo {
  color: #38a169;
  font-weight: bold;
}

.estado-inactivo {
  color: #e53e3e;
  font-weight: bold;
}
</style>
