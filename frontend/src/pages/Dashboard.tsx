
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, DollarSign, Package } from 'lucide-react';

const kpiData = [
  { name: 'On-Time Delivery', value: '94.2%', change: '+2.1%', trend: 'up', icon: CheckCircle, color: 'text-green-500' },
  { name: 'Risk Exposure', value: 'Medium', change: '-5%', trend: 'down', icon: AlertTriangle, color: 'text-yellow-500' },
  { name: 'Total Cost', value: '$2.4M', change: '+12%', trend: 'up', icon: DollarSign, color: 'text-blue-500' },
  { name: 'Inventory Turns', value: '8.3x', change: '+0.7x', trend: 'up', icon: Package, color: 'text-purple-500' },
];

const riskAlerts = [
  { id: 1, severity: 'high', title: 'Suez Canal Congestion', description: 'Delays expected for Asia-Europe routes', time: '2 hours ago' },
  { id: 2, severity: 'medium', title: 'Weather Alert - Port of Los Angeles', description: 'Storm system may impact operations', time: '4 hours ago' },
  { id: 3, severity: 'low', title: 'Supplier Performance Update', description: 'ABC Manufacturing improved rating to A+', time: '6 hours ago' },
];

const agentStatus = [
  { name: 'Ingestion Agent', status: 'active', processes: 1247 },
  { name: 'Risk Scoring Agent', status: 'active', processes: 892 },
  { name: 'Simulation Agent', status: 'active', processes: 156 },
  { name: 'Recommendation Agent', status: 'active', processes: 73 },
  { name: 'Orchestrator Agent', status: 'active', processes: 2368 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.name} className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{kpi.name}</p>
                  <p className="text-2xl font-bold text-white">{kpi.value}</p>
                  <div className="flex items-center mt-2">
                    {kpi.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                      {kpi.change}
                    </span>
                  </div>
                </div>
                                 <div className={`p-3 rounded-full bg-white/10 ${kpi.color}`}>
                   <Icon size={24} />
                 </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {/* Global Risk Map */}
         <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
           <h3 className="text-lg font-semibold text-white mb-4">Global Risk Visualization</h3>
           <div className="h-64 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
                             <p className="text-white/70">Interactive Risk Map</p>
               <p className="text-sm text-white/50">Real-time global supply chain visualization</p>
            </div>
          </div>
        </div>

                 {/* Recent Alerts */}
         <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
           <h3 className="text-lg font-semibold text-white mb-4">Recent Risk Alerts</h3>
           <div className="space-y-3">
             {riskAlerts.map((alert) => (
               <div key={alert.id} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
                <div className={`w-3 h-3 rounded-full mt-2 ${alert.severity === 'high' ? 'bg-red-500' :
                  alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                                 <div className="flex-1 min-w-0">
                   <p className="text-sm font-medium text-white">{alert.title}</p>
                   <p className="text-sm text-white/70 mt-1">{alert.description}</p>
                   <p className="text-xs text-white/50 mt-1">{alert.time}</p>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>

             {/* Agent Status */}
       <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
         <h3 className="text-lg font-semibold text-white mb-4">AI Agent System Status</h3>
         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
           {agentStatus.map((agent) => (
             <div key={agent.name} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                                 <span className="text-xs text-white/70">{agent.processes}</span>
               </div>
               <h4 className="text-sm font-medium text-white mb-1">{agent.name}</h4>
               <p className="text-xs text-green-400 capitalize">{agent.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}