<template>
  <div class="grafico-container">
    <h3>Evolución del Paciente</h3>
    <canvas ref="graficoCanvas"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js";

export default {
  name: "GraficaEvolucion",
  props: {
    historial: {
      type: Array,
      required: true,
    },
  },
  mounted() {
    this.dibujarGrafico();
  },
  methods: {
    dibujarGrafico() {
      // Ordenamos por fecha de creación de forma ascendente
      const historialOrdenado = [...this.historial].sort((a, b) => {
        return new Date(a.fechaCreacion) - new Date(b.fechaCreacion);
      });

      // Generamos los labels desde las fechas de creación ya ordenadas
      const labels = historialOrdenado.map((item) =>
        new Date(item.fechaCreacion).toLocaleDateString("es-CL")
      );

      const pesos = historialOrdenado.map((item) => item.peso);
      const imcs = historialOrdenado.map((item) => item.imc);

      new Chart(this.$refs.graficoCanvas, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Peso (kg)",
              data: pesos,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              lineTension: 0.3,
            },
            {
              label: "IMC",
              data: imcs,
              borderColor: "rgba(179, 95, 195, 1)",
              backgroundColor: "rgba(179, 95, 195, 0.2)",
              lineTension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          title: {
            display: true,
            text: "Evolución de Peso e IMC",
          },
          legend: {
            position: "top",
          },
        },
      });
    },
  },
};
</script>

<style scoped>
.grafico-container {
  margin-top: 1.5rem;
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}
</style>
