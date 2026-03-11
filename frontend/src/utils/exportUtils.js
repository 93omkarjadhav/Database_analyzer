import * as XLSX from "xlsx";

export const exportCSV = (data) => {
  if (!data || !Array.isArray(data)) return;
  const headers = Object.keys(data[0]).join(",");
  const rows = data.map((r) => Object.values(r).join(","));
  const csv = [headers, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ai-result.csv";
  a.click();
};

export const exportExcel = (data) => {
  if (!data || !Array.isArray(data)) return;
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Results");
  XLSX.writeFile(workbook, "ai-result.xlsx");
};

export const exportJSON = (data) => {
  if (!data) return;
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ai-result.json";
  a.click();
};

export const exportText = (text) => {
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ai-response.txt";
  a.click();
};
