import { firebaseConfig } from './config.js'; // Import the configuration

// --- UI ELEMENT SELECTORS ---
const ui = {
    daySelector: document.getElementById('daySelector'),
    dailyViewContainer: document.getElementById('daily-view-container'),
    dailyCardsGrid: document.getElementById('daily-cards-grid'),
    weeklyViewContainer: document.getElementById('weekly-view-container'),
    modalContainer: document.getElementById('modal-container'),
    headerButtons: document.getElementById('header-buttons'),
    foodFactContainer: document.getElementById('food-fact-container')
};

const mealTypes = ["Breakfast", "Lunch", "Dinner"];
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// --- RENDERING FUNCTIONS ---

export function renderPage(state) {
    updateHeaderButtons(state.currentUser, state.isWeeklyView);
    renderDaySelector(state.selectedDay);
    ui.foodFactContainer.classList.add('hidden'); 
    ui.dailyViewContainer.style.display = 'none';
    ui.weeklyViewContainer.classList.add('hidden');

    const daySelectorWrapper = document.getElementById('day-selector-wrapper');

    if (state.isWeeklyView) {
        daySelectorWrapper.classList.add('hidden');
        ui.weeklyViewContainer.classList.remove('hidden');
        renderWeeklyView(state.currentMenuData);
    } else {
        daySelectorWrapper.classList.remove('hidden');
        ui.dailyViewContainer.style.display = 'block';
        renderMealCards(state.currentMenuData, state.selectedDay, state.today);
    }
}

function renderDaySelector(selectedDay) {
    ui.daySelector.innerHTML = '';
    daysOfWeek.forEach(day => {
        const button = document.createElement('button');
        button.className = `day-btn px-5 py-2 rounded-lg font-medium whitespace-nowrap ${day === selectedDay ? 'day-active' : 'hover:bg-gray-200 text-gray-600'}`;
        button.textContent = day;
        button.dataset.day = day;
        ui.daySelector.appendChild(button);
    });
}

function renderMealCards(menuData, selectedDay, today) {
    ui.dailyCardsGrid.innerHTML = '';
    const dayMenu = menuData[selectedDay] || {};

    const mealCardDetails = {
        Breakfast: { color: 'bg-gradient-to-r from-amber-500 to-yellow-500', icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />` },
        Lunch: { color: 'bg-gradient-to-r from-sky-500 to-cyan-500', icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />` },
        Dinner: { color: 'bg-gradient-to-r from-indigo-600 to-purple-600', icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 008.25-4.502z" />` }
    };

    mealTypes.forEach(meal => {
        const details = mealCardDetails[meal];
        const card = document.createElement('div');
        card.className = 'menu-card bg-white rounded-xl shadow-md overflow-hidden flex flex-col';
        const mealContentText = dayMenu[meal] || 'No service today.';
        card.innerHTML = `
            <div class="${details.color} text-white px-6 py-4">
                <div class="flex justify-between items-center">
                    <h2 class="text-xl font-bold">${meal}</h2>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        ${details.icon}
                    </svg>
                </div>
            </div>
            <div class="p-6 meal-card-content flex-grow">
                <p>${mealContentText}</p>
            </div>`;
        ui.dailyCardsGrid.appendChild(card);
    });

    if (selectedDay === today) {
        fetchAndDisplayFoodFact();
    }
}

function renderWeeklyView(menuData) {
    ui.weeklyViewContainer.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-5';

    const dayStyleDetails = {
        Monday:    { bg: 'bg-red-100' },
        Tuesday:   { bg: 'bg-orange-100' },
        Wednesday: { bg: 'bg-yellow-100' },
        Thursday:  { bg: 'bg-green-100' },
        Friday:    { bg: 'bg-sky-100' },
        Saturday:  { bg: 'bg-purple-100' },
        Sunday:    { bg: 'bg-pink-100' }
    };
    
    const mealStyleDetails = {
        Breakfast: { border: 'border-t-amber-500', bg: 'bg-amber-50' },
        Lunch: { border: 'border-t-sky-500', bg: 'bg-sky-50' },
        Dinner: { border: 'border-t-indigo-700', bg: 'bg-indigo-50' }
    };
    
    daysOfWeek.forEach(day => {
        const dayStyles = dayStyleDetails[day];
        const dayCol = document.createElement('div');
        dayCol.className = `${dayStyles.bg} rounded-lg shadow-sm p-3 flex flex-col space-y-3`;
        dayCol.innerHTML = `<h2 class="text-xl font-bold text-center text-gray-800">${day}</h2>`;

        const dayMenu = menuData[day] || {};
        mealTypes.forEach(meal => {
            const details = mealStyleDetails[meal];
            const mealCard = document.createElement('div');
            mealCard.className = `${details.bg} p-3 rounded-md shadow-xs flex-grow border-t-4 ${details.border}`;
            const mealContentText = dayMenu[meal] || 'No service';
            mealCard.innerHTML = `
                <h3 class="font-semibold text-lg mb-1 text-gray-900">${meal}</h3>
                <p class="text-sm text-gray-700 meal-card-content">${mealContentText}</p>`;
            dayCol.appendChild(mealCard);
        });
        grid.appendChild(dayCol);
    });
    ui.weeklyViewContainer.appendChild(grid);
}

async function fetchAndDisplayFoodFact() {
    const todayStr = new Date().toISOString().split('T')[0];
    const cachedFact = JSON.parse(localStorage.getItem('foodFactOfTheDay'));

    if (cachedFact && cachedFact.date === todayStr) {
        displayFoodFact(cachedFact.fact);
        return;
    }

    ui.foodFactContainer.innerHTML = `<p class="font-semibold text-amber-800 italic">Fetching a fun fact...</p>`;
    ui.foodFactContainer.classList.remove('hidden');

    const prompt = `Give me a one-sentence 'Did you know?' fun fact about any food. Make it interesting for a high school audience.`;
    const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };
    const apiKey = firebaseConfig.apiKey;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const result = await response.json();
        const fact = result.candidates[0]?.content?.parts[0]?.text;
        if (fact) {
            localStorage.setItem('foodFactOfTheDay', JSON.stringify({ date: todayStr, fact: fact }));
            displayFoodFact(fact);
        } else {
            ui.foodFactContainer.classList.add('hidden');
        }
    } catch (error) {
        console.error("Food Fact API Error:", error);
        ui.foodFactContainer.classList.add('hidden');
    }
}

function displayFoodFact(fact) {
    ui.foodFactContainer.innerHTML = `
        <div class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-1.131 1.131M21 12h-1M4 12H3m3.343-5.657l-1.131-1.131M12 21v-1m-6.657-3.343l1.131-1.131" />
            </svg>
            <div>
                <h4 class="font-bold text-amber-900">Did You Know?</h4>
                <p class="text-amber-800">${fact}</p>
            </div>
        </div>`;
    ui.foodFactContainer.classList.remove('hidden');
}

function updateHeaderButtons(user, isWeeklyView) {
    ui.headerButtons.innerHTML = '';
    let buttonsHtml = `<button id="view-toggle-btn" class="bg-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition">${isWeeklyView ? 'Daily View' : 'Weekly View'}</button>`;
    if (user) {
        buttonsHtml += `
            <button id="editMenuBtn" class="bg-white text-[#c41230] px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition">Edit Food Menu</button>
            <button id="headerLogoutBtn" class="bg-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition">Logout</button>`;
    } else {
        buttonsHtml += `<button id="adminLoginBtn" class="bg-white text-[#c41230] px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition">Admin Login</button>`;
    }
    ui.headerButtons.innerHTML = buttonsHtml;
}

function createModal(id, content) {
    const existingModal = document.getElementById(id);
    if(existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = id;
    modal.className = "hidden fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4";
    
    const modalBody = document.createElement('div');
    modalBody.className = "bg-white rounded-xl shadow-2xl w-full transform transition-all opacity-0 -translate-y-10";
    
    if (id === 'editorModal') {
        modalBody.classList.add('max-w-7xl', 'h-[90vh]', 'flex', 'flex-col');
    } else {
         modalBody.classList.add('max-w-md');
    }
    modalBody.innerHTML = content;
    modal.appendChild(modalBody);
    ui.modalContainer.appendChild(modal);
    return modal;
}

function showModal(modal) {
    if (!modal) return;
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.firstElementChild.classList.remove('opacity-0', '-translate-y-10');
    }, 10);
}

export function hideModal(modal) {
    if (!modal) return;
    modal.firstElementChild.classList.add('opacity-0', '-translate-y-10');
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.remove(); 
    }, 300);
}

export function populateAdminEditor(menuData, setUnsavedChanges) {
    const editorGrid = document.getElementById('admin-editor-grid');
    if (!editorGrid) return;
    editorGrid.innerHTML = '';
    
    const dayStyleDetails = {
        Monday:    { bg: 'bg-red-100' },
        Tuesday:   { bg: 'bg-orange-100' },
        Wednesday: { bg: 'bg-yellow-100' },
        Thursday:  { bg: 'bg-green-100' },
        Friday:    { bg: 'bg-sky-100' },
        Saturday:  { bg: 'bg-purple-100' },
        Sunday:    { bg: 'bg-pink-100' }
    };
    
    daysOfWeek.forEach(day => {
        const dayStyles = dayStyleDetails[day];
        const dayCol = document.createElement('div');
        dayCol.className = `flex flex-col space-y-4 p-3 rounded-lg ${dayStyles.bg}`;
        dayCol.innerHTML = `<h3 class="text-lg font-bold text-center">${day}</h3>`;

        const dayData = menuData[day] || {};
        mealTypes.forEach(meal => {
            const editorGroup = document.createElement('div');
            editorGroup.innerHTML = `<label class="block text-gray-700 font-medium mb-1">${meal}</label>`;
            const textarea = document.createElement('textarea');
            textarea.id = `edit-${day}-${meal}`;
            textarea.rows = 8;
            textarea.className = 'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c41230] text-sm';
            textarea.value = dayData[meal] || '';
            textarea.addEventListener('input', () => setUnsavedChanges(true));
            editorGroup.appendChild(textarea);
            dayCol.appendChild(editorGroup);
        });
        editorGrid.appendChild(dayCol);
    });
    setUnsavedChanges(false);
}

export function showLoginModal(callbacks) {
    const modalId = 'loginModal';
    const modalContent = `
        <div class="p-8">
            <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Admin Login</h2>
            <form id="loginForm">
                 <div class="mb-4">
                    <label for="email" class="block text-gray-700 font-medium mb-2">Email</label>
                    <input type="email" id="email" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c41230]" required>
                </div>
                <div class="mb-4">
                    <label for="password" class="block text-gray-700 font-medium mb-2">Password</label>
                    <input type="password" id="password" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c41230]" required>
                </div>
                <p id="password-error" class="text-red-500 text-sm h-5 mb-2"></p>
                <button type="submit" class="w-full bg-[#c41230] text-white py-2.5 px-4 rounded-lg font-medium hover:bg-[#a30f28] transition">Login</button>
            </form>
        </div>`;
    const modal = createModal(modalId, modalContent);
    
    modal.querySelector('#loginForm').addEventListener('submit', (e) => callbacks.onLoginSubmit(e));
    showModal(modal);
}

export function showEditorModal(callbacks) {
    const modalId = 'editorModal';
    const modalContentHtml = `
        <div class="p-6 flex flex-col h-full bg-gray-50">
             <div class="flex-shrink-0 flex justify-between items-center mb-4 border-b pb-4">
                <div>
                    <h2 class="text-2xl font-bold">Weekly Menu Editor</h2>
                    <p class="text-sm text-gray-500">Edit the menu for the entire week below.</p>
                </div>
                 <button id="close-editor-btn" class="text-gray-400 text-3xl leading-none hover:text-gray-600">&times;</button>
             </div>
             <div id="admin-editor-grid" class="flex-grow grid grid-cols-1 md:grid-cols-4 xl:grid-cols-7 gap-4 overflow-y-auto pr-2"></div>
             <div id="editor-footer" class="flex-shrink-0 mt-6 flex justify-between items-center border-t pt-4">
                <button id="clear-menu-btn" class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition">Clear Menu</button>
                <div class="flex items-center">
                    <p id="save-status" class="text-green-600 text-sm mr-4 h-5"></p>
                    <button id="saveMenu" class="bg-[#c41230] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#a30f28] transition">Save All Changes</button>
                </div>
             </div>
        </div>`;
    
    const modal = createModal(modalId, modalContentHtml);
    
    modal.querySelector('#close-editor-btn').addEventListener('click', () => {
        if (callbacks.getUnsavedChanges()) {
            showConfirmationModal({
                title: "You have unsaved changes",
                message: "Are you sure you want to close? Your changes will be lost.",
                onConfirm: () => hideModal(modal)
            });
        } else {
            hideModal(modal);
        }
    });

    modal.querySelector('#clear-menu-btn').addEventListener('click', () => {
        showConfirmationModal({
            title: "Are you sure?",
            message: "This will clear the entire weekly menu. This action cannot be undone.",
            onConfirm: callbacks.onClear
        });
    });

    modal.querySelector('#saveMenu').addEventListener('click', callbacks.onSave);

    populateAdminEditor(callbacks.getMenuData(), callbacks.setUnsavedChanges);
    showModal(modal);
}

function showConfirmationModal(config) {
    const confModalId = 'confirmationModal';
    const confModalContent = `
        <div class="bg-white p-8 rounded-lg shadow-xl text-center max-w-md mx-auto">
            <h3 class="text-xl font-bold mb-4">${config.title}</h3>
            <p class="text-gray-600 mb-6">${config.message}</p>
            <div class="flex justify-center space-x-4">
                <button class="cancel-btn bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition">Cancel</button>
                <button class="confirm-btn bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition">Yes, Continue</button>
            </div>
        </div>`;

    const confModal = createModal(confModalId, confModalContent);
    showModal(confModal);
    confModal.querySelector('.confirm-btn').addEventListener('click', () => {
        config.onConfirm();
        hideModal(confModal);
    });
    confModal.querySelector('.cancel-btn').addEventListener('click', () => hideModal(confModal));
}

export function getDefaultMenu() {
    const menu = {};
    daysOfWeek.forEach(day => {
        menu[day] = { Breakfast: "", Lunch: "", Dinner: "" };
    });
    return menu;
}
