import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  // Check if the path starts with 'magazine/' and is not exactly 'magazine'
  const path = window.location.pathname.replace(/^\/|\/$/g, ''); // Remove leading/trailing slashes
  if (!path.startsWith('magazine/') || path === 'magazine') return;

  // Fetch metadata
  let indexData = [];
  try {
    const res = await fetch('/query-index.json');
    if (res.ok) {
      const json = await res.json();
      indexData = json.data || [];
    } else {
      console.warn('Failed to fetch query-index.json');
    }
  } catch (e) {
    console.warn('Error fetching metadata:', e);
  }

  // Filter relevant entries based on path
  const filteredData = indexData.filter((entry) =>
    entry.path && entry.path.startsWith(`/${path}`)
  );

  // Generate UI
  const ul = document.createElement('ul');
  filteredData.forEach((item) => {
    const li = document.createElement('li');

    // Create image block
    const imgBlock = document.createElement('div');
    imgBlock.className = 'articles-card-image';
    const pic = createOptimizedPicture(item.image, item.title, false, [{ width: '750' }]);
    imgBlock.append(pic);

    // Create content block
    const contentBlock = document.createElement('div');
    contentBlock.className = 'articles-card-body';
    const title = document.createElement('h3');
    title.textContent = item.title;
    const desc = document.createElement('p');
    desc.textContent = item.description || '';
    contentBlock.append(title, desc);

    li.append(imgBlock, contentBlock);
    ul.append(li);
  });

  // Replace the block's content
  block.textContent = '';
  block.append(ul);
}
