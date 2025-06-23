// Teste de timezone para verificar se a correção está funcionando
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

const TZ = "America/Sao_Paulo";

const toISOWithTimezone = (dateStr, hourStr) => {
  return dayjs
    .tz(`${dateStr} ${hourStr}`, "YYYY-MM-DD HH:mm", TZ)
    .toISOString();
};

const parseDateTimeWithTimezone = (dateStr, hourStr) => {
  return dayjs.tz(`${dateStr} ${hourStr}`, "YYYY-MM-DD HH:mm", TZ).toDate();
};

// Teste: 10:00 em 2025-06-30
console.log("=== TESTE DE TIMEZONE ===");
console.log("Input: 2025-06-30 10:00");

const testDate = parseDateTimeWithTimezone("2025-06-30", "10:00");
console.log("Parsed Date:", testDate);
console.log("ISO String:", testDate.toISOString());
console.log("Local String (BR):", testDate.toLocaleString('pt-BR', { timeZone: TZ }));
console.log("UTC String:", testDate.toUTCString());

const testISO = toISOWithTimezone("2025-06-30", "10:00");
console.log("Direct ISO:", testISO);

console.log("=== FIM DO TESTE ==="); 