import { useCallback } from "react";

const useNumberToWords = () => {
  const ones = [
    "Zero",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];
  const teens = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  const thousands = ["Thousand", "Million", "Billion"];

  const numberToWords = useCallback((num) => {
    if (num === 0) return "Zero";

    const convertLessThanThousand = (n) => {
      let result = "";
      if (n >= 100) {
        result += ones[Math.floor(n / 100)] + " Hundred";
        n %= 100;
        if (n > 0) result += " ";
      }
      if (n >= 20) {
        result += tens[Math.floor(n / 10)];
        n %= 10;
        if (n > 0) result += " " + ones[n];
      } else if (n >= 10) {
        result += teens[n - 10];
      } else if (n > 0) {
        result += ones[n];
      }
      return result;
    };

    const convertInteger = (n) => {
      if (n === 0) return "";
      let result = "";
      let thousandIndex = 0;
      while (n > 0) {
        if (n % 1000 !== 0) {
          let part = convertLessThanThousand(n % 1000);
          if (thousandIndex > 0) {
            part += " " + thousands[thousandIndex - 1];
          }
          result = part + (result ? " " + result : "");
        }
        n = Math.floor(n / 1000);
        thousandIndex++;
      }
      return result;
    };

    const convertDecimal = (n) => {
      let result = "";
      const digits = n.toString().split("");
      for (let digit of digits) {
        result += ones[parseInt(digit)] + " ";
      }
      return result.trim();
    };

    const [integerPart, decimalPart] = num.toString().split(".");
    let result = convertInteger(parseInt(integerPart));

    if (decimalPart && parseInt(decimalPart) > 0) {
      result += " point " + convertDecimal(decimalPart);
    }

    return result;
  }, []);

  return numberToWords;
};

export default useNumberToWords;
