export const dateUtils = {
  /**
   * Returns today's date as an ISO string (YYYY-MM-DD)
   */
  getTodayString(): string {
    const date = new Date();
    return date.toISOString().split('T')[0];
  },

  /**
   * Returns yesterday's date as an ISO string (YYYY-MM-DD)
   */
  getYesterdayString(): string {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
  },

  /**
   * Returns the previous day's date from a given date string
   * @param dateString - Date in YYYY-MM-DD format
   * @returns Previous day's date in YYYY-MM-DD format
   */
  getPreviousDateString(dateString: string): string {
    const date = new Date(dateString);
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
  },

  formatDisplayDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  },

  getMotivationalMessage(): string {
    const messages = [
      "Today is a gift, embrace it with gratitude.",
      "You have the power to make today extraordinary.",
      "Start your day with intention and watch magic unfold.",
      "Every sunrise is a new opportunity for growth.",
      "You are exactly where you need to be right now.",
      "Today, choose joy and spread kindness.",
      "Believe in yourself—you are capable of amazing things.",
      "This moment is the beginning of something beautiful.",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  },
};
