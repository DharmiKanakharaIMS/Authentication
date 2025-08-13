import {
  ChartBar,
  Users,
  DollarSign,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const lineData = [
  { name: "Jan", users: 400 },
  { name: "Feb", users: 800 },
  { name: "Mar", users: 600 },
  { name: "Apr", users: 1000 },
  { name: "May", users: 1200 },
  { name: "Jun", users: 1100 },
];

const pieData = [
  { name: "Admin", value: 3 },
  { name: "Instructor", value: 6 },
  { name: "Student", value: 21 },
];

const COLORS = ["#6366f1", "#10b981", "#f59e0b"];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value="1,024" icon={<Users className="text-blue-500" />} />
        <StatCard title="Active Sessions" value="512" icon={<Activity className="text-green-500" />} />
        <StatCard title="Monthly Revenue" value="$12,300" icon={<DollarSign className="text-yellow-500" />} />
        <StatCard title="New Signups" value="84" icon={<ChartBar className="text-purple-500" />} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow col-span-2">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">User Growth (6 months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">User Roles</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">Recent Activity</h3>
        <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          <li>🟢 John Doe signed up 5 mins ago</li>
          <li>🟢 Admin updated permissions 30 mins ago</li>
          <li>🟢 Payment received from Jane Smith</li>
          <li>🔴 Login failed for user123</li>
          <li>🟢 New course published: React Mastery</li>
        </ul>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow p-4 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-medium text-gray-500 dark:text-gray-300">{title}</h2>
        {icon}
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}
