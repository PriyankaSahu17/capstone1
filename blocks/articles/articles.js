import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  try {
    const response = await fetch('/query-index.json');
    if (!response.ok) {
      console.warn('Unable to load article metadata.');
      return;
    }

    const { data = [] } = await response.json();
    const articles = data.filter(item => item.path?.startsWith('/magazine/'));

    if (!articles.length) {
      block.innerHTML = '<p>No magazine articles available.</p>';
      return;
    }

    const ul = document.createElement('ul');

    for (const article of articles) {
      const li = document.createElement('li');

      // Image container
      if (article.image) {
        const imageDiv = document.createElement('div');
        imageDiv.className = 'articles-card-image';

        const picture = createOptimizedPicture(article.image, article.title || '', false, [{ width: '750' }]);
        imageDiv.appendChild(picture);
        li.appendChild(imageDiv);
      }

      // Content container
      const contentDiv = document.createElement('div');
      contentDiv.className = 'articles-card-body';

      if (article.title) {
        const h3 = document.createElement('h3');
        h3.textContent = article.title;
        contentDiv.appendChild(h3);
      }

      if (article.description) {
        const p = document.createElement('p');
        p.textContent = article.description;
        contentDiv.appendChild(p);
      }

      li.appendChild(contentDiv);

      // Wrap in link if path exists
      if (article.path) {
        const link = document.createElement('a');
        link.href = article.path;
        while (li.firstChild) link.appendChild(li.firstChild);
        li.appendChild(link);
      }

      ul.appendChild(li);
    }

    block.textContent = '';
    block.appendChild(ul);

  } catch (error) {
    console.error('Error displaying magazine articles:', error);
  }
}
