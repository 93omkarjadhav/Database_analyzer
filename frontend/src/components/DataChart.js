import React from "react";
import {
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie,
  XAxis, YAxis,
  Tooltip, CartesianGrid,
  ResponsiveContainer, Legend,
  Label
} from "recharts";

function DataChart({ data, type }) {
  if (!data || data.length === 0) return null;

  const keys = Object.keys(data[0]);
  if (keys.length < 2) return null;

  // 🔥 Smart X-axis selection
  const preferredKeys = ["name", "category", "title", "city"];

  const xKey =
    preferredKeys.find((k) => keys.includes(k)) ||
    keys.find((k) => isNaN(data[0][k])) ||
    keys[0];

  // 🔥 Smart Y-axis selection
  let yKey = keys.find((k) =>
    data.some((row) => !isNaN(parseFloat(row[k])))
  );

  let finalData = data;

  // ❌ If NO numeric column → auto count
  if (!yKey) {
    const countMap = {};

    data.forEach((row) => {
      const key = row[xKey];
      countMap[key] = (countMap[key] || 0) + 1;
    });

    finalData = Object.keys(countMap).map((k) => ({
      name: k,
      count: countMap[k]
    }));

    yKey = "count";
  } else {
    // ✅ Clean numeric values
    finalData = data.map((row) => ({
      ...row,
      [yKey]: Number(row[yKey]) || 0
    }));
  }

  // 🔥 Format axis labels nicely
  const formatLabel = (key) =>
    key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const xLabel = formatLabel(xKey);
  const yLabel = formatLabel(yKey);

  // ======================
  // 📊 BAR CHART
  // ======================
  if (type === "bar") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={finalData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

          <XAxis dataKey={xKey} stroke="#94a3b8">
            <Label
              value={xLabel}
              position="insideBottom"
              offset={-5}
              fill="#cbd5f5"
            />
          </XAxis>

          <YAxis stroke="#94a3b8">
            <Label
              value={yLabel}
              angle={-90}
              position="insideLeft"
              fill="#cbd5f5"
            />
          </YAxis>

          <Tooltip
            formatter={(value) => value}
            labelFormatter={(label) => `${xLabel}: ${label}`}
          />

          <Legend />

          <Bar
            dataKey={yKey}
            fill="#6366f1"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  // ======================
  // 📈 LINE CHART
  // ======================
  if (type === "line") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={finalData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

          <XAxis dataKey={xKey} stroke="#94a3b8">
            <Label
              value={xLabel}
              position="insideBottom"
              offset={-5}
              fill="#cbd5f5"
            />
          </XAxis>

          <YAxis stroke="#94a3b8">
            <Label
              value={yLabel}
              angle={-90}
              position="insideLeft"
              fill="#cbd5f5"
            />
          </YAxis>

          <Tooltip
            formatter={(value) => value}
            labelFormatter={(label) => `${xLabel}: ${label}`}
          />

          <Legend />

          <Line
            type="monotone"
            dataKey={yKey}
            stroke="#22c55e"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  // ======================
  // 🥧 PIE CHART
  // ======================
  if (type === "pie") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip />
          <Legend />

          <Pie
            data={finalData}
            dataKey={yKey}
            nameKey={xKey}
            fill="#f59e0b"
            label
          />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return null;
}

export default DataChart;