const axios = require("axios");

const getExchangeRate = async (fromCurrency, toCurrency) => {
  const response = await axios.get("https://open.er-api.com/v6/latest/USD");
  const rate = response.data.rates;
  const usd = 1 / rate[fromCurrency];
  const exchangeRate = usd * rate[toCurrency];

  if (isNaN(exchangeRate)) {
    throw new Error(`Unable to get currency ${fromCurrency} and ${toCurrency}`);
  }
  return exchangeRate;
};

const getCountries = async (toCurrency) => {
  try {
    const response = await axios.get("https://restcountries.com/v3.1/all");
    return response.data.map((country) => country.name.common);
  } catch (error) {
    throw new Error(`Unable to get countries that use ${toCurrency}`);
  }
};

const convertCurrency = async (fromCurrency, toCurrency, amount) => {
  const countries = await getCountries(toCurrency);
  const exchangeRate = await getExchangeRate(fromCurrency, toCurrency);

  const convertedAmount = (amount * exchangeRate).toFixed(2);
  return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}. You can spend these in the following countries: ${countries}`;
};

convertCurrency("CAD", "EUR", 500)
  .then((message) => {
    console.log(message);
  })
  .catch((error) => {
    console.log(error.message);
  });
