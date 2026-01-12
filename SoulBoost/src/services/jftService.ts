import { JFTContent } from '../types';
import { storage } from '../utils/storage';
import { dateUtils } from '../utils/dateUtils';

export const jftService = {
  async fetchJFTContent(date?: string): Promise<JFTContent | null> {
    const targetDate = date || dateUtils.getTodayString();
    
    try {
      // Check cache first
      const cached = await storage.getCachedJFT(targetDate);
      if (cached) {
        console.log('Using cached JFT content for', targetDate);
        return cached;
      }

      // Fetch from server
      console.log('Fetching JFT content from server for', targetDate);
      const response = await fetch('https://www.jftna.org/jft/', {
        method: 'GET',
        headers: {
          'User-Agent': 'SoulBoost/1.0',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();
      const content = this.parseJFTContent(html, targetDate);
      
      if (content) {
        // Cache the content
        await storage.cacheJFT(targetDate, content);
      }

      return content;
    } catch (error) {
      console.error('Error fetching JFT content:', error);
      return null;
    }
  },

  parseJFTContent(html: string, date: string): JFTContent | null {
    try {
      // Extract the main content from the HTML
      // The JFT website structure: looking for the daily reading text
      
      // Find the title (date)
      const titleMatch = html.match(/<h2[^>]*>(.*?)<\/h2>/i);
      const title = titleMatch ? this.stripHtml(titleMatch[1]) : 'Just for Today';

      // Find the main content between common markers
      let contentMatch = html.match(/<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>(.*?)<\/div>/is);
      if (!contentMatch) {
        // Try alternative pattern
        contentMatch = html.match(/<article[^>]*>(.*?)<\/article>/is);
      }

      if (!contentMatch) {
        console.warn('Could not parse JFT content from HTML');
        return null;
      }

      const fullContent = this.stripHtml(contentMatch[1]).trim();
      
      // Create a preview (first 200 characters)
      const preview = fullContent.length > 200 
        ? fullContent.substring(0, 200) + '...'
        : fullContent;

      return {
        date,
        title,
        content: fullContent,
        preview,
      };
    } catch (error) {
      console.error('Error parsing JFT content:', error);
      return null;
    }
  },

  stripHtml(html: string): string {
    return html
      .replace(/<script[^>]*>.*?<\/script>/gis, '')
      .replace(/<style[^>]*>.*?<\/style>/gis, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  },
};
