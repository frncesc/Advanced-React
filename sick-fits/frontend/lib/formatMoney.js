export default function formatMoney(amount) {
  const options = {
    style: 'currency',
    currency: 'EUR',
    // Check clean amounts
    minimumFractionDigits: amount % 100 === 0 ? 0 : 2,
  };

  const formatter = Intl.NumberFormat('ca-ES', options);

  return formatter.format(amount / 100);
}
