<template>
    <div class="users-management">
      <div class="header">
        <h1>Usuarios del Sistema</h1>
        <button @click="openCreateForm" class="add-user-btn">
          + Nuevo Usuario
        </button>
      </div>
  
      <div v-if="users.length > 0" class="users-list">
        <div v-for="user in users" :key="user.id" class="user-card">
          <div class="user-content">
            <div class="user-info">
              <h2>{{ user.name }}</h2>
              <p><strong>Rol:</strong> {{ user.rol }}</p>
            </div>
            <div class="user-actions">
              <button @click="editUser(user)" class="action-btn edit">Editar</button>
              <button @click="confirmDelete(user.id)" class="action-btn delete">Eliminar</button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="no-users">
        <p>Cargando usuarios...</p>
      </div>
  
      <SeeUsers 
        v-if="showForm"
        :user="currentUser"
        @close="closeForm"
        @save="handleSave"
      />
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'
  import SeeUsers from '../../components/SeeUsers/SeeUsers.vue'
  import axios from 'axios'
  
  export default {
    components: { SeeUsers },
    setup() {
      const showForm = ref(false)
      const currentUser = ref(null)
      const users = ref([])
      const isLoading = ref(true)
      
      // Datos estáticos de respaldo
      const staticUsers = [
        { id: 1, name: 'Juanito Perez', rol: 'Administrador' },
        { id: 2, name: 'María García', rol: 'Nutriólogo' },
        { id: 3, name: 'Carlos López', rol: 'Nutriólogo' }
      ]
  
      // Configuración de la API - usa valores por defecto si no hay .env
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''
      const usersEndpoint = import.meta.env.VITE_USERS_ENDPOINT || '/users'
  
      // Función para cargar usuarios
      const fetchUsers = async () => {
        try {
          // Intenta cargar desde el backend si hay URL configurada
          if (apiBaseUrl) {
            const response = await axios.get(`${apiBaseUrl}${usersEndpoint}`)
            users.value = response.data
          } else {
            // Usa datos estáticos si no hay URL configurada
            console.warn('No hay URL de API configurada')
            users.value = staticUsers
          }
        } catch (error) {
          console.error('Error al cargar usuarios:', error)
        } finally {
          isLoading.value = false
        }
      }
  
      onMounted(fetchUsers)
  
      const openCreateForm = () => {
        currentUser.value = null
        showForm.value = true
      }
  
      const editUser = (user) => {
        currentUser.value = { ...user }
        showForm.value = true
      }
  
      const confirmDelete = async (id) => {
        if(confirm('¿Estás seguro de eliminar este usuario?')) {
          try {
            if (apiBaseUrl) {
              await axios.delete(`${apiBaseUrl}${usersEndpoint}/${id}`)
            }
          } catch (error) {
            console.error('Error al eliminar usuario:', error)
            alert('Error al eliminar usuario')
          }
        }
      }
  
      const closeForm = () => {
        showForm.value = false
        currentUser.value = null
      }
  
      const handleSave = async (userData) => {
        try {
          if(userData.id) {
            // Actualizar usuario
            if (apiBaseUrl) {
              await axios.put(`${apiBaseUrl}${usersEndpoint}/${userData.id}`, userData)
            }
          } else {
            // Crear usuario
            if (apiBaseUrl) {
              const response = await axios.post(`${apiBaseUrl}${usersEndpoint}`, userData)
              users.value.push(response.data)
            }
          }
          closeForm()
        } catch (error) {
          console.error('Error al guardar usuario:', error)
          alert('Error al guardar usuario')
        }
      }
  
      return {
        showForm,
        currentUser,
        users,
        isLoading,
        openCreateForm,
        editUser,
        confirmDelete,
        closeForm,
        handleSave
      }
    }
  }
  </script>
  
  <style scoped>
  .users-management {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  h1 {
    color: #2c3e50;
    font-size: 2rem;
    margin: 0;
  }
  
  .add-user-btn {
    background-color: #b35fc3;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .add-user-btn:hover {
    background-color: #9e4fb0;
  }
  
  .users-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
  }
  
  .user-card {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .user-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }
  
  .user-info {
    flex: 1;
  }
  
  .user-info h2 {
    margin: 0 0 0.5rem;
    color: #2c3e50;
    font-size: 1.25rem;
  }
  
  .user-info p {
    margin: 0;
    color: #4a5568;
  }
  
  .user-actions {
    display: flex;
    gap: 0.75rem;
  }
  
  .action-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }
  
  .action-btn.edit {
    background-color: #e2e8f0;
    color: #2c3e50;
  }
  
  .action-btn.edit:hover {
    background-color: #cbd5e0;
  }
  
  .action-btn.delete {
    background-color: #fed7d7;
    color: #e53e3e;
  }
  
  .action-btn.delete:hover {
    background-color: #feb2b2;
  }
  
  .no-users {
    text-align: center;
    padding: 2rem;
    color: #666;
  }
  
  @media (max-width: 768px) {
    .users-management {
      padding: 1.5rem;
    }
    
    .users-list {
      grid-template-columns: 1fr;
    }
    
    .user-content {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .user-actions {
      width: 100%;
      justify-content: flex-end;
      margin-top: 1rem;
    }
  }
  
  @media (max-width: 480px) {
    .users-management {
      padding: 1rem;
    }
    
    .header {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .user-actions {
      flex-direction: row;
      justify-content: space-between;
    }
    
    .action-btn {
      width: 48%;
    }
  }
  </style>