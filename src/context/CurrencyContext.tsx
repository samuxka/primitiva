import React, { createContext, useContext, useEffect, useState } from 'react';

interface CurrencyContextType {
  currencyCode: string;
  rateToLocal: number;
  formatCurrency: (brlValue: number) => string;
  convertToBRL: (localValue: number) => number;
  loading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currencyCode, setCurrencyCode] = useState<string>('BRL');
  const [rateToLocal, setRateToLocal] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initCurrency = async () => {
      try {
        // 1. Discover local country via IP
        const ipRes = await fetch('https://ipinfo.io/json');
        const ipData = await ipRes.json();
        const country = ipData.country || 'BR';
        
        let code = 'BRL';
        if (country !== 'BR') {
           const commonCurrencies: Record<string, string> = {
             PT: 'EUR', US: 'USD', GB: 'GBP', EU: 'EUR', AR: 'ARS',
             UY: 'UYU', CL: 'CLP', PY: 'PYG', BO: 'BOB', PE: 'PEN',
             CO: 'COP', VE: 'VES', MX: 'MXN', CA: 'CAD', AU: 'AUD',
             NZ: 'NZD', JP: 'JPY', CN: 'CNY', IN: 'INR', ZA: 'ZAR',
             FR: 'EUR', DE: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR',
             BE: 'EUR', AT: 'EUR', IE: 'EUR', FI: 'EUR', GR: 'EUR',
             CH: 'CHF', SE: 'SEK', NO: 'NOK', DK: 'DKK', RU: 'RUB',
             KR: 'KRW'
           };
           
           if (commonCurrencies[country]) {
             code = commonCurrencies[country];
           }
        }
        
        if (code === 'BRL') {
          setCurrencyCode('BRL');
          setRateToLocal(1);
          setLoading(false);
          return;
        }

        // 2. Fetch exchange rate relative to BRL
        const rateRes = await fetch('https://open.er-api.com/v6/latest/BRL');
        const rateData = await rateRes.json();
        
        if (rateData && rateData.rates && rateData.rates[code]) {
          setCurrencyCode(code);
          setRateToLocal(rateData.rates[code]);
        }
      } catch (err) {
        console.error("GeoCurrency Sync Failed. Defaulting to BRL.", err);
      } finally {
        setLoading(false);
      }
    };

    initCurrency();
  }, []);

  const formatCurrency = (brlValue: number) => {
    const converted = brlValue * rateToLocal;
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 0
    }).format(converted);
  };

  const convertToBRL = (localValue: number) => {
    if (rateToLocal <= 0) return localValue;
    return localValue / rateToLocal;
  };

  return (
    <CurrencyContext.Provider value={{ currencyCode, rateToLocal, formatCurrency, convertToBRL, loading }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within CurrencyProvider");
  return context;
};
