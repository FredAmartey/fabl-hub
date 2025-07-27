"use client";

import React, { useState } from "react";
import {
  CurrencyDollarIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  UserGroupIcon,
  EyeIcon,
  GiftIcon,
  PlayIcon,
  MagnifyingGlassIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  EllipsisVerticalIcon,
  CogIcon,
  BanknotesIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CreditCardIcon,
  BuildingLibraryIcon
} from "@heroicons/react/24/outline";

export default function MonetizationPage() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedView, setSelectedView] = useState("overview");
  const [showSetupModal, setShowSetupModal] = useState(false);

  // Revenue transactions data
  const transactions = [
    {
      id: 1,
      type: "Ad Revenue",
      amount: "$23.40",
      source: "It was over when I scouted the badlands",
      date: "Dec 14, 2025",
      status: "paid",
      icon: PlayIcon,
      description: "Video monetization"
    },
    {
      id: 2,
      type: "Subscription",
      amount: "$5.00",
      source: "Monthly supporter - Alex Chen",
      date: "Dec 13, 2025", 
      status: "paid",
      icon: UserGroupIcon,
      description: "Recurring revenue"
    },
    {
      id: 3,
      type: "Tip",
      amount: "$10.00",
      source: "One-time contribution - Sarah M.",
      date: "Dec 12, 2025",
      status: "paid", 
      icon: GiftIcon,
      description: "Viewer support"
    },
    {
      id: 4,
      type: "Ad Revenue",
      amount: "$45.20",
      source: "Exploring the unknown territories",
      date: "Dec 11, 2025",
      status: "paid",
      icon: PlayIcon,
      description: "Video monetization"
    },
    {
      id: 5,
      type: "Subscription",
      amount: "$5.00",
      source: "Monthly supporter - Jordan K.",
      date: "Dec 10, 2025",
      status: "pending",
      icon: UserGroupIcon,
      description: "Recurring revenue"
    },
    {
      id: 6,
      type: "Tip",
      amount: "$25.00",
      source: "One-time contribution - Mike R.",
      date: "Dec 9, 2025",
      status: "paid",
      icon: GiftIcon,
      description: "Viewer support"
    }
  ];

  // Filter transactions based on selected tab
  const filteredTransactions = transactions.filter(transaction => {
    if (selectedTab === "all") return true;
    if (selectedTab === "pending") return transaction.status === "pending";
    if (selectedTab === "paid") return transaction.status === "paid";
    return true;
  }).filter(transaction => 
    transaction.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate counts for tabs
  const allCount = transactions.length;
  const paidCount = transactions.filter(t => t.status === "paid").length;
  const pendingCount = transactions.filter(t => t.status === "pending").length;

  const getStatusBadge = (status: string) => {
    if (status === "paid") {
      return "bg-emerald-100 text-emerald-700";
    } else if (status === "pending") {
      return "bg-amber-100 text-amber-700";
    }
    return "bg-gray-100 text-gray-700";
  };

  const capitalizeStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Revenue stream configurations
  const revenueStreams = [
    {
      id: "ads",
      name: "Video Ads",
      description: "Monetize your videos with display and video ads",
      status: "active",
      revenue: "$68.60",
      enabled: true,
      requirements: ["Minimum 1K subscribers", "Family-friendly content"],
      icon: PlayIcon,
      color: "blue"
    },
    {
      id: "subscriptions", 
      name: "Channel Subscriptions",
      description: "Monthly recurring revenue from supporters",
      status: "active",
      revenue: "$35.00",
      enabled: true,
      requirements: ["Set subscription tiers"],
      icon: UserGroupIcon,
      color: "emerald"
    },
    {
      id: "tips",
      name: "Tip Jar",
      description: "One-time contributions from viewers",
      status: "active", 
      revenue: "$5.00",
      enabled: true,
      requirements: ["Enable payment processing"],
      icon: GiftIcon,
      color: "amber"
    },
    {
      id: "merchandise",
      name: "Merchandise",
      description: "Sell branded products to your audience",
      status: "not_setup",
      revenue: "$0.00",
      enabled: false,
      requirements: ["Connect merchandise platform", "Upload designs"],
      icon: CreditCardIcon,
      color: "purple"
    },
    {
      id: "premium",
      name: "Premium Content",
      description: "Exclusive content for paying subscribers",
      status: "not_setup",
      revenue: "$0.00", 
      enabled: false,
      requirements: ["Create premium tier", "Upload exclusive content"],
      icon: ShieldCheckIcon,
      color: "indigo"
    }
  ];

  // Subscription tiers
  const subscriptionTiers = [
    {
      id: 1,
      name: "Supporter",
      price: "$5",
      perks: ["Early access to videos", "Supporter badge", "Monthly behind-the-scenes"],
      subscribers: 7,
      monthlyRevenue: "$35.00",
      active: true
    }
  ];

  // Payout information
  const payoutInfo = {
    method: "Bank Transfer",
    accountName: "John Doe",
    accountNumber: "****1234",
    bankName: "Chase Bank",
    minimumPayout: "$50",
    nextPayout: "Jan 5, 2025",
    pendingAmount: "$108.60",
    status: "verified"
  };

  // Tax information
  const taxInfo = {
    country: "United States",
    taxId: "***-**-4567",
    w9Status: "submitted",
    taxWithholding: "0%",
    lastUpdated: "Dec 1, 2025"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-emerald-50 to-yellow-50">
      {/* Warm Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-gradient-to-r from-orange-300/30 to-emerald-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 -right-48 w-96 h-96 bg-gradient-to-r from-yellow-300/30 to-orange-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-float-delayed"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header with Navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <CurrencyDollarIcon className="w-8 h-8 text-emerald-600" />
                <h1 className="text-3xl font-bold text-gray-900">Monetization</h1>
              </div>
              <p className="text-gray-600">Manage your revenue streams and earnings</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:shadow-lg transition-all">
                <ArrowTrendingUpIcon className="w-4 h-4" />
                Optimize Earnings
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white/90 transition-all">
                <DocumentTextIcon className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-200/20 to-orange-200/20 rounded-2xl blur-lg"></div>
            <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg p-2">
              <div className="flex items-center gap-2">
                {[
                  { key: "overview", label: "Overview", icon: ChartBarIcon },
                  { key: "streams", label: "Revenue Streams", icon: CurrencyDollarIcon },
                  { key: "subscriptions", label: "Subscriptions", icon: UserGroupIcon },
                  { key: "payouts", label: "Payouts", icon: BanknotesIcon },
                  { key: "settings", label: "Settings", icon: CogIcon }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setSelectedView(tab.key)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                      selectedView === tab.key
                        ? "bg-white/90 text-orange-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Overview Tab */}
        {selectedView === "overview" && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-200/20 to-orange-200/20 rounded-2xl blur-lg group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-emerald-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <CurrencyDollarIcon className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">This Month</div>
                        <div className="text-3xl font-bold text-gray-900 leading-none">$108.60</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 text-emerald-600 mb-1">
                        <ArrowTrendingUpIcon className="w-5 h-5" />
                        <span className="text-lg font-bold">+32.2%</span>
                      </div>
                      <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">vs last month</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-200/20 to-indigo-200/20 rounded-2xl blur-lg group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <UserGroupIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Subscribers</div>
                        <div className="text-3xl font-bold text-gray-900 leading-none">169</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-blue-600 mb-1">+7 new</div>
                      <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">this month</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-200/20 to-amber-200/20 rounded-2xl blur-lg group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-orange-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <ChartBarIcon className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Avg Transaction</div>
                        <div className="text-3xl font-bold text-gray-900 leading-none">$18.10</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-orange-600 mb-1">6 total</div>
                      <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">last 30 days</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

        {/* Enhanced Navigation with Search */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { key: "all", label: "All", count: allCount },
                  { key: "paid", label: "Paid", count: paidCount },
                  { key: "pending", label: "Pending", count: pendingCount }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setSelectedTab(tab.key)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                      selectedTab === tab.key
                        ? "border-orange-500 text-orange-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.label}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      selectedTab === tab.key
                        ? "bg-orange-100 text-orange-600"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-400 to-amber-400 rounded-xl blur opacity-10 group-focus-within:opacity-25 transition-opacity"></div>
                <div className="relative flex items-center">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors z-10" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white/90 backdrop-blur-xl border border-white/50 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-orange-300 shadow-sm transition-all w-64"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clean Transaction Table */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-200/20 to-orange-200/20 rounded-2xl blur-lg"></div>
          <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg overflow-hidden">
            
            {/* Table Header */}
            <div className="bg-gradient-to-r from-gray-50 to-orange-50/30 px-6 py-4 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700 items-center">
                <div className="col-span-1">Type</div>
                <div className="col-span-5">Source</div>
                <div className="col-span-2 text-center">Amount</div>
                <div className="col-span-2 text-center">Status</div>
                <div className="col-span-2 text-right">Date</div>
              </div>
            </div>

            {/* Transaction Rows */}
            <div className="divide-y divide-gray-100">
              {filteredTransactions.map((transaction) => (
                <div 
                  key={transaction.id}
                  className="px-6 py-4 transition-all duration-200 cursor-pointer hover:bg-gradient-to-r hover:from-orange-50/30 hover:to-amber-50/30"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Type Icon */}
                    <div className="col-span-1">
                      <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
                        <transaction.icon className="w-4 h-4 text-gray-600" />
                      </div>
                    </div>

                    {/* Source */}
                    <div className="col-span-5">
                      <div>
                        <h3 className="font-medium text-gray-900 hover:text-orange-600 transition-colors">
                          {transaction.source}
                        </h3>
                        <p className="text-sm text-gray-500">{transaction.description}</p>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="col-span-2 text-center">
                      <span className="text-lg font-bold text-gray-900">{transaction.amount}</span>
                    </div>

                    {/* Status */}
                    <div className="col-span-2 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(transaction.status)}`}>
                        {capitalizeStatus(transaction.status)}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="col-span-2 text-right">
                      <span className="text-sm text-gray-600">{transaction.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredTransactions.length === 0 && (
              <div className="px-6 py-12 text-center">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <CurrencyDollarIcon className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </div>
          </>
        )}

        {/* Revenue Streams Tab */}
        {selectedView === "streams" && (
          <div className="space-y-6">
            {/* Revenue Stream Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {revenueStreams.map((stream) => (
                <div key={stream.id} className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-200/20 to-orange-200/20 rounded-2xl blur-lg"></div>
                  <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg p-6">
                    
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          stream.status === "active" ? "bg-emerald-100" : "bg-gray-100"
                        }`}>
                          <stream.icon className={`w-5 h-5 ${
                            stream.status === "active" ? "text-emerald-600" : "text-gray-400"
                          }`} />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{stream.name}</h3>
                          <p className="text-sm text-gray-500">{stream.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          stream.status === "active" 
                            ? "bg-emerald-100 text-emerald-700" 
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {stream.status === "active" ? "Active" : "Setup Required"}
                        </span>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <EllipsisVerticalIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Revenue */}
                    <div className="mb-4">
                      <div className="text-2xl font-bold text-gray-900 mb-1">{stream.revenue}</div>
                      <div className="text-sm text-gray-500">This month</div>
                    </div>

                    {/* Requirements/Actions */}
                    <div className="space-y-2">
                      {stream.status === "active" ? (
                        <div className="flex items-center gap-2 text-sm text-emerald-600">
                          <CheckCircleIcon className="w-4 h-4" />
                          <span>Earning revenue</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-700">Setup Requirements:</h4>
                          {stream.requirements.map((req, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                              <span>{req}</span>
                            </div>
                          ))}
                          <button className="w-full mt-3 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:shadow-lg transition-all">
                            Set Up Now
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subscriptions Tab */}
        {selectedView === "subscriptions" && (
          <div className="space-y-6">
            {/* Subscription Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-200/20 to-orange-200/20 rounded-2xl blur-lg"></div>
                <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <UserGroupIcon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-600">Total Subscribers</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">7</div>
                  <div className="text-sm text-emerald-600 font-medium">+2 this month</div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-200/20 to-orange-200/20 rounded-2xl blur-lg"></div>
                <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CurrencyDollarIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-600">Monthly Revenue</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">$35.00</div>
                  <div className="text-sm text-blue-600 font-medium">$5 average</div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-200/20 to-orange-200/20 rounded-2xl blur-lg"></div>
                <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <ArrowTrendingUpIcon className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-600">Growth Rate</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">+40%</div>
                  <div className="text-sm text-purple-600 font-medium">vs last month</div>
                </div>
              </div>
            </div>

            {/* Subscription Tiers */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-200/20 to-orange-200/20 rounded-2xl blur-lg"></div>
              <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg overflow-hidden">
                
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">Subscription Tiers</h3>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:shadow-lg transition-all">
                      <PlusIcon className="w-4 h-4" />
                      Add Tier
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {subscriptionTiers.map((tier) => (
                    <div key={tier.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold text-gray-900">{tier.name}</h4>
                          <span className="text-lg font-bold text-emerald-600">{tier.price}/month</span>
                        </div>
                        <div className="space-y-1">
                          {tier.perks.map((perk, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                              <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                              <span>{perk}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{tier.subscribers} subscribers</div>
                        <div className="text-sm text-gray-500">{tier.monthlyRevenue}/month</div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payouts Tab */}
        {selectedView === "payouts" && (
          <div className="space-y-6">
            {/* Payout Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-200/20 to-orange-200/20 rounded-2xl blur-lg"></div>
                <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <BanknotesIcon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h3 className="font-bold text-gray-900">Next Payout</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-gray-900">{payoutInfo.pendingAmount}</div>
                    <div className="text-sm text-gray-600">Scheduled for {payoutInfo.nextPayout}</div>
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-emerald-600">Minimum threshold met</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-200/20 to-orange-200/20 rounded-2xl blur-lg"></div>
                <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BuildingLibraryIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-gray-900">Payout Method</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium text-gray-900">{payoutInfo.method}</div>
                    <div className="text-sm text-gray-600">{payoutInfo.bankName}</div>
                    <div className="text-sm text-gray-600">Account: {payoutInfo.accountNumber}</div>
                    <div className="flex items-center gap-2">
                      <ShieldCheckIcon className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-emerald-600">Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payout History - reuse existing table */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-200/20 to-orange-200/20 rounded-2xl blur-lg"></div>
              <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Payout History</h3>
                <div className="text-sm text-gray-500 mb-6">Payments processed monthly on the 5th</div>
                
                <div className="space-y-4">
                  {[
                    { month: "December 2025", amount: "$108.60", status: "pending", date: "Jan 5, 2026" },
                    { month: "November 2025", amount: "$89.40", status: "paid", date: "Dec 5, 2025" },
                    { month: "October 2025", amount: "$67.20", status: "paid", date: "Nov 5, 2025" }
                  ].map((payout, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          payout.status === 'paid' ? 'bg-emerald-100' : 'bg-amber-100'
                        }`}>
                          {payout.status === 'paid' ? (
                            <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <ClockIcon className="w-5 h-5 text-amber-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{payout.month}</h4>
                          <p className="text-sm text-gray-600">{payout.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{payout.amount}</div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          payout.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {payout.status === 'paid' ? 'Paid' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {selectedView === "settings" && (
          <div className="space-y-6">
            {/* Payout Settings */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-200/20 to-orange-200/20 rounded-2xl blur-lg"></div>
              <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Payout Settings</h3>
                  <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-white/90 rounded-lg transition-all">
                    <PencilIcon className="w-4 h-4" />
                    Edit
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                    <div className="p-3 bg-white/90 rounded-lg">
                      <div className="font-medium text-gray-900">{payoutInfo.method}</div>
                      <div className="text-sm text-gray-600">{payoutInfo.bankName}</div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Payout</label>
                    <div className="p-3 bg-white/90 rounded-lg">
                      <div className="font-medium text-gray-900">{payoutInfo.minimumPayout}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tax Information */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-200/20 to-orange-200/20 rounded-2xl blur-lg"></div>
              <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Tax Information</h3>
                  <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-white/90 rounded-lg transition-all">
                    <PencilIcon className="w-4 h-4" />
                    Update
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
                    <div>
                      <div className="font-medium text-emerald-900">Tax forms submitted</div>
                      <div className="text-sm text-emerald-700">W-9 form on file • Last updated {taxInfo.lastUpdated}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <div className="text-gray-900">{taxInfo.country}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tax ID</label>
                      <div className="text-gray-900">{taxInfo.taxId}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tax Withholding</label>
                      <div className="text-gray-900">{taxInfo.taxWithholding}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Compliance & Policies */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-200/20 to-orange-200/20 rounded-2xl blur-lg"></div>
              <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Compliance & Policies</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                    <DocumentTextIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Creator Agreement</h4>
                      <p className="text-sm text-gray-600 mt-1">Review terms for monetization features</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Review
                    </button>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                    <InformationCircleIcon className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Content Guidelines</h4>
                      <p className="text-sm text-gray-600 mt-1">Understand what content is eligible for monetization</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Learn More
                    </button>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                    <ShieldCheckIcon className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Privacy Settings</h4>
                      <p className="text-sm text-gray-600 mt-1">Control how your earnings data is used</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Manage
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add CSS for animations */}
        <style jsx>{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
            }
            33% {
              transform: translateY(-20px) rotate(5deg);
            }
            66% {
              transform: translateY(10px) rotate(-5deg);
            }
          }
          @keyframes float-delayed {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
            }
            33% {
              transform: translateY(15px) rotate(-5deg);
            }
            66% {
              transform: translateY(-25px) rotate(5deg);
            }
          }
          .animate-float {
            animation: float 8s ease-in-out infinite;
          }
          .animate-float-delayed {
            animation: float-delayed 8s ease-in-out infinite;
            animation-delay: 2s;
          }
        `}</style>
      </div>
    </div>
  );
}