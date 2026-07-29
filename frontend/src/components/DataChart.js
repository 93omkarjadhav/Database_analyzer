import React from "react";
import {
  BarChart,
  Bar,
  Cell,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Label,
} from "recharts";

function DataChart({ data, type }) {
  if (!data || data.length === 0) return null;

  const keys = Object.keys(data[0]);
  if (keys.length < 2) return null;

  const preferredKeys = ["name", "category", "title", "city"];

  const xKey =
    preferredKeys.find((k) => keys.includes(k)) ||
    keys.find((k) => isNaN(data[0][k])) ||
    keys[0];

  let yKey = keys.find((k) => data.some((row) => !isNaN(parseFloat(row[k]))));

  let finalData = data;

  if (!yKey) {
    const countMap = {};

    data.forEach((row) => {
      const key = row[xKey];
      countMap[key] = (countMap[key] || 0) + 1;
    });

    finalData = Object.keys(countMap).map((k) => ({
      name: k,
      count: countMap[k],
    }));

    yKey = "count";
  } else {
    finalData = data.map((row) => ({
      ...row,
      [yKey]: Number(row[yKey]) || 0,
    }));
  }

  const formatLabel = (key) =>
    key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const xLabel = formatLabel(xKey);
  const yLabel = formatLabel(yKey);
  const axisStroke = "#64748b";
  const labelFill = "#475569";
  const gridStroke = "#cbd5e1";

  const palette = [
    "#22c55e",
    "#38bdf8",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#14b8a6",
    "#f97316",
    "#0ea5e9",
    "#a855f7",
  ];

  const fillByIndex = (index) => palette[index % palette.length];

  const getSliceColors = () => finalData.map((_, index) => fillByIndex(index));

  if (type === "bar") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={finalData} margin={{ top: 12, right: 12, left: 0, bottom: 18 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />

          <XAxis dataKey={xKey} stroke={axisStroke} tick={{ fontSize: 12 }}>
            <Label value={xLabel} position="insideBottom" offset={-5} fill={labelFill} />
          </XAxis>

          <YAxis stroke={axisStroke} tick={{ fontSize: 12 }}>
            <Label value={yLabel} angle={-90} position="insideLeft" fill={labelFill} />
          </YAxis>

          <Tooltip formatter={(value) => value} labelFormatter={(label) => `${xLabel}: ${label}`} />
          <Legend wrapperStyle={{ fontSize: "12px" }} />

          <Bar dataKey={yKey} radius={[6, 6, 0, 0]}>
            {finalData.map((entry, index) => (
              <Cell key={`bar-cell-${index}`} fill={fillByIndex(index)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (type === "line") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={finalData} margin={{ top: 12, right: 12, left: 0, bottom: 18 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />

          <XAxis dataKey={xKey} stroke={axisStroke} tick={{ fontSize: 12 }}>
            <Label value={xLabel} position="insideBottom" offset={-5} fill={labelFill} />
          </XAxis>

          <YAxis stroke={axisStroke} tick={{ fontSize: 12 }}>
            <Label value={yLabel} angle={-90} position="insideLeft" fill={labelFill} />
          </YAxis>

          <Tooltip formatter={(value) => value} labelFormatter={(label) => `${xLabel}: ${label}`} />
          <Legend wrapperStyle={{ fontSize: "12px" }} />

          <Line type="monotone" dataKey={yKey} stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  if (type === "pie") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          <Pie data={finalData} dataKey={yKey} nameKey={xKey} label>
            {finalData.map((entry, index) => (
              <Cell key={`slice-${index}`} fill={fillByIndex(index)} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return null;
}

export default DataChart;
