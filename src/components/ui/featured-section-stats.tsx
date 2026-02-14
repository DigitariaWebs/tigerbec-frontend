"use client";

import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function FeaturedSectionStats() {
  const data = [
    { name: "Jan", value: 20 },
    { name: "Feb", value: 40 },
    { name: "Mar", value: 60 },
    { name: "Apr", value: 80 },
    { name: "May", value: 100 },
    { name: "Jun", value: 130 },
    { name: "Jul", value: 160 },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto text-left py-32">
      <div className="px-4">
        <h3 className="text-lg sm:text-xl lg:text-4xl font-medium text-gray-900 dark:text-white mb-16">
          Des outils puissants pour gérer vos véhicules.{" "}
          <span className="text-gray-500 dark:text-gray-400 text-sm sm:text-base lg:text-4xl">
            Notre tableau de bord vous aide à suivre l&#39;inventaire, gérer les ventes, 
            et prendre des décisions éclairées en temps réel.
          </span>
        </h3>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8">
          <div>
            <p className="text-3xl font-medium text-gray-900 dark:text-white">500+</p>
            <p className="text-gray-500 text-md">Véhicules Vendus</p>
          </div>
          <div>
            <p className="text-3xl font-medium text-gray-900 dark:text-white">99.9%</p>
            <p className="text-gray-500 text-md">Satisfaction Client</p>
          </div>
          <div>
            <p className="text-3xl font-medium text-gray-900 dark:text-white">24/7</p>
            <p className="text-gray-500 text-md">Support Disponible</p>
          </div>
          <div>
            <p className="text-3xl font-medium text-gray-900 dark:text-white">&lt;2h</p>
            <p className="text-gray-500 text-md">Temps de Réponse</p>
          </div>
        </div>
      </div>

      {/* Area Chart */}
      <div className="w-full h-48 mt-8">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f2ab30" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f2ab30" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#f2ab30"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPrimary)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
