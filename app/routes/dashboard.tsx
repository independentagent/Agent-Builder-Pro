import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard" },
    { name: "description", content: "Application Dashboard" },
  ];
};

export async function loader() {
  return json({
    stats: {
      users: 1234,
      activeProjects: 56,
      completedTasks: 789
    }
  });
}

export default function Dashboard() {
  const { stats } = useLoaderData<typeof loader>();
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm">Total Users</h3>
          <p className="text-2xl font-bold">{stats.users}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm">Active Projects</h3>
          <p className="text-2xl font-bold">{stats.activeProjects}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm">Completed Tasks</h3>
          <p className="text-2xl font-bold">{stats.completedTasks}</p>
        </div>
      </div>
    </div>
  );
}
