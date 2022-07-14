import sanitizeHtml from 'sanitize-html';

export const sanitizeText = (text: string) => sanitizeHtml(text);
