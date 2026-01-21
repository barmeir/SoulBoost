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
      // The JFT website uses a simple table structure
      
      // Find the title (h1 tag contains the meditation title)
      
      const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
      const title = titleMatch ? this.stripHtml(titleMatch[1]) : 'Just for Today';
        console.log('title', title);

      // Extract content from the table
      // The content is in <td> tags within the table
      const tableMatch = html.match(/<table[^>]*>(.*?)<\/table>/is);
      
      if (!tableMatch) {
        console.warn('Could not find table in JFT HTML');
        return null;
      }

      // Get all table cell content
      const tdMatches = tableMatch[1].match(/<td[^>]*>(.*?)<\/td>/gis);
      
      if (!tdMatches || tdMatches.length === 0) {
        console.warn('Could not find table cells in JFT HTML');
        return null;
      }

      // Combine all td content, excluding the copyright
      let fullContent = '';
      for (const td of tdMatches) {
        const stripped = this.stripHtml(td).trim();
        // Skip the copyright line, page number, and date
        if (!stripped.includes('Copyright') 
          && !stripped.includes('NA World Services') 
                  && !stripped.match(title)
          && !stripped.match(/^Page \d+$/)
          && !stripped.match(/^\w+ \d{1,2}, \d{4}$/)) {  // Skip date in format like "January 18, 2026"
            //This regex /^\w+ \d{1,2}, \d{4}$/ matches strings that start with a word (month), followed by a space, 1-2 digits (day), a comma, space, and 4 digits (year). It should effectively remove date lines from the content. If the date format varies (e.g., no comma or different order), let me know for adjustments! Test it with the actual HTML to confirm.
          fullContent += stripped + '\n\n';
        }
      }

      fullContent = fullContent.trim();
      
      if (!fullContent) {
        console.warn('Could not extract content from JFT HTML');
        return null;
      }
        console.log('fullContent', fullContent);

      // Create a preview (first 200 characters)
      const preview = fullContent.length > 150
        ? fullContent.substring(0, 150) + '...'
        : fullContent;
        console.log('title', title);
        console.log('date', date);

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
