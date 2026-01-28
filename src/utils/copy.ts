export const copyToWeChat = (element: HTMLElement) => {
  const clone = element.cloneNode(true) as HTMLElement;
  
  // Get all elements in the source
  const sourceElements = [element, ...Array.from(element.querySelectorAll('*'))] as HTMLElement[];
  // Get all elements in the clone
  const cloneElements = [clone, ...Array.from(clone.querySelectorAll('*'))] as HTMLElement[];
  
  // Iterate and apply styles
  sourceElements.forEach((sourceEl, index) => {
    const cloneEl = cloneElements[index];
    if (cloneEl) {
      copyStyles(sourceEl, cloneEl);
      handleListStyle(sourceEl, cloneEl);
    }
  });
  
  // Create a wrapper structure for better WeChat compatibility
  // Outer section: container
  const outerSection = document.createElement('section');
  outerSection.style.margin = '0';
  outerSection.style.padding = '0';
  outerSection.style.maxWidth = '100%';
  outerSection.style.boxSizing = 'border-box';
  outerSection.style.wordBreak = 'break-word';
  outerSection.setAttribute('data-tool', 'markdown-wechat-editor');

  // Inner section: styling (background, padding, etc.)
  const innerSection = document.createElement('section');
  const rootStyle = window.getComputedStyle(element);
  
  innerSection.style.backgroundColor = rootStyle.backgroundColor;
  innerSection.style.backgroundImage = rootStyle.backgroundImage;
  innerSection.style.padding = rootStyle.padding;
  // Ensure padding is not 0 if not set, to show background
  if (innerSection.style.padding === '' || innerSection.style.padding === '0px') {
      innerSection.style.padding = '20px';
  }
  
  // Add a transparent border to force WeChat to render the background
  innerSection.style.border = `1px solid ${rootStyle.backgroundColor}`;
  innerSection.style.borderRadius = rootStyle.borderRadius || '4px';
  
  innerSection.style.fontFamily = rootStyle.fontFamily;
  innerSection.style.fontSize = rootStyle.fontSize;
  innerSection.style.lineHeight = rootStyle.lineHeight;
  innerSection.style.color = rootStyle.color;
  innerSection.style.boxSizing = 'border-box';
  
  // Append inner to outer
  outerSection.appendChild(innerSection);
  
  // Move children from clone to innerSection
  while (clone.firstChild) {
    innerSection.appendChild(clone.firstChild);
  }
  
  // Create a hidden container for selection
  const hiddenContainer = document.createElement('div');
  hiddenContainer.appendChild(outerSection);
  
  // Hide it
  hiddenContainer.style.position = 'fixed';
  hiddenContainer.style.top = '-9999px';
  hiddenContainer.style.left = '-9999px';
  hiddenContainer.style.zIndex = '-1000';
  
  document.body.appendChild(hiddenContainer);
  
  const selection = window.getSelection();
  selection?.removeAllRanges();
  
  const range = document.createRange();
  range.selectNode(outerSection); // Select the outer section
  
  selection?.addRange(range);
  
  try {
    const successful = document.execCommand('copy');
    if (!successful) {
      throw new Error('Copy command failed');
    }
  } finally {
    document.body.removeChild(hiddenContainer);
    selection?.removeAllRanges();
  }
};

const copyStyles = (source: HTMLElement, target: HTMLElement) => {
  const computed = window.getComputedStyle(source);
  
  // Relevant properties to inline
  const properties = [
    'color', 'background-color', 
    'font-size', 'font-family', 'font-weight', 'font-style',
    'text-align', 'text-decoration', 'line-height', 'letter-spacing',
    'margin-top', 'margin-bottom', 'margin-left', 'margin-right',
    'padding-top', 'padding-bottom', 'padding-left', 'padding-right',
    'border-top-width', 'border-top-style', 'border-top-color',
    'border-bottom-width', 'border-bottom-style', 'border-bottom-color',
    'border-left-width', 'border-left-style', 'border-left-color',
    'border-right-width', 'border-right-style', 'border-right-color',
    'border-radius',
    'display', 'width', 'max-width', 'height',
    'list-style-type', 'list-style-position',
    'white-space', 'word-break', 'overflow-x',
    'box-shadow', 'text-shadow'
  ];
  
  let styleString = '';
  properties.forEach(prop => {
    const val = computed.getPropertyValue(prop);
    if (val && val !== 'initial' && val !== 'none' && val !== 'normal' && val !== 'auto') {
        // We filter out some defaults to keep HTML size reasonable, but 'none' for border is important?
        // Actually 'none' is default for border.
        // If background-color is rgba(0,0,0,0), it's transparent.
        if (prop === 'background-color' && (val === 'rgba(0, 0, 0, 0)' || val === 'transparent')) {
            return;
        }
        styleString += `${prop}:${val};`;
    } else if (prop.startsWith('border') && val !== '0px' && val !== 'none') {
         styleString += `${prop}:${val};`;
    }
  });
  
  // Apply all at once to avoid multiple reflows (though on a detached node it doesn't matter much)
  target.setAttribute('style', styleString + target.getAttribute('style'));
};

const handleListStyle = (source: HTMLElement, target: HTMLElement) => {
    if (source.tagName.toLowerCase() === 'li' && source.parentElement?.tagName.toLowerCase() === 'ul') {
        const beforeStyle = window.getComputedStyle(source, '::before');
        const content = beforeStyle.getPropertyValue('content');
        
        // content usually comes with quotes, e.g. "•"
        if (content && content !== 'none' && content !== 'normal' && content !== '""') {
             const span = document.createElement('span');
             span.textContent = content.replace(/^['"]|['"]$/g, '');
             
             span.style.color = beforeStyle.color;
             span.style.fontWeight = beforeStyle.fontWeight;
             span.style.fontSize = beforeStyle.fontSize;
             span.style.position = 'absolute';
             
             const left = beforeStyle.left;
             span.style.left = left !== 'auto' ? left : '-1em';
             
             // Ensure the LI is relative
             target.style.position = 'relative';
             target.style.listStyleType = 'none';
             
             target.prepend(span);
        }
    }
}
