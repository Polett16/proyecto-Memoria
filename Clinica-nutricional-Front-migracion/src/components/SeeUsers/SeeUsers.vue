<template>
    <div class="modal-overlay" @click.self="close">
      <div class="user-form">
        <h2>{{ user ? 'Editar Usuario' : 'Crear Nuevo Usuario' }}</h2>
        
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>Nombre Completo</label>
            <input v-model="formData.name" type="text" required>
          </div>
          
          <div class="form-group">
            <label>Correo Electrónico</label>
            <input v-model="formData.email" type="email" required>
          </div>
          
          <div class="form-group">
            <label>Rol</label>
            <select v-model="formData.rol" required>
              <option value="">Seleccione un rol</option>
              <option value="Administrador">Administrador</option>
              <option value="Nutriólogo">Nutriólogo</option>
            </select>
          </div>
          
          <div class="form-group" v-if="!user">
            <label>Contraseña</label>
            <input v-model="formData.password" :type="showPassword ? 'text' : 'password'" required>
            <button type="button" class="toggle-password" @click="showPassword = !showPassword">
              {{ showPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="close" class="cancel-btn">Cancelar</button>
            <button type="submit" class="save-btn">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, watch } from 'vue'
  
  export default {
    props: {
      user: {
        type: Object,
        default: null
      }
    },
    emits: ['close', 'save'],
    setup(props, { emit }) {
      const formData = ref({
        name: '',
        email: '',
        rol: '',
        password: '' 
      })
      const showPassword = ref(false)
  
      watch(() => props.user, (newUser) => {
        if(newUser) {
          // Copiar datos del usuario a editar
          formData.value = { 
            name: newUser.name,
            email: newUser.email,
            rol: newUser.rol
          }
        } else {
          // Resetear formulario para nuevo usuario
          formData.value = {
            name: '',
            email: '',
            rol: '',
            password: ''
          }
        }
      }, { immediate: true })
  
      const handleSubmit = () => {
        // Validación de campos requeridos
        if(!formData.value.name || !formData.value.email || !formData.value.rol) {
          alert('Por favor complete todos los campos requeridos')
          return
        }
        
        // Validación de contraseña creacion
        if(!props.user && !formData.value.password) {
          alert('Por favor ingrese una contraseña')
          return
        }
        

        const userData = { ...formData.value }
        
        emit('save', userData)
      }
  
      const close = () => {
        emit('close')
      }
  
      return {
        formData,
        showPassword,
        handleSubmit,
        close
      }
    }
  }
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .user-form {
    background: white;
    border-radius: 8px;
    padding: 2rem;
    width: 100%;
    max-width: 500px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }
  
  h2 {
    color: #2c3e50;
    margin-top: 0;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
    position: relative;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #4a5568;
  }
  
  input, select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 1rem;
  }
  
  input:focus, select:focus {
    outline: none;
    border-color: #b35fc3;
  }
  
  .toggle-password {
    position: absolute;
    right: 10px;
    top: 35px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
  }
  
  .cancel-btn {
    background-color: #e2e8f0;
    color: #4a5568;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
  }
  
  .save-btn {
    background-color: #b35fc3;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
  }
  
  .save-btn:hover {
    background-color: #9e4fb0;
  }
  
  @media (max-width: 600px) {
    .user-form {
      padding: 1.5rem;
      margin: 1rem;
    }
    
    .form-actions {
      flex-direction: column;
    }
    
    .cancel-btn, .save-btn {
      width: 100%;
    }
  }
  </style>