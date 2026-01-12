export const dateUtils = {
  getTodayString(): string {
    const date = new Date();
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
