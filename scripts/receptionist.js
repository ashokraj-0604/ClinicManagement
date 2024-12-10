document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');
  
    // Function to show the correct section
    function showSection(sectionId) {
      sections.forEach(section => {
        section.classList.toggle('active', section.id === sectionId);
      });
    }
  
    // Navigation button event listeners
    navButtons.forEach(button => {
      button.addEventListener('click', () => {
        showSection(button.dataset.section);
      });
    });

    
      
  
    // Logout functionality
    const logoutButton = document.getElementById('logout-btn');
    logoutButton.addEventListener('click', () => {
      alert('You have been logged out.');
      window.location.href = '/login.html'; // Adjust the redirect path as needed
    });
  });
  