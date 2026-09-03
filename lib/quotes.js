const curatedQuotes = [
  {
    id: 101,
    quote: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    category: "Inspiration"
  },
  {
    id: 102,
    quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "Perseverance"
  },
  {
    id: 103,
    quote: "Believe you can and you are halfway there.",
    author: "Theodore Roosevelt",
    category: "Confidence"
  },
  {
    id: 104,
    quote: "The only limit to our realization of tomorrow will be our doubts of today.",
    author: "Franklin D. Roosevelt",
    category: "Hope"
  },
  {
    id: 105,
    quote: "It always seems impossible until it is done.",
    author: "Nelson Mandela",
    category: "Motivation"
  },
  {
    id: 106,
    quote: "Happiness is not something ready made. It comes from your own actions.",
    author: "Dalai Lama",
    category: "Wisdom"
  },
  {
    id: 107,
    quote: "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
    author: "Ralph Waldo Emerson",
    category: "Strength"
  },
  {
    id: 108,
    quote: "Do what you can, with what you have, where you are.",
    author: "Theodore Roosevelt",
    category: "Action"
  }
];

export async function fetchExternalQuote() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch('https://dummyjson.com/quotes/random', {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.quote && data.author) {
        return {
          id: data.id,
          quote: data.quote,
          author: data.author,
          category: 'Wisdom',
          source: 'External API'
        };
      }
    }
  } catch (error) {}

  const randomIndex = Math.floor(Math.random() * curatedQuotes.length);
  return {
    ...curatedQuotes[randomIndex],
    source: 'Curated'
  };
}

export async function fetchDailyQuote() {
  try {
    const now = new Date();
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const quoteId = (dayOfYear % 100) + 1;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(`https://dummyjson.com/quotes/${quoteId}`, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.quote && data.author) {
        return {
          id: data.id,
          quote: data.quote,
          author: data.author,
          category: 'Quote of the Day',
          source: 'External Daily API'
        };
      }
    }
  } catch (error) {}

  const now = new Date();
  const dayIndex = (now.getDate() + now.getMonth()) % curatedQuotes.length;
  return {
    ...curatedQuotes[dayIndex],
    category: 'Quote of the Day',
    source: 'Curated Daily'
  };
}
