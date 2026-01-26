
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
      const content = this.parseHTML(html);
      
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


  //const parseHTML = (html: string): JFTContent | null => {
  parseHTML(html: string,): JFTContent | null {
      try {
      // Extract date
      const dateMatch = html.match(/<h2>(.*?)<\/h2>/);
      const date = dateMatch ? dateMatch[1] : '';

      // Extract title
      const titleMatch = html.match(/<h1>(.*?)<\/h1>/);
      const title = titleMatch ? titleMatch[1] : '';

      // Extract page
      const pageMatch = html.match(/Page (\d+)/);
      const page = pageMatch ? pageMatch[1] : '';

      // Extract quote
      const quoteMatch = html.match(/"<i>(.*?)<\/i>"/s);
      const quote = quoteMatch ? quoteMatch[1] : '';

      // Extract reference
      //const referenceMatch = html.match(/Basic Text p\. \d+/);
      const referenceMatch = html.match(/>\s*([^<]*?p\. *\d+)/i);
      const reference = referenceMatch ? referenceMatch[1] : '';


        

// Extract body: everything after reference and before "Just for Today"
const bodyMatch = html.match(new RegExp(reference + '([\\s\\S]*?)(?=<b>Just for Today:)', 'i'));

const body = bodyMatch
  ? bodyMatch[1]
      .replace(/<br\s*\/?>/gi, '\n')   // convert <br> to newline
      .replace(/<[^>]+>/g, '')         // remove all other HTML tags
      .trim()                          // trim leading/trailing whitespace
  : '';

console.log('reference', reference);
console.log('body', body);


/*/

      // Extract body paragraphs
      const bodyRegex = /<td align="left">((?:(?!<td|<tr|Just for Today).)*?)<br><br><\/td>/gs;
      const bodyMatches = html.match(bodyRegex);
      const body: string[] = [];
      
      if (bodyMatches) {
        bodyMatches.forEach(match => {
          const text = match
            .replace(/<td align="left">/g, '')
            .replace(/<br><br><\/td>/g, '')
            .replace(/<br><br>/g, '')
            .trim();
          

            //. TODO: chack this ------------
          if (text && !text.includes('"<i>') && !text.includes('Basic Text')) {
            body.push(text);
          }
        });
      }

/*/


      const fullContent = body;
      const preview = fullContent.length > 150
        ? fullContent.substring(0, 150) + '...'
        : fullContent;
           //. TODO: chack this ------------

      // Extract Just for Today
      const jftMatch = html.match(/<b>Just for Today: <\/b>(.*?)<br>/);
      const justForToday = jftMatch ? jftMatch[1] : '';
/*/
      // Create a preview (first 150 characters)
      const fullContent = body.join(' ');
      const preview = fullContent.length > 150
        ? fullContent.substring(0, 150) + '...'
        : fullContent;
/*/



      
        console.log('title', title);
        console.log('date', date);
        console.log('quote', quote);



        console.log('reference', reference);
        console.log('body', body);
        // console.log('fullContent', fullContent);

        console.log('justForToday', justForToday);
        console.log('preview', justForToday);


      return { date, title, quote, reference, fullContent, justForToday, preview };


    

           //. TODO: chack this ------------

        // if (!text) {
    
        //   console.warn('Could not extract content from JFT HTML');
        //   return null;
        // }
        //   console.log('fullContent', text);



        // Create a preview (first 150 characters)
        /*/
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
        /*/
      } catch (error) {
        console.error('Error parsing JFT content:', error);
        return null;
      }
    }

};