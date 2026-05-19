import os

original_css = '''
/* ═══════════════════════════════════════════════════════
   CLIENTS SECTION
   ═══════════════════════════════════════════════════════ */
.clients-section {
    padding: var(--sp-12) 0;
    background: var(--c-primary);
    position: relative;
    overflow: hidden;
}

.clients-section::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url('../images/pattern-dots.svg') repeat;
    opacity: 0.05;
}

.clients-header h2 {
    font-family: var(--ff-display);
    font-size: var(--fs-2xl);
    font-weight: 700;
    color: var(--c-white);
    margin-bottom: var(--sp-3);
    letter-spacing: -0.02em;
}

.clients-header p {
    color: rgba(255, 255, 255, 0.85);
    font-size: var(--fs-base);
    max-width: 600px;
    line-height: 1.6;
}

.clients-logo-grid {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    gap: var(--sp-8);
}

.clients-logo-grid .client-logo-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--sp-3);
    transition: transform var(--tr-base), opacity var(--tr-base);
    background: rgba(255, 255, 255, 1);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
}

.clients-logo-grid .client-logo-cell:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
}

.clients-logo-grid .client-logo-cell img {
    height: 60px;
    width: 140px;
    object-fit: contain;
    opacity: 1;
}

/* Responsive */
@media (max-width: 767.98px) {
    .clients-logo-grid {
        gap: var(--sp-4);
        justify-content: center;
    }

    .clients-logo-grid .client-logo-cell img {
        height: 48px;
        width: 110px;
    }

    .clients-section {
        padding: var(--sp-10) 0;
    }
}
'''

with open('css/style.css', 'r') as f:
    content = f.read()

# I added my CSS starting with '/* Clients Section CSS */'
idx = content.find('/* Clients Section CSS */')
if idx != -1:
    content = content[:idx] + original_css

    with open('css/style.css', 'w') as f:
        f.write(content)
    print("Reverted to original CSS.")
else:
    print("Could not find added CSS.")
