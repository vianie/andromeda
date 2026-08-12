window.WebFontConfig = {
    custom: {
        families: ['KaTeX_AMS', 'KaTeX_Caligraphic:n4,n7', 'KaTeX_Fraktur:n4,n7',
            'KaTeX_Main:n4,n7,i4,i7', 'KaTeX_Math:i4,i7', 'KaTeX_Script',
            'KaTeX_SansSerif:n4,n7,i4', 'KaTeX_Size1', 'KaTeX_Size2', 'KaTeX_Size3',
            'KaTeX_Size4', 'KaTeX_Typewriter'],
    },
};

// Matches single-dollar delimited LaTeX, e.g. $x^2 + y^2$
// Non-greedy, does not span newlines, requires non-empty content.
var MATH_REGEX = /\$([^$\n]+?)\$/g;

function renderMathInTextNode(textNode) {
    var text = textNode.nodeValue;
    MATH_REGEX.lastIndex = 0;
    if (!MATH_REGEX.test(text)) return;
    MATH_REGEX.lastIndex = 0;

    var frag = document.createDocumentFragment();
    var lastIndex = 0;
    var match;

    while ((match = MATH_REGEX.exec(text)) !== null) {
        // preserve any plain text before this match, untouched
        if (match.index > lastIndex) {
            frag.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
        }

        var span = document.createElement('span');
        span.className = 'andromeda-katex';
        try {
            span.innerHTML = katex.renderToString(match[1], { throwOnError: false });
        } catch (e) {
            // fall back to the original raw text if rendering fails
            span.textContent = match[0];
        }
        frag.appendChild(span);

        lastIndex = MATH_REGEX.lastIndex;
    }

    // preserve any trailing plain text after the last match, untouched
    if (lastIndex < text.length) {
        frag.appendChild(document.createTextNode(text.slice(lastIndex)));
    }

    textNode.parentNode.replaceChild(frag, textNode);
}

function walk(node) {
    if (node.nodeType === Node.TEXT_NODE) {
        renderMathInTextNode(node);
        return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;

    // don't re-walk into already-rendered KaTeX output
    if (node.classList && node.classList.contains('andromeda-katex')) return;
    if (node.classList && node.classList.contains('katex')) return;

    // snapshot childNodes first since replaceChild mutates the live list mid-iteration
    Array.from(node.childNodes).forEach(walk);
}

var SELECTORS = 'p, h1, h2, h3, h4, h5, h6, li, blockquote, figcaption';

document.querySelectorAll(SELECTORS).forEach(function (el) {
    walk(el);
});