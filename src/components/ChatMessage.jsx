import React from 'react';

const ChatMessage = ({ message, isBot }) => {
  // Function to safely render HTML content
  const createMarkup = (content) => {
    return { __html: content };
  };

  const renderBotMessage = (content) => {
    try {
      const jsonData = JSON.parse(content);

      // Format answer with proper paragraphs and styling
      const section = jsonData.section || jsonData; // Handle both new and old format

      let numberingCounter = 1;
      const paragraphs = (section.answer || '')
        .split(/\n{2,}/g)
        .map(p => {
          // First handle bold text (**text**)
          let formattedText = p.trim().replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          // Then handle single asterisk items and convert to numbers
          if (formattedText.startsWith('* ')) {
            formattedText = formattedText.replace(/^\* /, `${numberingCounter}. `);
            numberingCounter++;
          }
          return `<p>${formattedText}</p>`;
        })
        .join('');

      const questionHtml = section.question 
        ? `<div class="json-question">
            <div class="question-text">${section.question}</div>
           </div>` 
        : '';

      const summaryHtml = section.summary
        ? `<div class="json-summary">
            <div class="summary-header">Ringkasan</div>
            <div class="summary-text">${section.summary.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</div>
           </div>`
        : '';

      const resourcesHtml = section.resourcesSection?.links?.length
        ? `
          <div class="json-resources">
            <div class="resources-header">${section.resourcesSection.title || 'Referensi Pembelajaran'}</div>
            <div class="resources-list">
              ${section.resourcesSection.links.map(link => `
                <a class="resource-link" href="${link.url}" target="_blank" rel="noopener noreferrer">
                  <svg class="resource-icon" viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M11 17H7a5 5 0 0 1 0-10h4v2H7a3 3 0 0 0 0 6h4v2Zm2-10h4a5 5 0 0 1 0 10h-4v-2h4a3 3 0 0 0 0-6h-4V7Zm-3 5h6v2h-6v-2Z"/>
                  </svg>
                  <span class="resource-text">${link.label}</span>
                </a>
              `).join('')}
            </div>
          </div>
        `
        : '';

      return `
        <div class="json-section">
          ${questionHtml}
          <div class="json-answer">${paragraphs}</div>
          ${summaryHtml}
          ${resourcesHtml}
        </div>
      `;
    } catch (e) {
      // if parsing fails, show content as preformatted (preserve readable spacing)
      const safe = String(content).replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `<pre class="json-fallback">${safe}</pre>`;
    }
  };

  return (
    <div className={`message ${isBot ? 'bot' : 'user'}`}>
      <div 
        className="message-content"
        dangerouslySetInnerHTML={createMarkup(isBot ? renderBotMessage(message) : message)}
      />
    </div>
  );
};

export default ChatMessage;