import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'banner-wrapper-inner';

  const row = block.firstElementChild;
  if (!row) return;

  const imageDiv = row.children[0];
  const textDiv = row.children[1];

  // Image wrapper
  if (imageDiv) {
    const img = imageDiv.querySelector('picture > img');
    if (img) {
      const optimizedPicture = createOptimizedPicture(
        img.src,
        img.alt || '',
        false,
        [
          { width: '750' },
          { width: '2000' }
        ]
      );
      const imageContainer = document.createElement('div');
      imageContainer.className = 'banner-image';
      imageContainer.append(optimizedPicture);
      wrapper.append(imageContainer);
    }
  }

  // Text wrapper
  if (textDiv) {
    const textContainer = document.createElement('div');
    textContainer.className = 'banner-text';
    // Move all text nodes into the text container
    while (textDiv.firstChild) {
      textContainer.append(textDiv.firstChild);
    }
    wrapper.append(textContainer);
  }

  // Clear block and append the new structure
  block.textContent = '';
  block.append(wrapper);
}
