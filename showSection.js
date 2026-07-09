// Show Section Function
function showSection(sectionId) {
    console.log('Showing section:', sectionId);
    
    // Hide all sections
    const allSections = document.querySelectorAll('.content-section');
    allSections.forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });
    
    // Remove active from all nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(nav => nav.classList.remove('active'));
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.style.display = 'block';
        console.log('Section shown:', sectionId);
    } else {
        console.error('Section not found:', sectionId);
    }
    
    // Activate corresponding nav item
    const navItem = document.querySelector(`[data-section="${sectionId}"]`);
    if (navItem) {
        navItem.classList.add('active');
    }
    
    // Update displays based on section
    switch(sectionId) {
        case 'inventory':
            updateInventoryDisplay();
            updateInventoryStats();
            break;
        case 'sales':
            updateSalesDisplay();
            break;
        case 'ecommerce':
            updateEcommerceDisplay();
            break;
        case 'dashboard':
            updateKPIValues();
            break;
    }
}
