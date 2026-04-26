/* ==========================================================
   expense-list.js — Expense List Page Logic
   Smart Spend | Used on: expense-list.html
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Initial Data ── */
    let expenses = [
        { id: 1,  dateMain: 'Jan 15, 2024', dateSub: 'Monday',    amount: 42.50,  cat: 'Food & Dining',   catClass: 'cat-dining',       icon: 'utensils',        payment: 'Visa',       last4: '4242' },
        { id: 2,  dateMain: 'Jan 14, 2024', dateSub: 'Sunday',    amount: 18.75,  cat: 'Transportation',  catClass: 'cat-transport',    icon: 'car',             payment: 'Mastercard', last4: '8765' },
        { id: 3,  dateMain: 'Jan 13, 2024', dateSub: 'Saturday',  amount: 125.00, cat: 'Shopping',        catClass: 'cat-shopping',     icon: 'shopping-bag',    payment: 'Visa',       last4: '4242' },
        { id: 4,  dateMain: 'Jan 12, 2024', dateSub: 'Friday',    amount: 8.50,   cat: 'Coffee',          catClass: 'cat-coffee',       icon: 'coffee',          payment: 'Mastercard', last4: '8765' },
        { id: 5,  dateMain: 'Jan 11, 2024', dateSub: 'Thursday',  amount: 65.00,  cat: 'Groceries',       catClass: 'cat-groceries',    icon: 'shopping-basket', payment: 'Visa',       last4: '4242' },
        { id: 6,  dateMain: 'Jan 10, 2024', dateSub: 'Wednesday', amount: 15.99,  cat: 'Entertainment',   catClass: 'cat-entertainment', icon: 'film',           payment: 'Mastercard', last4: '8765' },
        { id: 7,  dateMain: 'Jan 09, 2024', dateSub: 'Tuesday',   amount: 32.00,  cat: 'Fitness',         catClass: 'cat-fitness',      icon: 'dumbbell',        payment: 'Visa',       last4: '4242' },
        { id: 8,  dateMain: 'Jan 08, 2024', dateSub: 'Monday',    amount: 89.99,  cat: 'Technology',      catClass: 'cat-tech',         icon: 'laptop',          payment: 'Mastercard', last4: '8765' },
        { id: 9,  dateMain: 'Jan 07, 2024', dateSub: 'Sunday',    amount: 12.00,  cat: 'Food & Dining',   catClass: 'cat-dining',       icon: 'utensils',        payment: 'Visa',       last4: '4242' },
        { id: 10, dateMain: 'Jan 06, 2024', dateSub: 'Saturday',  amount: 210.00, cat: 'Shopping',        catClass: 'cat-shopping',     icon: 'shopping-bag',    payment: 'Mastercard', last4: '8765' },
        { id: 11, dateMain: 'Jan 05, 2024', dateSub: 'Friday',    amount: 45.50,  cat: 'Groceries',       catClass: 'cat-groceries',    icon: 'shopping-basket', payment: 'Visa',       last4: '4242' },
        { id: 12, dateMain: 'Jan 04, 2024', dateSub: 'Thursday',  amount: 30.00,  cat: 'Transportation',  catClass: 'cat-transport',    icon: 'car',             payment: 'Mastercard', last4: '8765' },
        { id: 13, dateMain: 'Jan 03, 2024', dateSub: 'Wednesday', amount: 9.50,   cat: 'Coffee',          catClass: 'cat-coffee',       icon: 'coffee',          payment: 'Visa',       last4: '4242' },
        { id: 14, dateMain: 'Jan 02, 2024', dateSub: 'Tuesday',   amount: 55.00,  cat: 'Health',          catClass: 'cat-fitness',      icon: 'activity',        payment: 'Mastercard', last4: '8765' },
        { id: 15, dateMain: 'Jan 01, 2024', dateSub: 'Monday',    amount: 18.00,  cat: 'Entertainment',   catClass: 'cat-entertainment', icon: 'film',           payment: 'Visa',       last4: '4242' }
    ];

    /* ── State ── */
    let currentPage  = 1;
    let currentSort  = 'date';
    let searchQuery  = '';
    const ITEMS_PER_PAGE = 9;

    /* ── DOM References ── */
    const tbody               = document.getElementById('expense-tbody');
    const paginationContainer = document.getElementById('pagination-container');
    const countBadge          = document.getElementById('expense-count-badge');
    const searchInput         = document.getElementById('searchInput');
    const sortSelect          = document.getElementById('sortSelect');
    const deleteModal         = document.getElementById('deleteModal');
    const editModal           = document.getElementById('editModal');
    const editAmountInput     = document.getElementById('editAmountInput');

    let itemToEditId   = null;
    let itemToDeleteId = null;

    /* ── SVG Logos ── */
    const visaSvg = `<svg viewBox="0 0 32 10" width="32" style="fill:#1a1f71;"><path d="M12.2,0L9.4,9.6H6.1L8.9,0H12.2z M21.7,0.3c-0.8-0.3-2.1-0.6-3.7-0.6c-3.3,0-5.6,1.7-5.6,4.1c0,1.8,1.6,2.8,2.8,3.4 c1.2,0.6,1.6,1,1.6,1.5c0,0.8-0.9,1.1-1.8,1.1c-1.5,0-2.3-0.2-3.3-0.7l-0.5-0.2l-0.5,3c0.9,0.4,2.6,0.8,4.3,0.8 c3.5,0,5.8-1.7,5.8-4.3c0-1.4-0.8-2.5-2.7-3.4c-1.1-0.5-1.7-0.9-1.7-1.4c0-0.5,0.6-0.9,1.7-0.9c1.2,0,2,0.2,2.8,0.5L21.7,0.3z M30.6,0h-2.5c-0.6,0-1.1,0.3-1.4,0.9l-4,9.6h3.4l0.7-1.9h4.1l0.4,1.9h3L30.6,0z M27.6,5.8l1.6-4.3l0.9,4.3H27.6z M6.9,0L4.9,6.5 L4.1,1.2C4,0.5,3.4,0,2.6,0H0v0.1c0.5,0.1,1.1,0.3,1.7,0.5c0.3,0.1,0.4,0.3,0.5,0.6l2.1,8.4H7.8L10.3,0H6.9z"/></svg>`;
    const mastercardSvg = `<svg viewBox="0 0 36 22" width="24"><circle cx="11" cy="11" r="11" fill="#eb001b"/><circle cx="25" cy="11" r="11" fill="#f79e1b"/><path d="M18,17.7c-2.4-1.6-4-4.3-4-7.4s1.6-5.8,4-7.4c2.4,1.6,4,4.3,4,7.4S20.4,16.1,18,17.7z" fill="#ff5f00"/></svg>`;

    /* ── Render Table ── */
    const renderTable = () => {
        // Filter
        const term     = searchQuery.toLowerCase();
        let filtered   = expenses.filter(ex =>
            ex.cat.toLowerCase().includes(term) || ex.amount.toString().includes(term)
        );

        // Sort
        filtered.sort((a, b) => currentSort === 'amount' ? b.amount - a.amount : a.id - b.id);

        // Update count badge
        countBadge.innerText = `${filtered.length} Expenses`;

        // Pagination
        const totalPages  = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
        if (currentPage > totalPages) currentPage = totalPages;

        const startIndex  = (currentPage - 1) * ITEMS_PER_PAGE;
        const pageItems   = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

        // Render rows
        tbody.innerHTML = '';
        pageItems.forEach(ex => {
            const row        = document.createElement('tr');
            const paymentSvg = ex.payment === 'Visa' ? visaSvg : mastercardSvg;
            row.innerHTML = `
                <td>
                    <div class="date-cell">
                        <div class="date-icon"><i data-lucide="calendar"></i></div>
                        <div class="date-info">
                            <span class="date-main">${ex.dateMain}</span>
                            <span class="date-sub">${ex.dateSub}</span>
                        </div>
                    </div>
                </td>
                <td class="amt-cell">$${ex.amount.toFixed(2)}</td>
                <td>
                    <span class="badge-cat-icon ${ex.catClass}">
                        <i data-lucide="${ex.icon}"></i> ${ex.cat}
                    </span>
                </td>
                <td>
                    <div class="payment-cell">
                        ${paymentSvg}
                        **** ${ex.last4}
                    </div>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action btn-edit"   data-id="${ex.id}"><i data-lucide="pencil"  style="width:14px;height:14px;"></i></button>
                        <button class="btn-action btn-delete" data-id="${ex.id}"><i data-lucide="trash-2" style="width:14px;height:14px;"></i></button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });

        lucide.createIcons();
        renderPagination(totalPages);
    };

    /* ── Render Pagination ── */
    const renderPagination = (totalPages) => {
        paginationContainer.innerHTML = '';
        if (totalPages <= 1) return;

        const createPageItem = (content, onClick, isActive = false) => {
            const a       = document.createElement('a');
            a.href        = '#';
            a.className   = `page-item${isActive ? ' active' : ''}`;
            a.innerHTML   = content;
            a.addEventListener('click', (e) => { e.preventDefault(); onClick(); });
            return a;
        };

        // Prev
        paginationContainer.appendChild(
            createPageItem('<i data-lucide="chevron-left" style="width:16px;height:16px;"></i>', () => {
                if (currentPage > 1) { currentPage--; renderTable(); }
            })
        );

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            const page = i;
            paginationContainer.appendChild(
                createPageItem(i, () => { currentPage = page; renderTable(); }, i === currentPage)
            );
        }

        // Next
        paginationContainer.appendChild(
            createPageItem('<i data-lucide="chevron-right" style="width:16px;height:16px;"></i>', () => {
                if (currentPage < totalPages) { currentPage++; renderTable(); }
            })
        );

        lucide.createIcons();
    };

    /* ── Search & Sort Listeners ── */
    searchInput.addEventListener('input', (e) => {
        searchQuery  = e.target.value;
        currentPage  = 1;
        renderTable();
    });

    sortSelect.addEventListener('change', (e) => {
        currentSort  = e.target.value;
        currentPage  = 1;
        renderTable();
    });

    /* ── Table Action Buttons ── */
    tbody.addEventListener('click', (e) => {
        const btnDelete = e.target.closest('.btn-delete');
        const btnEdit   = e.target.closest('.btn-edit');

        if (btnDelete) {
            itemToDeleteId = parseInt(btnDelete.getAttribute('data-id'));
            deleteModal.classList.add('active');
        }

        if (btnEdit) {
            itemToEditId = parseInt(btnEdit.getAttribute('data-id'));
            const ex     = expenses.find(x => x.id === itemToEditId);
            if (ex) {
                editAmountInput.value = ex.amount;
                editModal.classList.add('active');
                setTimeout(() => editAmountInput.focus(), 100);
            }
        }
    });

    /* ── Modal: Confirm Delete ── */
    document.getElementById('btnConfirmDelete').addEventListener('click', () => {
        if (!itemToDeleteId) return;
        expenses       = expenses.filter(ex => ex.id !== itemToDeleteId);
        itemToDeleteId = null;
        deleteModal.classList.remove('active');
        renderTable();
    });

    /* ── Modal: Confirm Edit ── */
    document.getElementById('btnConfirmEdit').addEventListener('click', () => {
        if (!itemToEditId) return;

        const newAmount = parseFloat(editAmountInput.value);
        if (isNaN(newAmount) || newAmount < 0) {
            alert('Please enter a valid amount.');
            return;
        }

        const idx = expenses.findIndex(x => x.id === itemToEditId);
        if (idx > -1) {
            expenses[idx].amount = newAmount;
            itemToEditId         = null;
            editModal.classList.remove('active');
            renderTable();
        }
    });

    /* ── Modal: Cancel Buttons ── */
    document.getElementById('btnCancelDelete').addEventListener('click', () => deleteModal.classList.remove('active'));
    document.getElementById('btnCancelEdit').addEventListener('click',   () => editModal.classList.remove('active'));

    /* ── Initial Render ── */
    renderTable();
});
