import { useMemo } from "react";

/**
 * Custom hook to format numbers as currency (LKR by default)
 */
const useFormatCurrency = ({
  locale = "en-LK",
  currency = "LKR",
  showCurrency = true,
  fallback = "0.00",
} = {}) => {
  const formatter = useMemo(() => {
    return new Intl.NumberFormat(locale, {
      style: showCurrency ? "currency" : "decimal",
      currency: showCurrency ? currency : undefined,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [locale, currency, showCurrency]);

  return (value) => {
    const num = parseFloat(String(value));
    if (isNaN(num)) return showCurrency ? `Rs. ${fallback}` : fallback;

    const formatted = formatter.format(num);

    if (!showCurrency && locale === "en-LK") {
      return formatted.replace(/^Rs\.?\s*/, "");
    }

    return formatted;
  };
};

export default useFormatCurrency;













