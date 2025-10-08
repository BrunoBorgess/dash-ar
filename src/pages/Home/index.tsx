import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  // Estados para dados dinâmicos
  const [numAnimais, setNumAnimais] = useState(1000);
  const [custoUnitario, setCustoUnitario] = useState(45);
  const [receitaTotal, setReceitaTotal] = useState(65000);
  const [custoVariavel, setCustoVariavel] = useState(30000);
  const [custoFixo, setCustoFixo] = useState(20000);

  // Cálculos dinâmicos
  const custoTotal = custoVariavel + custoFixo;
  const custoPorAnimal = custoTotal / numAnimais;
  const margemBruta = ((receitaTotal - custoVariavel) / receitaTotal) * 100;
  const lucro = receitaTotal - custoTotal;
  const custoPorKg = custoTotal / 4000; // Assumindo 4kg por animal em média

  // KPIs atualizados
  const kpis = [
    { title: 'Custo Total', value: `R$ ${custoTotal.toLocaleString('pt-BR')}`, color: 'bg-red-500' },
    { title: 'Custo/Animal', value: `R$ ${custoPorAnimal.toFixed(2)}`, color: 'bg-orange-500' },
    { title: 'Custo/kg', value: `R$ ${custoPorKg.toFixed(2)}`, color: 'bg-yellow-500' },
    { title: 'Margem Bruta', value: `${margemBruta.toFixed(1)}%`, color: 'bg-green-500' },
  ];

  // Gráfico de Barras atualizado com escalas ajustadas para visibilidade
  const barData = {
    labels: ['Custo Total (k)', 'Custo/Animal', 'Custo/kg', 'Margem Bruta %'],
    datasets: [{
      label: 'Valores',
      data: [custoTotal / 1000, custoPorAnimal, custoPorKg, margemBruta],
      backgroundColor: ['#EF4444', '#F97316', '#FBBF24', '#10B981'],
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  // Gráfico de Pizza atualizado
  const pieData = {
    labels: ['Variáveis', 'Fixos'],
    datasets: [{
      data: [custoVariavel, custoFixo],
      backgroundColor: ['#3B82F6', '#6B7280'],
      borderWidth: 0,
    }],
  };

  // Gráfico de Linha com dados simulados
  const lineData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
    datasets: [{
      label: 'Lucro Mensal',
      data: [lucro * 0.8, lucro * 0.9, lucro, lucro * 1.1, lucro * 1.2],
      borderColor: '#8B5CF6',
      backgroundColor: 'rgba(139, 92, 246, 0.2)',
      tension: 0.4,
      fill: true,
      borderWidth: 3,
      pointRadius: 5,
      pointBackgroundColor: '#8B5CF6',
    }],
  };

  const barOptions = {
    responsive: true,
    plugins: { 
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context) {
            let value = context.parsed.y;
            if (context.dataIndex === 0) value *= 1000; // Ajuste para Custo Total
            return context.label + ': R$ ' + Number(value).toLocaleString('pt-BR');
          }
        }
      }
    },
    scales: { 
      y: { 
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.1)' },
        ticks: { 
          color: 'gray',
          callback: function(value) {
            return Number(value).toLocaleString('pt-BR');
          }
        }
      },
      x: { grid: { display: false } }
    },
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: { 
      legend: { 
        position: 'bottom',
        labels: { 
          padding: 20,
          font: { size: 12 },
          usePointStyle: true
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return context.label + ': R$ ' + Number(context.parsed).toLocaleString('pt-BR');
          }
        }
      }
    },
    maintainAspectRatio: false,
    animation: {
      duration: 1000
    },
  };

  const lineOptions = {
    responsive: true,
    plugins: { 
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context) {
            return 'Lucro: R$ ' + Number(context.parsed.y).toLocaleString('pt-BR');
          }
        }
      }
    },
    scales: { 
      y: { 
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.1)' },
        ticks: { 
          callback: function(value) {
            return 'R$ ' + Number(value).toLocaleString('pt-BR');
          }
        }
      },
      x: { grid: { display: false } }
    },
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard de Custos</h1>
            <p className="text-sm text-gray-600">Resultados e Indicadores - 08/10/2025</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-700 bg-white px-4 py-2 rounded-lg shadow-sm">Lucro Total: R$ {lucro.toLocaleString('pt-BR')}</p>
          </div>
        </div>

        {/* Controles Interativos */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nº de Animais</label>
            <input
              type="range"
              min="500"
              max="2000"
              value={numAnimais}
              onChange={(e) => setNumAnimais(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-gray-500">{numAnimais}</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Custo Unitário (R$)</label>
            <input
              type="range"
              min="30"
              max="60"
              value={custoUnitario}
              onChange={(e) => setCustoUnitario(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-gray-500">R$ {custoUnitario}</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Receita Total (R$)</label>
            <input
              type="range"
              min="50000"
              max="100000"
              value={receitaTotal}
              onChange={(e) => setReceitaTotal(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-gray-500">R$ {receitaTotal.toLocaleString('pt-BR')}</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Custo Variável (R$)</label>
            <input
              type="range"
              min="20000"
              max="50000"
              value={custoVariavel}
              onChange={(e) => setCustoVariavel(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-gray-500">R$ {custoVariavel.toLocaleString('pt-BR')}</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Custo Fixo (R$)</label>
            <input
              type="range"
              min="10000"
              max="30000"
              value={custoFixo}
              onChange={(e) => setCustoFixo(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-gray-500">R$ {custoFixo.toLocaleString('pt-BR')}</span>
          </div>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {kpis.map((kpi, idx) => (
            <div key={idx} className={`${kpi.color} p-4 sm:p-6 rounded-xl shadow-lg text-white hover:shadow-xl transition-shadow duration-200 flex flex-col justify-center`}>
              <h3 className="text-sm font-medium opacity-90 truncate">{kpi.title}</h3>
              <p className="text-xl sm:text-2xl font-bold mt-1">{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Bar Chart */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
            <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-800">Custos por Categoria</h3>
            <div className="h-48 sm:h-56">
              <Bar options={barOptions} data={barData} />
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
            <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-800">Distribuição Custos</h3>
            <div className="h-48 sm:h-56">
              <Pie options={pieOptions} data={pieData} />
            </div>
          </div>

          {/* Line Chart */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
            <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-800">Tendência Lucro</h3>
            <div className="h-48 sm:h-56">
              <Line options={lineOptions} data={lineData} />
            </div>
          </div>
        </div>

        {/* Tabela Simples */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg overflow-x-auto">
          <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">Fórmulas dos Indicadores</h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Indicador</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fórmula</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50"><td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-900">Custo Total Lote</td><td className="px-4 sm:px-6 py-4 text-sm text-gray-500">Soma de todos os custos associados</td></tr>
              <tr className="hover:bg-gray-50"><td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-900">Custo por Animal</td><td className="px-4 sm:px-6 py-4 text-sm text-gray-500">Custo total / nº de animais</td></tr>
              <tr className="hover:bg-gray-50"><td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-900">Margem Bruta</td><td className="px-4 sm:px-6 py-4 text-sm text-gray-500">Receita - custo variável</td></tr>
              <tr className="hover:bg-gray-50"><td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-900">Lucro</td><td className="px-4 sm:px-6 py-4 text-sm text-gray-500">Receita total - Custo total</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;