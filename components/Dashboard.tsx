/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useMemo } from 'react';
import { Product, Sale, Customer } from '../types';

interface DashboardProps {
  products: Product[];
  sales: Sale[];
  customers: Customer[];
  currency: string;
  shopName: string;
  onNavigate: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  products,
  sales,
  customers,
  currency,
  shopName,
  onNavigate
}) => {
  // Calculate dashboard metrics
  const metrics = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    const weekTimestamp = thisWeek.getTime();

    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    const monthTimestamp = thisMonth.getTime();

    // Today's sales
    const todaySales = sales.filter(s => s.timestamp >= todayTimestamp);
    const todayRevenue = todaySales.reduce((sum, s) => sum + s.total, 0);
    const todayTransactions = todaySales.length;

    // Week's sales
    const weekSales = sales.filter(s => s.timestamp >= weekTimestamp);
    const weekRevenue = weekSales.reduce((sum, s) => sum + s.total, 0);

    // Month's sales
    const monthSales = sales.filter(s => s.timestamp >= monthTimestamp);
    const monthRevenue = monthSales.reduce((sum, s) => sum + s.total, 0);

    // Total revenue
    const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);

    // Low stock items
    const lowStockItems = products.filter(p => p.stock < 10 && p.status === 'active');

    // Out of stock items
    const outOfStockItems = products.filter(p => p.stock === 0 && p.status === 'active');

    // Total inventory value
    const inventoryValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

    // Pending payments
    const pendingPayments = customers.reduce((sum, c) => sum + c.pendingBalance, 0);

    // Top selling products
    const productSales = new Map<string, number>();
    sales.forEach(sale => {
      sale.items.forEach(item => {
        const current = productSales.get(item.productId) || 0;
        productSales.set(item.productId, current + item.quantity);
      });
    });

    const topProducts = Array.from(productSales.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([productId, quantity]) => {
        const product = products.find(p => p.id === productId);
        return { product, quantity };
      })
      .filter(item => item.product);

    // Recent sales
    const recentSales = [...sales].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);

    return {
      todayRevenue,
      todayTransactions,
      weekRevenue,
      monthRevenue,
      totalRevenue,
      lowStockItems,
      outOfStockItems,
      inventoryValue,
      pendingPayments,
      topProducts,
      recentSales,
      totalProducts: products.length,
      totalCustomers: customers.length,
    };
  }, [products, sales, customers]);

  const formatCurrency = (amount: number) => {
    return `${currency}${amount.toFixed(2)}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-[#F8E9DD]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-black text-[#4A4A4A] tracking-tight mb-3">
            Welcome Back! 👋
          </h1>
          <p className="text-lg font-bold text-gray-500 uppercase tracking-widest">
            {shopName} Dashboard
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-slide-up-fade">
          {/* Today's Revenue */}
          <div className="clay-card p-8 hover:scale-105 transition-transform cursor-pointer group" onClick={() => onNavigate('reports')}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-[20px] bg-[#FFB673] flex items-center justify-center text-3xl group-hover:rotate-12 transition-transform">
                💰
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">Today</span>
            </div>
            <h3 className="text-3xl font-black text-[#4A4A4A] mb-2">
              {formatCurrency(metrics.todayRevenue)}
            </h3>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              {metrics.todayTransactions} Transactions
            </p>
          </div>

          {/* This Week */}
          <div className="clay-card p-8 hover:scale-105 transition-transform cursor-pointer group" onClick={() => onNavigate('reports')}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-[20px] bg-[#6A4FBF] flex items-center justify-center text-3xl group-hover:rotate-12 transition-transform">
                📊
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">Week</span>
            </div>
            <h3 className="text-3xl font-black text-[#4A4A4A] mb-2">
              {formatCurrency(metrics.weekRevenue)}
            </h3>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              7 Days Performance
            </p>
          </div>

          {/* This Month */}
          <div className="clay-card p-8 hover:scale-105 transition-transform cursor-pointer group" onClick={() => onNavigate('reports')}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-[20px] bg-[#2AB9A9] flex items-center justify-center text-3xl group-hover:rotate-12 transition-transform">
                📈
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">Month</span>
            </div>
            <h3 className="text-3xl font-black text-[#4A4A4A] mb-2">
              {formatCurrency(metrics.monthRevenue)}
            </h3>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              Monthly Revenue
            </p>
          </div>

          {/* Total Revenue */}
          <div className="clay-card p-8 hover:scale-105 transition-transform cursor-pointer group" onClick={() => onNavigate('reports')}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-[20px] bg-[#FFD447] flex items-center justify-center text-3xl group-hover:rotate-12 transition-transform">
                🎯
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">Total</span>
            </div>
            <h3 className="text-3xl font-black text-[#4A4A4A] mb-2">
              {formatCurrency(metrics.totalRevenue)}
            </h3>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              All Time Revenue
            </p>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="clay-card p-6 hover:scale-105 transition-transform cursor-pointer" onClick={() => onNavigate('inventory')}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[18px] bg-[#FFB673]/20 flex items-center justify-center text-2xl">
                📦
              </div>
              <div>
                <p className="text-2xl font-black text-[#4A4A4A]">{metrics.totalProducts}</p>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400">Products</p>
              </div>
            </div>
          </div>

          <div className="clay-card p-6 hover:scale-105 transition-transform cursor-pointer" onClick={() => onNavigate('customers')}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[18px] bg-[#6A4FBF]/20 flex items-center justify-center text-2xl">
                👥
              </div>
              <div>
                <p className="text-2xl font-black text-[#4A4A4A]">{metrics.totalCustomers}</p>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400">Customers</p>
              </div>
            </div>
          </div>

          <div className="clay-card p-6 hover:scale-105 transition-transform cursor-pointer" onClick={() => onNavigate('inventory')}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[18px] bg-[#2AB9A9]/20 flex items-center justify-center text-2xl">
                💎
              </div>
              <div>
                <p className="text-2xl font-black text-[#4A4A4A]">{formatCurrency(metrics.inventoryValue)}</p>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400">Inventory</p>
              </div>
            </div>
          </div>

          <div className="clay-card p-6 hover:scale-105 transition-transform cursor-pointer" onClick={() => onNavigate('customers')}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[18px] bg-[#FFD447]/20 flex items-center justify-center text-2xl">
                ⏳
              </div>
              <div>
                <p className="text-2xl font-black text-[#4A4A4A]">{formatCurrency(metrics.pendingPayments)}</p>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400">Pending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <button
            onClick={() => onNavigate('pos')}
            className="clay-button-primary p-8 flex flex-col items-center gap-4 hover:scale-105 transition-transform group"
          >
            <div className="text-5xl group-hover:scale-110 transition-transform">🛒</div>
            <span className="text-lg font-black uppercase tracking-widest">New Sale</span>
          </button>

          <button
            onClick={() => onNavigate('inventory')}
            className="clay-button p-8 flex flex-col items-center gap-4 hover:scale-105 transition-transform group text-[#6A4FBF]"
          >
            <div className="text-5xl group-hover:scale-110 transition-transform">📦</div>
            <span className="text-lg font-black uppercase tracking-widest">Add Product</span>
          </button>

          <button
            onClick={() => onNavigate('customers')}
            className="clay-button p-8 flex flex-col items-center gap-4 hover:scale-105 transition-transform group text-[#2AB9A9]"
          >
            <div className="text-5xl group-hover:scale-110 transition-transform">👤</div>
            <span className="text-lg font-black uppercase tracking-widest">Add Customer</span>
          </button>

          <button
            onClick={() => onNavigate('reports')}
            className="clay-button p-8 flex flex-col items-center gap-4 hover:scale-105 transition-transform group text-[#FFB673]"
          >
            <div className="text-5xl group-hover:scale-110 transition-transform">📊</div>
            <span className="text-lg font-black uppercase tracking-widest">View Reports</span>
          </button>
        </div>

        {/* Alerts Section */}
        {(metrics.lowStockItems.length > 0 || metrics.outOfStockItems.length > 0 || metrics.pendingPayments > 0) && (
          <div className="mb-12">
            <h2 className="text-3xl font-black text-[#4A4A4A] mb-6 tracking-tight">⚠️ Alerts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {metrics.outOfStockItems.length > 0 && (
                <div className="clay-card p-6 border-4 border-red-200 hover:scale-105 transition-transform cursor-pointer" onClick={() => onNavigate('inventory')}>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-2xl">
                      🚨
                    </div>
                    <div>
                      <p className="text-2xl font-black text-red-600">{metrics.outOfStockItems.length}</p>
                      <p className="text-xs font-black uppercase tracking-widest text-red-400">Out of Stock</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-gray-600">Immediate restock required</p>
                </div>
              )}

              {metrics.lowStockItems.length > 0 && (
                <div className="clay-card p-6 border-4 border-yellow-200 hover:scale-105 transition-transform cursor-pointer" onClick={() => onNavigate('inventory')}>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-2xl">
                      ⚡
                    </div>
                    <div>
                      <p className="text-2xl font-black text-yellow-600">{metrics.lowStockItems.length}</p>
                      <p className="text-xs font-black uppercase tracking-widest text-yellow-400">Low Stock</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-gray-600">Items below 10 units</p>
                </div>
              )}

              {metrics.pendingPayments > 0 && (
                <div className="clay-card p-6 border-4 border-orange-200 hover:scale-105 transition-transform cursor-pointer" onClick={() => onNavigate('customers')}>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-2xl">
                      💳
                    </div>
                    <div>
                      <p className="text-2xl font-black text-orange-600">{formatCurrency(metrics.pendingPayments)}</p>
                      <p className="text-xs font-black uppercase tracking-widest text-orange-400">Pending</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-gray-600">Outstanding payments</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom Section: Top Products & Recent Sales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Top Selling Products */}
          <div>
            <h2 className="text-3xl font-black text-[#4A4A4A] mb-6 tracking-tight">🔥 Top Products</h2>
            <div className="clay-card p-8">
              {metrics.topProducts.length > 0 ? (
                <div className="space-y-4">
                  {metrics.topProducts.map((item, index) => (
                    <div key={item.product!.id} className="flex items-center gap-4 p-4 bg-white/40 rounded-[20px] hover:scale-105 transition-transform">
                      <div className="w-10 h-10 rounded-full bg-[#FFB673] flex items-center justify-center text-white font-black text-lg">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-[#4A4A4A]">{item.product!.name}</p>
                        <p className="text-sm font-bold text-gray-500">{item.quantity} units sold</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-[#6A4FBF]">{formatCurrency(item.product!.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400 font-bold uppercase tracking-widest py-8">
                  No sales yet
                </p>
              )}
            </div>
          </div>

          {/* Recent Sales */}
          <div>
            <h2 className="text-3xl font-black text-[#4A4A4A] mb-6 tracking-tight">🕒 Recent Sales</h2>
            <div className="clay-card p-8">
              {metrics.recentSales.length > 0 ? (
                <div className="space-y-4">
                  {metrics.recentSales.map((sale) => (
                    <div key={sale.id} className="flex items-center gap-4 p-4 bg-white/40 rounded-[20px] hover:scale-105 transition-transform">
                      <div className="w-10 h-10 rounded-full bg-[#2AB9A9] flex items-center justify-center text-white font-black text-lg">
                        {sale.items.length}
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-[#4A4A4A]">{formatCurrency(sale.total)}</p>
                        <p className="text-sm font-bold text-gray-500">{formatDate(sale.timestamp)}</p>
                      </div>
                      <div className="px-4 py-2 rounded-full bg-[#6A4FBF]/10 text-[#6A4FBF] font-black text-xs uppercase tracking-wider">
                        {sale.paymentType}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400 font-bold uppercase tracking-widest py-8">
                  No recent sales
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
