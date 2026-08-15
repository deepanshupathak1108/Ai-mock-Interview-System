export const startOfDay = (value = new Date()) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

export const endOfDay = (value = new Date()) => {
  const date = new Date(value);
  date.setHours(23, 59, 59, 999);
  return date;
};

export const addDays = (value, days) => {
  const date = new Date(value);
  date.setDate(date.getDate() + Number(days));
  return date;
};

export const addMonths = (value, months) => {
  const date = new Date(value);
  const dayOfMonth = date.getDate();
  date.setMonth(date.getMonth() + Number(months));

  if (date.getDate() !== dayOfMonth) {
    date.setDate(0);
  }

  return date;
};

export const currentMonthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
};
