import { onAuthChange, setupRealtimeListener, saveMenu, handleSignIn, handleSignOut } from './firebase.js';
import { renderPage, showLoginModal, showEditorModal, populateAdminEditor, getDefaultMenu, hideModal } from './ui.js';

// --- STATE MANAGEMENT ---
const state = {
    currentMenuData: {},
    currentUser: null,
    isWeeklyView: false,
    editorHasUnsavedChanges: false,
    daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    mealTypes: ["Breakfast", "Lunch", "Dinner"],
    today: "",
    selectedDay: ""
};

state.today = state.daysOfWeek[(new Date().getDay() + 6) % 7];
state.selectedDay = state.today;

// --- EVENT HANDLER LOGIC ---

async function handleLogin(event) {
    event.preventDefault(); // This is crucial to prevent page reload
    const form = event.target.closest('form');
    const email = form.querySelector('#email').value;
    const password = form.querySelector('#password').value;
    const errorEl = form.querySelector('#password-error');
    try {
        await handleSignIn(email, password);
        // onAuthStateChanged will handle hiding the modal and other UI updates
    } catch (err) {
        errorEl.textContent = 'Invalid email or password.';
    }
}

const editorCallbacks = {
    onSave: async () => {
        const editorModal = document.getElementById('editorModal');
        if (!editorModal) return;
        const saveStatus = editorModal.querySelector('#save-status');
        saveStatus.textContent = 'Saving...';
        
        const updatedMenu = {};
        state.daysOfWeek.forEach(day => {
            updatedMenu[day] = {};
            state.mealTypes.forEach(meal => {
                const textarea = document.getElementById(`edit-${day}-${meal}`);
                if (textarea) updatedMenu[day][meal] = textarea.value;
            });
        });

        const success = await saveMenu(updatedMenu);
        if (success) {
            saveStatus.textContent = 'Saved!';
            state.editorHasUnsavedChanges = false;
        } else {
            saveStatus.textContent = 'Error saving.';
        }
        setTimeout(() => { if(saveStatus) saveStatus.textContent = ''; }, 2000);
    },
    onClear: async () => {
        const clearedMenu = getDefaultMenu();
        const success = await saveMenu(clearedMenu);
        if(success) {
            state.editorHasUnsavedChanges = false;
            // The onSnapshot listener will automatically re-render the public view.
            // We need to manually re-render the editor since it's in a modal.
            populateAdminEditor(clearedMenu, editorCallbacks.setUnsavedChanges);
        }
    },
    getMenuData: () => state.currentMenuData,
    setUnsavedChanges: (hasChanges) => {
        state.editorHasUnsavedChanges = hasChanges;
    },
    getUnsavedChanges: () => state.editorHasUnsavedChanges
};

// --- INITIALIZATION ---
function initialize() {
    document.getElementById('footer-year').textContent = new Date().getFullYear().toString();
    
    // Set up listeners that update the state and re-render
    setupRealtimeListener((data) => {
        state.currentMenuData = data;
        renderPage(state);
        
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay.style.display !== 'none') {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => { loadingOverlay.style.display = 'none'; }, 300);
        }
    }, getDefaultMenu);

    onAuthChange((user) => {
        state.currentUser = user;
        renderPage(state); // Update header buttons
        
        if (user) {
            // If user is logged in, hide the login modal if it's open
            const loginModal = document.getElementById('loginModal');
            if (loginModal) {
                hideModal(loginModal);
            }
        }
    });

    // Delegated event listener for dynamically added header buttons
    const headerButtons = document.getElementById('header-buttons');
    headerButtons.addEventListener('click', (event) => {
        const target = event.target.closest('button');
        if (!target) return;
        
        const targetId = target.id;
        if (targetId === 'view-toggle-btn') {
            state.isWeeklyView = !state.isWeeklyView;
            renderPage(state);
        } else if (targetId === 'editMenuBtn') {
            showEditorModal(editorCallbacks);
        } else if (targetId === 'headerLogoutBtn') {
            handleSignOut();
        } else if (targetId === 'adminLoginBtn') {
            showLoginModal({ onLoginSubmit: handleLogin });
        }
    });

    const daySelector = document.getElementById('daySelector');
    daySelector.addEventListener('click', (event) => {
        const target = event.target.closest('.day-btn');
        if(target) {
            state.isWeeklyView = false;
            state.selectedDay = target.dataset.day;
            renderPage(state);
        }
    });
}

// Run the application
initialize();
