# 🏫 Brentwood College School Food Menu

## 1. Overview

This project is a modern, responsive web application designed to display the weekly food menu for Brentwood College School. It provides a user-friendly interface for students and staff to view daily and weekly menus, and a secure admin panel for the kitchen staff to easily update the menu in real-time.

The application is hosted at [food.brentwood.ca](https://food.brentwood.ca) and includes specialized views designed for integration with the Xibo digital signage system used in the dining hall.

> **ℹ️ For in-depth technical documentation, including architecture details, deployment procedures, and troubleshooting tips, please refer to the project Wiki.**

## 2. Features

* 🍽️ **Dynamic Menu Display**: Users can toggle between a daily view (showing Breakfast, Lunch, and Dinner for the selected day) and a full weekly view.

* ✨ **Real-time Updates**: The menu is powered by Firebase Firestore, so any changes made by an admin are reflected instantly for all users without needing a page refresh.

* 🔒 **Admin Control Panel**: A password-protected admin area allows authorized staff to:

  * Log in securely.

  * Edit the menu for any meal on any day of the week.

  * Save changes directly to the live database.

  * Clear the entire weekly menu to start fresh.

* 🖥️ **Digital Signage Integration (Xibo)**: A dedicated set of pages (`views/`) are formatted for use on the school's vertical TV displays. This includes:

  * Individual views for Breakfast, Lunch, or Dinner.

  * A color-coded, two-column weekly menu that scrolls continuously to display long menu descriptions without sacrificing font size.

* 💡 **Engaging Content**: A "Did You Know?" section on the daily view fetches and displays a random food-related fun fact from the Google Gemini API to engage students.

## 3. Tech Stack

* **💻 Frontend**: HTML5, CSS3, Modern JavaScript (ES Modules)

* **🎨 Styling**: [Tailwind CSS](https://tailwindcss.com/) for a utility-first design framework, supplemented with custom styles in `style.css`.

* **☁️ Backend & Database**: [Google Firebase](https://firebase.google.com/)

  * **Firestore**: NoSQL cloud database for storing and syncing menu data in real-time.

  * **Authentication**: For securing the admin login.

  * **Hosting**: For deploying the web application.

* **🤖 APIs**: [Google Gemini API](https://ai.google.dev/) for generating fun facts.

## 4. File Structure

The project is organized into a clean and maintainable structure.

```
/
├── css/
│   └── style.css           # Custom styles and animations
├── images/
│   └── (logo, background)  # Project images
├── js/
│   ├── config.js           # Firebase configuration keys
│   ├── firebase.js         # Handles all Firebase interactions
│   ├── main.js             # Core application logic and state
│   └── ui.js               # Manages all UI rendering and DOM manipulation
├── views/
│   ├── xibo_breakfast.html # Xibo view for daily breakfast
│   ├── xibo_lunch.html     # Xibo view for daily lunch
│   ├── xibo_dinner.html    # Xibo view for daily dinner
│   └── xibo_weekly.html    # Scrolling weekly view for Xibo
├── .firebaserc             # Firebase configuration
├── .gitignore              # Git ignore file
├── firebase.json           # Firebase hosting and rules configuration
├── index.html              # Main application entry point
└── README.md               # Project documentation (this file)
```

## 5. Digital Signage Setup (Xibo)

The HTML files located in the `/views/` directory are specifically designed to be used as `Webpage` elements within Xibo layouts.

#### Key Features for Xibo:

* **Transparent Background**: Allows the views to be overlaid on top of any background image or video in your Xibo layout.

* **Optimized for Vertical Displays**: The `xibo_weekly.html` view is formatted as a two-column grid that scrolls automatically, ensuring it fits perfectly on a 1080x1920 display while handling long menu descriptions.

* **Easy to Use**: Simply use the full URL to the view in your Xibo layout.

#### Example URLs:

* 🔗 **Weekly Scrolling View**: `https://food.brentwood.ca/views/xibo_weekly.html`

* 🔗 **Daily Lunch View**: `https://food.brentwood.ca/views/xibo_lunch.html`

## 6. License ⚖️

This project is open-source and available under the [MIT License](LICENSE). See the `LICENSE` file for more details.