function wrapOrInsert(open, close = '', opts = { placeCaret: 'middle' }, textarea) {
    if (!textarea) return;
    textarea.focus();

    const { selectionStart: s, selectionEnd: e, value } = textarea;
    const y = textarea.scrollTop;

    if (s === e) {
        textarea.setRangeText(open + close, s, e, 'end');

        let caret = s + open.length;
        if (opts.placeCaret === 'end') caret = s + open.length + close.length;
        if (opts.placeCaret === 'start') caret = s;

        textarea.setSelectionRange(caret, caret);
    } else {
        const selected = value.slice(s, e);
        textarea.setRangeText(open + selected + close, s, e, 'end');

        const start = s + open.length;
        const end = start + selected.length;
        if (opts.reselectInner) {
        textarea.setSelectionRange(start, end);
        } else {
        textarea.setSelectionRange(e + open.length + close.length, e + open.length + close.length);
        }
    }

    textarea.scrollTop = y;
};

function insertBlock(snippet, mode = 'line', textarea) {
    if (!textarea) return;
    textarea.focus();

    const { selectionStart: s, selectionEnd: e, value } = textarea;
    const y = textarea.scrollTop;

    const lineStart = value.lastIndexOf('\n', s - 1) + 1;
    const before = value.slice(0, lineStart);
    const current = value.slice(lineStart, e);
    const after = value.slice(e);

    const insertion = mode === 'line'
        ? snippet + (current ? current : '')
        : snippet;

    textarea.value = before + insertion + after;

    const caret = before.length + insertion.length;
    textarea.setSelectionRange(caret, caret);
    textarea.scrollTop = y;
};

function setupStickyMarkdownMenu(textarea) {
    const container = textarea?.closest('.description-input')?.querySelector('.markdownContainer');
    if (!container || container.dataset.stickyInit) return;
    container.dataset.stickyInit = 'true';

    const placeholder = document.createElement('div');
    placeholder.style.display = 'none';
    container.parentNode.insertBefore(placeholder, container.nextSibling);

    let isFixed = false;
    let originY = 0;

    function recalcOrigin() {
        if (isFixed) {
            originY = window.scrollY + placeholder.getBoundingClientRect().top;
        } else {
            originY = window.scrollY + container.getBoundingClientRect().top;
        }
    }

    function attach() {
        if (isFixed) return;
        placeholder.style.display = 'block';
        placeholder.style.height = container.offsetHeight + 'px';
        container.style.width = container.offsetWidth + 'px';
        container.classList.add('is-fixed');
        isFixed = true;
    }

    function detach() {
        if (!isFixed) return;
        container.classList.remove('is-fixed');
        container.style.width = '';
        placeholder.style.display = 'none';
        isFixed = false;
    }

    function isFormVisible() {
        const form = container.closest('.contentForm');
        return form && form.style.display !== 'none' && form.offsetParent !== null;
    }

    function onScroll() {
        if (!isFormVisible()) {
            detach();
            return;
        }

        if (window.scrollY >= originY) {
            attach();
        } else {
            detach();
        }
    }

    // Observe form visibility to recalculate origin when form is shown
    const observer = new MutationObserver(() => {
        if (isFormVisible()) {
            requestAnimationFrame(() => recalcOrigin());
        }
    });
    const formContainer = container.closest('.contentForm');
    if (formContainer) {
        observer.observe(formContainer, { attributes: true, attributeFilter: ['style'] });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => { recalcOrigin(); if (isFixed) container.style.width = placeholder.offsetWidth + 'px'; }, { passive: true });

    // Initial calc
    requestAnimationFrame(() => recalcOrigin());
}

export function registerMarkdownEvents(textarea) {
    setupStickyMarkdownMenu(textarea);
    document.querySelectorAll(".markdownBtn").forEach(btn => {
        btn.addEventListener("click", e => {
            e.preventDefault();
            e.stopPropagation();
            
            switch (btn.id) {
            case 'bold':
                // **texto**
                wrapOrInsert('**', '**', { reselectInner: true }, textarea);
                break;

            case 'italic':
                // *texto*
                wrapOrInsert('*', '*', { reselectInner: true }, textarea);
                break;

            case 'strike':
                // ~~texto~~
                wrapOrInsert('~~', '~~', { reselectInner: true }, textarea);
                break;

            case 'separator':
                // ---
                insertBlock('\n---\n', 'block', textarea);
                break;

            case 'h1':
                // # Título
                insertBlock('# ', "block", textarea);
                break;

            case 'h2':
                // ## Título
                insertBlock('## ', "block", textarea);
                break;

            case 'ul':
                // Lista não ordenada: prefixa "- "
                insertBlock( '- Item 1\n- Item 2\n- Item 3\n', 'block', textarea);
                break;

            case 'table':
                // Tabela
                const tableTpl =
                '| Coluna A | Coluna B |\n' +
                '|----------|----------|\n' +
                '| valor A  | valor B  |\n';

                insertBlock(tableTpl, 'block', textarea);
                break;

            case 'link':
                // [texto](url)
                wrapOrInsert('[', '](https://example.com)', { placeCaret: 'middle' }, textarea);
                break;

            default:
                break;
            }
        }) 
    })
}