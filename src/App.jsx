import './index.css';
import React, { useState, useMemo } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Target,
  CreditCard,
  Plus,
  Trash2,
  DollarSign,
} from 'lucide-react';

export default function App() {
  // Estado para las transacciones
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: 'ingreso',
      category: 'Adelanto',
      amount: 90,
      description: 'Adelanto de sueldo semanal',
      date: new Date().toISOString().split('T')[0],
    },
    {
      id: 2,
      type: 'egreso',
      category: 'Transporte',
      amount: 30,
      description: 'Pasajes trabajo',
      date: new Date().toISOString().split('T')[0],
    },
    {
      id: 3,
      type: 'egreso',
      category: 'Suscripciones',
      amount: 72.9,
      description: 'Suscripciones mensuales',
      date: new Date().toISOString().split('T')[0],
    },
  ]);

  // Estado para las metas
  const [goals, setGoals] = useState([
    { id: 1, name: 'Honda Navi', target: 5500, current: 0 },
    { id: 2, name: 'Licorería (Delivery)', target: 10000, current: 0 },
    { id: 3, name: 'Fondo de Emergencia', target: 3000, current: 0 },
  ]);

  // Estado para las deudas
  const [debts, setDebts] = useState([
    {
      id: 1,
      name: 'Préstamo Personal',
      totalInstallments: 18,
      currentInstallment: 13,
      amount: 97.92,
    },
  ]);

  // Estados para el formulario
  const [newTxType, setNewTxType] = useState('egreso');
  const [newTxCategory, setNewTxCategory] = useState('');
  const [newTxAmount, setNewTxAmount] = useState('');
  const [newTxDesc, setNewTxDesc] = useState('');
  const [currency, setCurrency] = useState('PEN');
  const exchangeRate = 3.75; // Tipo de cambio referencial para USD a PEN

  // Categorías predefinidas
  const incomeCategories = [
    'Sueldo Pandero',
    'Adelanto',
    'Brujería',
    'Otros Ingresos',
  ];
  const expenseCategories = [
    'Transporte',
    'Gasolina',
    'Comida',
    'Internet',
    'Gas',
    'Luz',
    'Impuestos',
    'Seguro',
    'Suscripciones',
    'Deudas',
    'Otros Gastos',
  ];

  // Cálculos dinámicos
  const totals = useMemo(() => {
    return transactions.reduce(
      (acc, tx) => {
        const amount = parseFloat(tx.amount);
        if (tx.type === 'ingreso') acc.income += amount;
        else acc.expense += amount;
        acc.balance = acc.income - acc.expense;
        return acc;
      },
      { income: 0, expense: 0, balance: 0 }
    );
  }, [transactions]);

  // Funciones de interacción
  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!newTxCategory || !newTxAmount) return;

    let finalAmount = parseFloat(newTxAmount);
    // Si el ingreso es en dólares, lo convertimos a soles para el balance general
    if (currency === 'USD') {
      finalAmount = finalAmount * exchangeRate;
    }

    const newTx = {
      id: Date.now(),
      type: newTxType,
      category: newTxCategory,
      amount: finalAmount,
      description:
        newTxDesc ||
        (currency === 'USD' ? `Ingreso en USD ($${newTxAmount})` : ''),
      date: new Date().toISOString().split('T')[0],
    };

    setTransactions([newTx, ...transactions]);
    setNewTxAmount('');
    setNewTxDesc('');
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter((tx) => tx.id !== id));
  };

  const updateGoalProgress = (id, amount) => {
    setGoals(
      goals.map((g) => {
        if (g.id === id) {
          const newCurrent = Math.min(g.target, g.current + amount);
          return { ...g, current: newCurrent };
        }
        return g;
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              Mi Dashboard Financiero
            </h1>
            <p className="text-slate-500 mt-1">
              Control interactivo de ingresos, egresos y metas.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2 bg-indigo-50 px-4 py-2 rounded-lg text-indigo-700 font-medium">
            <DollarSign size={20} />
            <span>Tipo de Cambio USD: S/ {exchangeRate}</span>
          </div>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
              <TrendingUp size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                Ingresos Totales
              </p>
              <h2 className="text-2xl font-bold text-slate-900">
                S/ {totals.income.toFixed(2)}
              </h2>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className="p-3 bg-rose-100 text-rose-600 rounded-xl">
              <TrendingDown size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                Egresos Totales
              </p>
              <h2 className="text-2xl font-bold text-slate-900">
                S/ {totals.expense.toFixed(2)}
              </h2>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div
              className={`p-3 rounded-xl ${
                totals.balance >= 0
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'bg-orange-100 text-orange-600'
              }`}
            >
              <Wallet size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Saldo Neto</p>
              <h2
                className={`text-2xl font-bold ${
                  totals.balance >= 0 ? 'text-slate-900' : 'text-orange-600'
                }`}
              >
                S/ {totals.balance.toFixed(2)}
              </h2>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column - Interactions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Add Transaction Form */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                <Plus size={20} className="mr-2 text-indigo-500" /> Nuevo
                Registro
              </h3>
              <form
                onSubmit={handleAddTransaction}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setNewTxType('ingreso')}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                      newTxType === 'ingreso'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Ingreso
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewTxType('egreso')}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                      newTxType === 'egreso'
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Egreso
                  </button>
                </div>

                <div>
                  <select
                    value={newTxCategory}
                    onChange={(e) => setNewTxCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  >
                    <option value="" disabled>
                      Selecciona Categoría...
                    </option>
                    {(newTxType === 'ingreso'
                      ? incomeCategories
                      : expenseCategories
                    ).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex space-x-2">
                  {newTxType === 'ingreso' && (
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-1/3 bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 outline-none"
                    >
                      <option value="PEN">PEN</option>
                      <option value="USD">USD</option>
                    </select>
                  )}
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-slate-500">
                      {currency === 'USD' && newTxType === 'ingreso'
                        ? '$'
                        : 'S/'}
                    </span>
                    <input
                      type="number"
                      placeholder="Monto"
                      value={newTxAmount}
                      onChange={(e) => setNewTxAmount(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 pl-8 focus:ring-2 focus:ring-indigo-500 outline-none"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Descripción (opcional)"
                    value={newTxDesc}
                    onChange={(e) => setNewTxDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors"
                  >
                    Registrar Movimiento
                  </button>
                </div>
              </form>
            </div>

            {/* Transactions List */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800">
                  Movimientos Recientes
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-sm">
                      <th className="p-4 font-medium">Fecha</th>
                      <th className="p-4 font-medium">Categoría</th>
                      <th className="p-4 font-medium">Descripción</th>
                      <th className="p-4 font-medium text-right">Monto</th>
                      <th className="p-4 font-medium text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="p-6 text-center text-slate-400"
                        >
                          No hay movimientos registrados.
                        </td>
                      </tr>
                    ) : (
                      transactions.map((tx) => (
                        <tr
                          key={tx.id}
                          className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                        >
                          <td className="p-4 text-sm text-slate-600">
                            {tx.date}
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                                tx.type === 'ingreso'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-rose-100 text-rose-700'
                              }`}
                            >
                              {tx.category}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-slate-600">
                            {tx.description || '-'}
                          </td>
                          <td
                            className={`p-4 text-right font-medium ${
                              tx.type === 'ingreso'
                                ? 'text-emerald-600'
                                : 'text-rose-600'
                            }`}
                          >
                            {tx.type === 'ingreso' ? '+' : '-'}S/{' '}
                            {tx.amount.toFixed(2)}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleDeleteTransaction(tx.id)}
                              className="text-slate-400 hover:text-rose-500 transition-colors p-1 rounded-md hover:bg-rose-50"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar - Goals & Debts */}
          <div className="space-y-6">
            {/* Metas de Ahorro */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                <Target size={20} className="mr-2 text-indigo-500" /> Metas de
                Ahorro
              </h3>
              <div className="space-y-5">
                {goals.map((goal) => {
                  const progress = Math.min(
                    100,
                    Math.round((goal.current / goal.target) * 100)
                  );
                  return (
                    <div key={goal.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-slate-700">
                          {goal.name}
                        </span>
                        <span className="text-slate-500">
                          S/ {goal.current} / S/ {goal.target}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>

                      {/* Simular aporte rápido (Para la demostración interactiva) */}
                      <div className="mt-2 text-right">
                        <button
                          onClick={() => updateGoalProgress(goal.id, 100)}
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium bg-indigo-50 px-2 py-1 rounded"
                        >
                          + Abonar S/ 100
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Control de Deudas */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                <CreditCard size={20} className="mr-2 text-rose-500" /> Control
                de Deudas
              </h3>
              <div className="space-y-4">
                {debts.map((debt) => (
                  <div
                    key={debt.id}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-100"
                  >
                    <h4 className="font-medium text-slate-800">{debt.name}</h4>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-center flex-1 border-r border-slate-200">
                        <p className="text-xs text-slate-500 uppercase tracking-wide">
                          Progreso
                        </p>
                        <p className="font-bold text-slate-800 mt-1">
                          {debt.currentInstallment}{' '}
                          <span className="text-slate-400 text-sm">
                            / {debt.totalInstallments}
                          </span>
                        </p>
                      </div>
                      <div className="text-center flex-1">
                        <p className="text-xs text-slate-500 uppercase tracking-wide">
                          Cuota
                        </p>
                        <p className="font-bold text-rose-600 mt-1">
                          S/ {debt.amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    {/* Barra de progreso de la deuda */}
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mt-4 overflow-hidden">
                      <div
                        className="bg-rose-400 h-1.5 rounded-full"
                        style={{
                          width: `${
                            (debt.currentInstallment / debt.totalInstallments) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
