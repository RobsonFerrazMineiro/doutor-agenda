export const formatCurrencyInCents = (amout: number) => {
  return new Intl.NumberFormat("pt-br", {
    style: "currency",
    currency: "BRL",
  }).format(amout / 100);
};
