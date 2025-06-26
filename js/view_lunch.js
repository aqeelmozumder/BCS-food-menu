// view_lunch.js
document.addEventListener("DOMContentLoaded", async function () {
    const mealContainer = document.getElementById('meal-content');
    
    // Firebase Firestore URL for the weekly menu data
    const firebaseUrl = 'https://brentwood-food-menu.firebaseio.com/artifacts/brentwood-food-menu/public/data/menu/weeklyMenu.json';
    
    try {
        // Fetch the menu data
        const response = await fetch(firebaseUrl);
        const data = await response.json();
        
        // Get today's day of the week (e.g., "Monday")
        const today = new Date().toLocaleString('en-us', { weekday: 'long' });
        
        // Get the Lunch for today's day
        const lunch = data[today] ? data[today].Lunch : 'No service today.';
        
        // Insert the lunch content into the page
        mealContainer.innerHTML = `<h1>Lunch Today: ${lunch}</h1>`;
    } catch (error) {
        console.error('Error fetching menu data:', error);
        mealContainer.innerHTML = '<h1>Failed to load the menu</h1>';
    }
});
