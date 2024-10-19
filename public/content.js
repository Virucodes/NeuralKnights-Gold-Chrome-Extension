// Function to add Analyze buttons to news articles
const addAnalyzeButtons = () => {
  const articles = document.querySelectorAll('article');  // Assuming articles are in <article> tags

  articles.forEach(article => {
    const linkElement = article.querySelector('a');

    if (!linkElement) {
      console.warn('No <a> tag found in this article');
      return; // Skip articles with no links
    }

    const articleUrl = linkElement.href;

    if (!article.querySelector('.analyze-button')) {
      const button = document.createElement('button');
      button.innerText = 'Analyze Article';
      button.className = 'analyze-button';
      button.style.marginLeft = '10px';

      // Add event listener for button
      button.addEventListener('click', () => {
        if (articleUrl) {
          chrome.runtime.sendMessage({ type: 'ANALYZE_ARTICLE', url: articleUrl });
        } else {
          console.warn('Article URL not found for analysis.');
        }
      });

      article.appendChild(button);
    }
  });
};

// Run the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', addAnalyzeButtons);

// Listen for the analysis result from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
if (message.type === 'ANALYSIS_RESULT') {
  const articleUrl = message.data.url;
  const articleElement = document.querySelector(`a[href="${articleUrl}"]`);

  if (!articleElement) {
    console.error(`No article found for URL: ${articleUrl}`);
    return;
  }

  const article = articleElement.closest('article');

  if (!article) {
    console.error('No parent <article> found for the link.');
    return;
  }

  // Create a container for analysis results
  const analysisContainer = document.createElement('div');
  analysisContainer.className = 'analysis-result';

  // Populate the container with sentiment analysis and summary
  analysisContainer.innerHTML = `
    <h3>Sentiment Analysis</h3>
    <p>Positive: ${message.data.sentiment.positive}%</p>
    <p>Negative: ${message.data.sentiment.negative}%</p>
    <h3>Summary</h3>
    <p>${message.data.summary}</p>
  `;

  // Append the analysis result to the article
  article.appendChild(analysisContainer);

} else if (message.type === 'ANALYSIS_ERROR') {
  alert('Error fetching analysis: ' + message.error);
}
});
