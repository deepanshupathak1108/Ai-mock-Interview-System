export const formatDate = (value) => {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

export const toInputDate = (value = new Date()) => {
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 10);
};

export const addMonths = (value, months) => {
  const date = new Date(value);
  const originalDay = date.getDate();
  date.setMonth(date.getMonth() + Number(months));

  if (date.getDate() !== originalDay) {
    date.setDate(0);
  }

  return date;
};

export const getDueState = (member) => {
  if (!member || member.status === "Pending") {
    return { label: "Pending", tone: "slate", isExpired: false, isSoon: false, days: null };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const billDate = new Date(member.nextBillDate);
  billDate.setHours(0, 0, 0, 0);
  const days = Math.ceil((billDate - today) / 86400000);

  if (days < 0) {
    return { label: "Expired", tone: "rose", isExpired: true, isSoon: false, days };
  }

  if (days <= 7) {
    return { label: "Expiring", tone: "amber", isExpired: false, isSoon: true, days };
  }

  return { label: "Active", tone: "teal", isExpired: false, isSoon: false, days };
};
