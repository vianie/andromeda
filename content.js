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

var SELECTORS = 'p, h1, h2, h3, h4, h5, h6, li, blockquote, figcaption';

// Finds which text node + offset a given "flattened" character offset falls in.
function locate(nodeInfos, globalOffset) {
    for (var i = 0; i < nodeInfos.length; i++) {
        var info = nodeInfos[i];
        var len = info.node.nodeValue.length;
        if (globalOffset <= info.start + len) {
            return { node: info.node, offset: globalOffset - info.start };
        }
    }
    var last = nodeInfos[nodeInfos.length - 1];
    return { node: last.node, offset: last.node.nodeValue.length };
}

function processElement(el) {
    if (el.classList && (el.classList.contains('andromeda-katex') || el.classList.contains('katex'))) {
        return;
    }

    // Collect every text node inside this element, in document order, skipping
    // anything already inside a rendered KaTeX span (so we never re-process output).
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
        acceptNode: function (node) {
            var parent = node.parentElement;
            if (parent && parent.closest('.andromeda-katex, .katex')) {
                return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
        }
    });

    var nodeInfos = [];
    var combined = '';
    var node;
    while ((node = walker.nextNode())) {
        nodeInfos.push({ node: node, start: combined.length });
        combined += node.nodeValue;
    }
    if (nodeInfos.length === 0 || combined.indexOf('$') === -1) return;

    MATH_REGEX.lastIndex = 0;
    var matches = [];
    var m;
    while ((m = MATH_REGEX.exec(combined)) !== null) {
        matches.push({ start: m.index, end: MATH_REGEX.lastIndex, expr: m[1] });
    }
    if (matches.length === 0) return;

    // Replace matches back-to-front so earlier offsets stay valid as we edit the DOM.
    for (var i = matches.length - 1; i >= 0; i--) {
        var match = matches[i];
        var startInfo = locate(nodeInfos, match.start);
        var endInfo = locate(nodeInfos, match.end);

        var range = document.createRange();
        range.setStart(startInfo.node, startInfo.offset);
        range.setEnd(endInfo.node, endInfo.offset);
        range.deleteContents();

        var span = document.createElement('span');
        span.className = 'andromeda-katex';
        try {
            span.innerHTML = katex.renderToString(match.expr, { throwOnError: false });
        } catch (e) {
            span.textContent = '$' + match.expr + '$';
        }
        range.insertNode(span);
    }
}

document.querySelectorAll(SELECTORS).forEach(processElement);