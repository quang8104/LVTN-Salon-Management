export const formatCurrency = (value) => {
  if (value === null || value === undefined || value === "") {
    return "0 ₫";
  }

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(value));
};

export const formatDateTime = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("vi-VN");
};

export const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("vi-VN");
};

export const formatTime = (value) => {
  if (!value) return "-";
  return String(value).slice(0, 5);
};

export const getTrangThaiText = (value, mapping) => mapping[value] || "Không rõ";