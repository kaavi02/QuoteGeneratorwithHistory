'use client';

import { useState, useEffect } from 'react';

export default function HomePage() {
  const [currentQuote, setCurrentQuote] = useState({
    id: 1,
    quote: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
    category: 'Inspiration'
  });
  const [favoritesList, setFavoritesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDailySelected, setIsDailySelected] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    setIsLoading(true);
    try {
      const [quoteRes, favRes] = await Promise.all([
        fetch('/api/quotes/random'),
        fetch('/api/favorites')
      ]);

      const quoteData = await quoteRes.json();
      if (quoteData.success && quoteData.quote) {
        setCurrentQuote(quoteData.quote);
      }

      const favData = await favRes.json();
      if (favData.success && Array.isArray(favData.favorites)) {
        setFavoritesList(favData.favorites);
      }
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGetRandomQuote() {
    setIsLoading(true);
    setIsDailySelected(false);
    try {
      const response = await fetch('/api/quotes/random');
      const data = await response.json();
      if (data.success && data.quote) {
        setCurrentQuote(data.quote);
      }
    } catch (err) {
      showToast('Could not fetch new quote');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGetDailyQuote() {
    setIsLoading(true);
    setIsDailySelected(true);
    try {
      const response = await fetch('/api/quotes/daily');
      const data = await response.json();
      if (data.success && data.quote) {
        setCurrentQuote(data.quote);
        showToast('Loaded Daily Quote of the Day');
      }
    } catch (err) {
      showToast('Could not fetch daily quote');
    } finally {
      setIsLoading(false);
    }
  }

  const isCurrentQuoteFavorited = favoritesList.some(
    item => item.quote.toLowerCase() === (currentQuote?.quote || '').toLowerCase()
  );

  async function handleToggleFavorite() {
    if (!currentQuote || !currentQuote.quote) return;

    if (isCurrentQuoteFavorited) {
      const targetItem = favoritesList.find(
        item => item.quote.toLowerCase() === currentQuote.quote.toLowerCase()
      );
      if (targetItem) {
        await handleDeleteFavorite(targetItem.id);
      }
      return;
    }

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quote: currentQuote.quote,
          author: currentQuote.author,
          category: currentQuote.category || 'Wisdom'
        })
      });

      const result = await response.json();
      if (result.success && result.favorites) {
        setFavoritesList(result.favorites);
        showToast('Added to Favorites History');
      }
    } catch (err) {
      showToast('Failed to save quote');
    }
  }

  async function handleDeleteFavorite(quoteId) {
    try {
      const response = await fetch(`/api/favorites?id=${quoteId}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if (result.success && result.favorites) {
        setFavoritesList(result.favorites);
        showToast('Removed from Favorites');
      }
    } catch (err) {
      showToast('Failed to remove quote');
    }
  }

  function handleCopyQuote(textToCopy, authorName) {
    const formatted = `"${textToCopy}" — ${authorName}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(formatted);
      showToast('Copied to clipboard!');
    } else {
      const tempTextArea = document.createElement('textarea');
      tempTextArea.value = formatted;
      document.body.appendChild(tempTextArea);
      tempTextArea.select();
      document.execCommand('copy');
      document.body.removeChild(tempTextArea);
      showToast('Copied to clipboard!');
    }
  }

  function showToast(message) {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 2800);
  }

  const filteredFavorites = favoritesList.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.quote.toLowerCase().includes(query) ||
      item.author.toLowerCase().includes(query)
    );
  });

  return (
    <main className="appWrapper">
      <header className="headerSection">
        <div className="badgeTop">
          <span className="badgeDot"></span>
          Live Public Quote API + Database
        </div>
        <h1 className="mainTitle">Quote Generator with History</h1>
        <p className="subTitle">
          Discover daily wisdom, save your favorite quotes into backend database, and copy with a single click.
        </p>
      </header>

      <div className="mainGrid">
        <section className="quoteCardContainer">
          <div className="quoteCard">
            <div className="cardHeader">
              <span className="categoryTag">
                {currentQuote.category || 'Wisdom'}
              </span>
              <button
                type="button"
                id="favoriteToggleBtn"
                onClick={handleToggleFavorite}
                className={`favoriteIconButton ${isCurrentQuoteFavorited ? 'isFavorited' : ''}`}
                title={isCurrentQuoteFavorited ? 'Remove from favorites' : 'Save to favorites'}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill={isCurrentQuoteFavorited ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>

            <div className="quoteMarks">“</div>

            <div className="quoteBody">
              <p className="quoteText">{currentQuote.quote}</p>
              <div className="authorContainer">
                <span className="authorLine"></span>
                <span className="authorText">{currentQuote.author}</span>
              </div>
            </div>

            <div className="actionRow">
              <button
                type="button"
                id="newQuoteBtn"
                onClick={handleGetRandomQuote}
                className="primaryButton"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loadingSpinner"></span>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                    </svg>
                    Next Quote
                  </>
                )}
              </button>

              <button
                type="button"
                id="copyQuoteBtn"
                onClick={() => handleCopyQuote(currentQuote.quote, currentQuote.author)}
                className="secondaryButton"
                title="Copy quote to clipboard"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy
              </button>

              <button
                type="button"
                id="dailyQuoteBtn"
                onClick={handleGetDailyQuote}
                className={`secondaryButton ${isDailySelected ? 'activeMode' : ''}`}
                title="View Quote of the Day"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
                Daily
              </button>
            </div>
          </div>
        </section>

        <section className="historyContainer">
          <div className="historyHeader">
            <h2 className="historyTitle">
              Favorites History
              <span className="countBadge">{favoritesList.length}</span>
            </h2>
          </div>

          <input
            type="text"
            id="searchInput"
            placeholder="Search saved quotes or authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="searchInput"
          />

          <div className="historyList">
            {filteredFavorites.length === 0 ? (
              <div className="emptyState">
                <div className="emptyIcon">⭐</div>
                <p className="emptyText">
                  {searchQuery ? 'No quotes match your search.' : 'No favorited quotes yet. Tap the heart icon to save quotes to database!'}
                </p>
              </div>
            ) : (
              filteredFavorites.map((item) => (
                <div key={item.id} className="historyCard">
                  <p className="historyQuoteText">"{item.quote}"</p>
                  <div className="historyFooter">
                    <span className="historyAuthor">— {item.author}</span>
                    <div className="historyActions">
                      <button
                        type="button"
                        onClick={() => handleCopyQuote(item.quote, item.author)}
                        className="miniIconButton"
                        title="Copy this quote"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteFavorite(item.id)}
                        className="miniIconButton deleteBtn"
                        title="Delete from favorites database"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {toastMessage && (
        <div className="toastContainer">
          <div className="toastNotification">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" color="#10b981">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </main>
  );
}
