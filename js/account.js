/* ==========================================================
   account.js — Account Page Logic
   Smart Spend | Used on: account.html
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ── DOM References ── */
    const budgetInput      = document.getElementById('budgetInput');
    const spendingAmountEl = document.getElementById('spendingAmount');
    const progressFill     = document.getElementById('progressFill');
    const progressText     = document.getElementById('progressText');
    const alertMsg         = document.getElementById('budget-alert-msg');
    const saveBudgetBtn    = document.getElementById('saveBudgetBtn');

    /* ── Helper ── */
    const parseAmount = (str) => parseFloat(String(str).replace(/[^0-9.-]+/g, ''));

    /* ── State ── */
    let currentSpending = parseAmount(spendingAmountEl.innerText);

    /* ── Budget UI Updater ── */
    const updateBudgetUI = () => {
        let monthlyBudget = parseAmount(budgetInput.value);
        if (isNaN(monthlyBudget) || monthlyBudget <= 0) monthlyBudget = 1;

        const percentage       = (currentSpending / monthlyBudget) * 100;
        const visualPercentage = Math.min(Math.max(percentage, 0), 100);

        progressText.innerText       = `${percentage.toFixed(1)}% of budget used`;
        progressFill.style.width     = visualPercentage + '%';

        if (percentage >= 100) {
            progressFill.style.backgroundColor = '#ef4444';
            alertMsg.style.display = 'flex';
        } else if (percentage >= 85) {
            progressFill.style.backgroundColor = '#ef4444';
            alertMsg.style.display = 'none';
        } else if (percentage >= 50) {
            progressFill.style.backgroundColor = '#f59e0b';
            alertMsg.style.display = 'none';
        } else {
            progressFill.style.backgroundColor = '#10b981';
            alertMsg.style.display = 'none';
        }
    };

    // Initial render
    updateBudgetUI();

    /* ── Live Update on Budget Input ── */
    budgetInput.addEventListener('input', updateBudgetUI);

    /* ── Save Budget Button ── */
    saveBudgetBtn.addEventListener('click', () => {
        updateBudgetUI();

        // Visual success feedback
        const originalHTML = saveBudgetBtn.innerHTML;
        saveBudgetBtn.innerHTML          = '<i data-lucide="check"></i> Saved!';
        saveBudgetBtn.style.backgroundColor = '#10b981';
        lucide.createIcons();

        setTimeout(() => {
            saveBudgetBtn.innerHTML          = originalHTML;
            saveBudgetBtn.style.backgroundColor = '';
            lucide.createIcons();
        }, 2000);
    });
});
