/* ==========================================================
   dashboard.js — Dashboard Page Interactive Logic
   Smart Spend | Used on: dashboard.html
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ── DOM References ── */
    const spendingEl    = document.querySelector('.card:nth-child(1) .amount.green');
    const budgetEl      = document.querySelector('.card:nth-child(2) .amount.black');
    const percentageEl  = document.querySelector('.budget-percentage');
    const progressFillEl = document.querySelector('.progress-fill');
    const remainingEl   = document.querySelector('.budget-remaining');
    const alertMsgEl    = document.getElementById('budget-alert-msg');
    const tbody         = document.querySelector('.transactions-table tbody');

    /* ── Modals ── */
    const deleteModal      = document.getElementById('deleteModal');
    const editModal        = document.getElementById('editModal');
    const addExpenseModal  = document.getElementById('addExpenseModal');
    const editAmountInput  = document.getElementById('editAmountInput');
    const newExpenseAmount = document.getElementById('newExpenseAmount');
    const openAddExpenseBtn = document.getElementById('openAddExpenseBtn');

    /* ── Helpers ── */
    const parseAmount  = (str) => parseFloat(String(str).replace(/,/g, ''));
    const formatAmount = (num) => num.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    /* ── State ── */
    let monthlySpending = parseAmount(spendingEl.innerText);
    let monthlyBudget   = parseAmount(budgetEl.innerText);
    let currentRowToEdit   = null;
    let currentRowToDelete = null;

    /* ── Budget UI Updater ── */
    const updateBudgetUI = () => {
        let percentage = (monthlySpending / monthlyBudget) * 100;
        percentage = Math.min(Math.max(percentage, 0), 100);

        spendingEl.innerText    = formatAmount(monthlySpending);
        percentageEl.innerText  = percentage.toFixed(1) + '%';
        progressFillEl.style.width = percentage.toFixed(1) + '%';

        const remaining = monthlyBudget - monthlySpending;
        remainingEl.innerText   = 'Remaining: ' + formatAmount(remaining);

        if (percentage >= 100) {
            progressFillEl.style.backgroundColor = '#ef4444';
            alertMsgEl.style.display = 'flex';
        } else if (percentage >= 85) {
            progressFillEl.style.backgroundColor = '#ef4444';
            alertMsgEl.style.display = 'none';
        } else if (percentage >= 50) {
            progressFillEl.style.backgroundColor = '#f59e0b';
            alertMsgEl.style.display = 'none';
        } else {
            progressFillEl.style.backgroundColor = '#10b981';
            alertMsgEl.style.display = 'none';
        }
    };

    // Run on load
    updateBudgetUI();

    /* ── Open Add Expense Modal ── */
    openAddExpenseBtn.addEventListener('click', () => {
        newExpenseAmount.value = '';
        addExpenseModal.classList.add('active');
        setTimeout(() => newExpenseAmount.focus(), 100);
    });

    /* ── Confirm Add Expense ── */
    document.getElementById('btnConfirmAdd').addEventListener('click', () => {
        const amountStr = newExpenseAmount.value.trim();
        if (!amountStr) return;

        const amount = parseFloat(amountStr);
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid positive number.');
            return;
        }

        monthlySpending += amount;

        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>
                <div class="tx-desc">
                    <div class="tx-icon"><i data-lucide="banknote"></i></div>
                    New Expense
                </div>
            </td>
            <td><span class="badge-cat" style="background-color:#f3f4f6;color:#4b5563;">Others</span></td>
            <td class="tx-date">Just now</td>
            <td class="tx-amount">${formatAmount(amount)}</td>
            <td>
                <div class="tx-actions">
                    <i data-lucide="pencil"></i>
                    <i data-lucide="trash-2"></i>
                </div>
            </td>
        `;
        tbody.insertBefore(newRow, tbody.firstChild);
        lucide.createIcons();

        updateBudgetUI();
        addExpenseModal.classList.remove('active');
    });

    /* ── Confirm Delete ── */
    document.getElementById('btnConfirmDelete').addEventListener('click', () => {
        if (!currentRowToDelete) return;

        const amountCell = currentRowToDelete.querySelector('.tx-amount');
        monthlySpending -= parseAmount(amountCell.innerText);
        currentRowToDelete.remove();
        currentRowToDelete = null;

        updateBudgetUI();
        deleteModal.classList.remove('active');
    });

    /* ── Confirm Edit ── */
    document.getElementById('btnConfirmEdit').addEventListener('click', () => {
        if (!currentRowToEdit) return;

        const amountCell   = currentRowToEdit.querySelector('.tx-amount');
        const currentAmount = parseAmount(amountCell.innerText);
        const newAmount     = parseFloat(editAmountInput.value);

        if (isNaN(newAmount) || newAmount < 0) return;

        monthlySpending = monthlySpending - currentAmount + newAmount;
        amountCell.innerText = formatAmount(newAmount);
        currentRowToEdit = null;

        updateBudgetUI();
        editModal.classList.remove('active');
    });

    /* ── Close Modals ── */
    document.getElementById('btnCancelDelete').addEventListener('click', () => deleteModal.classList.remove('active'));
    document.getElementById('btnCancelEdit').addEventListener('click',   () => editModal.classList.remove('active'));
    document.getElementById('btnCancelAdd').addEventListener('click',    () => addExpenseModal.classList.remove('active'));

    /* ── Transaction Row Click (Edit / Delete) ── */
    tbody.addEventListener('click', (e) => {
        const row       = e.target.closest('tr');
        const btnDelete = e.target.closest('[data-lucide="trash-2"]');
        const btnEdit   = e.target.closest('[data-lucide="pencil"]');

        if (btnDelete && row) {
            currentRowToDelete = row;
            deleteModal.classList.add('active');
        }

        if (btnEdit && row) {
            currentRowToEdit = row;
            const amountCell  = row.querySelector('.tx-amount');
            editAmountInput.value = parseAmount(amountCell.innerText);
            editModal.classList.add('active');
            setTimeout(() => editAmountInput.focus(), 100);
        }
    });
});
