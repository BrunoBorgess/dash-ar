import React, { useState, useRef } from 'react';
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
import type { ChartOptions, TooltipItem } from 'chart.js';
import { toast, Toaster } from 'react-hot-toast';

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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState(['Jan', 'Fev', 'Mar', 'Abr', 'Mai']);
  const [isLoading, setIsLoading] = useState(false);
  const barChartRef = useRef<any>(null);
  const pieChartRef = useRef<any>(null);
  const lineChartRef = useRef<any>(null);

  // Cálculos dinâmicos
  const custoTotal = custoVariavel + custoFixo;
  const custoPorAnimal = custoTotal / numAnimais;
  const margemBruta = ((receitaTotal - custoVariavel) / receitaTotal) * 100;
  const lucro = receitaTotal - custoTotal;
  const custoPorKg = custoTotal / 4000; // Assumindo 4kg por animal em média

  // Validação de limites
  const validateValue = (value: number, min: number, max: number, label: string) => {
    if (value < min || value > max) {
      toast.error(`${label} deve estar entre ${min} e ${max}.`);
      return false;
    }
    return true;
  };

  // Função para atualizar valores com validação
  const updateValue = (setter: React.Dispatch<React.SetStateAction<number>>, value: number, min: number, max: number, label: string) => {
    if (validateValue(value, min, max, label)) {
      setIsLoading(true);
      setTimeout(() => {
        setter(value);
        setIsLoading(false);
      }, 300);
    }
  };

  // KPIs atualizados
  const kpis = [
    { title: 'Custo Total', value: `R$ ${custoTotal.toLocaleString('pt-BR')}`, color: 'bg-red-500' },
    { title: 'Custo/Animal', value: `R$ ${custoPorAnimal.toFixed(2)}`, color: 'bg-orange-500' },
    { title: 'Custo/kg', value: `R$ ${custoPorKg.toFixed(2)}`, color: 'bg-yellow-500' },
    { title: 'Margem Bruta', value: `${margemBruta.toFixed(1)}%`, color: 'bg-green-500' },
  ];

  // Dados simulados para o gráfico de linha (12 meses de 2025)
  const monthlyData = [
    { month: 'Jan', date: '2025-01-01', lucro: (receitaTotal - (custoVariavel + custoFixo)) * 0.8 },
    { month: 'Fev', date: '2025-02-01', lucro: (receitaTotal - (custoVariavel + custoFixo)) * 0.85 },
    { month: 'Mar', date: '2025-03-01', lucro: (receitaTotal - (custoVariavel + custoFixo)) * 0.9 },
    { month: 'Abr', date: '2025-04-01', lucro: (receitaTotal - (custoVariavel + custoFixo)) },
    { month: 'Mai', date: '2025-05-01', lucro: (receitaTotal - (custoVariavel + custoFixo)) * 1.1 },
    { month: 'Jun', date: '2025-06-01', lucro: (receitaTotal - (custoVariavel + custoFixo)) * 1.15 },
    { month: 'Jul', date: '2025-07-01', lucro: (receitaTotal - (custoVariavel + custoFixo)) * 1.2 },
    { month: 'Ago', date: '2025-08-01', lucro: (receitaTotal - (custoVariavel + custoFixo)) * 1.25 },
    { month: 'Set', date: '2025-09-01', lucro: (receitaTotal - (custoVariavel + custoFixo)) * 1.3 },
    { month: 'Out', date: '2025-10-01', lucro: (receitaTotal - (custoVariavel + custoFixo)) * 1.35 },
    { month: 'Nov', date: '2025-11-01', lucro: (receitaTotal - (custoVariavel + custoFixo)) * 1.4 },
    { month: 'Dez', date: '2025-12-01', lucro: (receitaTotal - (custoVariavel + custoFixo)) * 1.45 },
  ];

  // Filtrar dados com base nos meses selecionados
  const filteredData = monthlyData.filter(data => selectedMonths.includes(data.month));
  const isValidMonthSelection = filteredData.length > 0;

  // Gráfico de Barras
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

  // Gráfico de Pizza
  const pieData = {
    labels: ['Variáveis', 'Fixos'],
    datasets: [{
      data: [custoVariavel, custoFixo],
      backgroundColor: ['#3B82F6', '#6B7280'],
      borderWidth: 0,
    }],
  };

  // Gráfico de Linha
  const lineData = {
    labels: filteredData.map(data => data.month),
    datasets: [{
      label: 'Lucro Mensal',
      data: filteredData.map(data => data.lucro),
      borderColor: '#8B5CF6',
      backgroundColor: 'rgba(139, 92, 246, 0.2)',
      tension: 0.4,
      fill: true,
      borderWidth: 3,
      pointRadius: 5,
      pointBackgroundColor: '#8B5CF6',
    }],
  };

  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context: TooltipItem<'bar'>) {
            let value = context.parsed.y;
            if (context.dataIndex === 0) value *= 1000;
            return context.label + ': R$ ' + Number(value).toLocaleString('pt-BR');
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
        ticks: {
          color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'gray',
          callback: function(value: number | string) {
            return Number(value).toLocaleString('pt-BR');
          }
        }
      },
      x: { grid: { display: false }, ticks: { color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'gray' } }
    },
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const
    },
  };

  const pieOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          font: { size: 12 },
          usePointStyle: true,
          color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'gray'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: TooltipItem<'pie'>) {
            return context.label + ': R$ ' + Number(context.parsed).toLocaleString('pt-BR');
          }
        }
      }
    },
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const
    },
  };

  const lineOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context: TooltipItem<'line'>) {
            return context.label + ': R$ ' + Number(context.parsed.y).toLocaleString('pt-BR');
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
        ticks: {
          color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'gray',
          callback: function(value: number | string) {
            return Number(value).toLocaleString('pt-BR');
          }
        }
      },
      x: { grid: { display: false }, ticks: { color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'gray' } }
    },
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const
    },
  };

  // Função para exportar dados como CSV
  const exportToCSV = () => {
    setIsLoading(true);
    setTimeout(() => {
      const csvContent = [
        ['Indicador', 'Valor'],
        ['Custo Total', custoTotal],
        ['Custo por Animal', custoPorAnimal.toFixed(2)],
        ['Custo por kg', custoPorKg.toFixed(2)],
        ['Margem Bruta', margemBruta.toFixed(1) + '%'],
        ['Lucro', lucro],
        ['', ''],
        ['Gráfico de Barras', ''],
        ['Label', 'Valor'],
        ...barData.labels.map((label, index) => [label, barData.datasets[0].data[index]]),
        ['', ''],
        ['Gráfico de Pizza', ''],
        ['Label', 'Valor'],
        ...pieData.labels.map((label, index) => [label, pieData.datasets[0].data[index]]),
        ['', ''],
        ['Gráfico de Linha', ''],
        ['Mês', 'Lucro Mensal'],
        ...filteredData.map(data => [data.month, data.lucro]),
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `dashboard_data_${selectedMonths.join('_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsLoading(false);
      toast.success('Dados exportados com sucesso!');
    }, 500);
  };

  // Função para exportar gráfico como PNG
  const exportChartAsPNG = (chartRef: React.RefObject<any>, chartName: string) => {
    if (chartRef.current) {
      const url = chartRef.current.toBase64Image();
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${chartName}.png`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Gráfico ${chartName} exportado com sucesso!`);
    }
  };

  // Função para resetar controles
  const resetControls = () => {
    setIsLoading(true);
    setTimeout(() => {
      setNumAnimais(1000);
      setCustoUnitario(45);
      setReceitaTotal(65000);
      setCustoVariavel(30000);
      setCustoFixo(20000);
      setSelectedMonths(['Jan', 'Fev', 'Mar', 'Abr', 'Mai']);
      setIsLoading(false);
      toast.success('Controles resetados com sucesso!');
    }, 500);
  };

  // Função para manipular seleção de meses
  const toggleMonth = (month: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setSelectedMonths(prev =>
        prev.includes(month)
          ? prev.filter(m => m !== month)
          : [...prev, month]
      );
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900'} p-4 sm:p-6`}>
      <Toaster position="top-right" toastOptions={{ style: { background: isDarkMode ? '#1F2937' : '#FFF', color: isDarkMode ? '#FFF' : '#000' } }} />
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold">Dashboard de Custos</h1>
            <p className="text-sm opacity-75">Resultados e Indicadores - 08/10/2025</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              title={isDarkMode ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <p className={`text-lg font-semibold ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'} px-4 py-2 rounded-lg shadow-sm`}>
              Lucro Total: R$ {lucro.toLocaleString('pt-BR')}
            </p>
          </div>
        </div>

        {/* Controles Interativos */}
        <div className={`p-4 sm:p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} transition-colors duration-300 relative ${isLoading ? 'opacity-50' : ''}`}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Controles Interativos</h2>
            <div className="space-x-2">
              <button
                onClick={resetControls}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Resetar Tudo
              </button>
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Exportar CSV
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            {[
              { label: 'Nº de Animais', value: numAnimais, setValue: setNumAnimais, min: 500, max: 2000, unit: '' },
              { label: 'Custo Unitário (R$)', value: custoUnitario, setValue: setCustoUnitario, min: 30, max: 60, unit: 'R$ ' },
              { label: 'Receita Total (R$)', value: receitaTotal, setValue: setReceitaTotal, min: 50000, max: 100000, unit: 'R$ ', format: (v: number) => v.toLocaleString('pt-BR') },
              { label: 'Custo Variável (R$)', value: custoVariavel, setValue: setCustoVariavel, min: 20000, max: 50000, unit: 'R$ ', format: (v: number) => v.toLocaleString('pt-BR') },
              { label: 'Custo Fixo (R$)', value: custoFixo, setValue: setCustoFixo, min: 10000, max: 30000, unit: 'R$ ', format: (v: number) => v.toLocaleString('pt-BR') },
            ].map((control, idx) => (
              <div key={idx} className="relative group">
                <label className="block text-sm font-medium mb-1">{control.label}</label>
                <input
                  type="range"
                  min={control.min}
                  max={control.max}
                  value={control.value}
                  onChange={(e) => updateValue(control.setValue, Number(e.target.value), control.min, control.max, control.label)}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer transition-all duration-300 group-hover:ring-2 group-hover:ring-blue-500"
                />
                <span className="text-sm opacity-75">{control.unit}{control.format ? control.format(control.value) : control.value}</span>
              </div>
            ))}
          </div>
          {/* Seletor de Meses */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Meses para Tendência de Lucro</label>
            <div className="flex flex-wrap gap-2">
              {monthlyData.map((data) => (
                <button
                  key={data.month}
                  onClick={() => toggleMonth(data.month)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedMonths.includes(data.month)
                      ? 'bg-blue-500 text-white'
                      : isDarkMode
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
                >
                  {data.month}
                </button>
              ))}
            </div>
            {!isValidMonthSelection && (
              <p className="text-red-500 text-sm mt-2">Selecione pelo menos um mês para visualizar o gráfico.</p>
            )}
          </div>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {kpis.map((kpi, idx) => (
            <div
              key={idx}
              className={`${kpi.color} p-4 sm:p-6 rounded-xl shadow-lg text-white hover:shadow-xl hover:scale-105 transition-all duration-200 flex flex-col justify-center`}
            >
              <h3 className="text-sm font-medium opacity-90 truncate">{kpi.title}</h3>
              <p className="text-xl sm:text-2xl font-bold mt-1">{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Bar Chart */}
          <div className={`p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} relative ${isLoading ? 'opacity-50' : ''}`}>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base sm:text-lg font-semibold">Custos por Categoria</h3>
              <button
                onClick={() => exportChartAsPNG(barChartRef, 'Custos_por_Categoria')}
                className="px-2 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                Exportar PNG
              </button>
            </div>
            <div className="h-48 sm:h-56">
              <Bar ref={barChartRef} options={barOptions} data={barData} />
            </div>
          </div>

          {/* Pie Chart */}
          <div className={`p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} relative ${isLoading ? 'opacity-50' : ''}`}>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base sm:text-lg font-semibold">Distribuição Custos</h3>
              <button
                onClick={() => exportChartAsPNG(pieChartRef, 'Distribuicao_Custos')}
                className="px-2 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                Exportar PNG
              </button>
            </div>
            <div className="h-48 sm:h-56">
              <Pie ref={pieChartRef} options={pieOptions} data={pieData} />
            </div>
          </div>

          {/* Line Chart */}
          <div className={`p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} relative ${isLoading ? 'opacity-50' : ''}`}>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base sm:text-lg font-semibold">Tendência Lucro</h3>
              <button
                onClick={() => exportChartAsPNG(lineChartRef, 'Tendencia_Lucro')}
                className="px-2 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                Exportar PNG
              </button>
            </div>
            <div className="h-48 sm:h-56">
              {isValidMonthSelection ? (
                <Line ref={lineChartRef} options={lineOptions} data={lineData} />
              ) : (
                <div className="flex items-center justify-center h-full text-center text-red-500">
                  Selecione pelo menos um mês para visualizar o gráfico.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabela Simples */}
        <div className={`p-4 sm:p-6 rounded-xl shadow-lg overflow-x-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'} transition-colors duration-300`}>
          <h3 className="text-base sm:text-lg font-semibold mb-4">Fórmulas dos Indicadores</h3>
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Indicador</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Fórmula</th>
              </tr>
            </thead>
            <tbody className={`${isDarkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}`}>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 sm:px-6 py-4 text-sm font-medium">Custo Total Lote</td>
                <td className="px-4 sm:px-6 py-4 text-sm">Soma de todos os custos associados</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 sm:px-6 py-4 text-sm font-medium">Custo por Animal</td>
                <td className="px-4 sm:px-6 py-4 text-sm">Custo total / nº de animais</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 sm:px-6 py-4 text-sm font-medium">Margem Bruta</td>
                <td className="px-4 sm:px-6 py-4 text-sm">Receita - custo variável</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 sm:px-6 py-4 text-sm font-medium">Lucro</td>
                <td className="px-4 sm:px-6 py-4 text-sm">Receita total - Custo total</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;