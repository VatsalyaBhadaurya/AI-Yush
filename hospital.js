// Initialize map when the page loads
window.addEventListener('load', () => {
    // Create map centered on Delhi
    const map = L.map('map').setView([28.6139, 77.2090], 12);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Hospital data
    const hospitals = [
        {
            name: "AIIMS Delhi",
            position: [28.5672, 77.2100],
            address: "Sri Aurobindo Marg, Ansari Nagar",
            phone: "011-26588500"
        },
        {
            name: "Safdarjung Hospital",
            position: [28.5679, 77.2090],
            address: "Ansari Nagar West, New Delhi",
            phone: "011-26707444"
        },
        {
            name: "Indraprastha Apollo Hospital",
            position: [28.5421, 77.2831],
            address: "Sarita Vihar, Delhi",
            phone: "011-71791090"
        }
    ];

    // Add markers for each hospital
    hospitals.forEach(hospital => {
        const marker = L.marker(hospital.position).addTo(map);
        
        // Create popup content
        const popupContent = `
            <div class="map-popup">
                <h3>${hospital.name}</h3>
                <p>📍 ${hospital.address}</p>
                <p>☎️ ${hospital.phone}</p>
                <a href="#" class="btn">View Details</a>
            </div>
        `;
        
        marker.bindPopup(popupContent);
    });

    // Add search functionality
    const searchInput = document.querySelector('.search-box input');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        hospitalCards.forEach(card => {
            const hospitalName = card.querySelector('h3').textContent.toLowerCase();
            const hospitalLocation = card.querySelector('.location').textContent.toLowerCase();
            
            if (hospitalName.includes(searchTerm) || hospitalLocation.includes(searchTerm)) {
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });

    // Update the loader code
    const loader = document.querySelector('.loader');
    
    // Hide loader when page is fully loaded
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 300); // Shorter timeout and fade out effect
    }, 1000);

    // Fallback to hide loader if it takes too long
    setTimeout(() => {
        if (loader.style.display !== 'none') {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 300);
        }
    }, 3000); // Fallback timeout

    initMap();
});

// Mobile navigation toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// View toggle functionality
const viewBtns = document.querySelectorAll('.view-btn');
const hospitalGrid = document.querySelector('.hospital-grid');

viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        viewBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const view = btn.dataset.view;
        hospitalGrid.className = `hospital-grid ${view}-view`;
    });
});

// Filter functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const hospitalCards = document.querySelectorAll('.hospital-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');

        const filter = button.getAttribute('data-filter');

        hospitalCards.forEach(card => {
            // Add fade out animation
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    // Add fade in animation
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            }, 300);
        });
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add smooth scrolling and animations
document.addEventListener('DOMContentLoaded', () => {
    // Animate elements on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.hospital-card').forEach((card) => {
        observer.observe(card);
    });
});

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenuBtn?.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                navLinks.classList.remove('active');
                mobileMenuBtn?.classList.remove('active');
            }
        });
    });

    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    const filterSelect = document.querySelector('.filter-select');
    const hospitalCards = document.querySelectorAll('.hospital-card');

    function filterHospitals() {
        const searchTerm = searchInput.value.toLowerCase();
        const filterValue = filterSelect.value;

        hospitalCards.forEach(card => {
            const hospitalName = card.querySelector('h3').textContent.toLowerCase();
            const hospitalCategory = card.dataset.category;
            const matchesSearch = hospitalName.includes(searchTerm);
            const matchesFilter = filterValue === 'all' || hospitalCategory === filterValue;

            if (matchesSearch && matchesFilter) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }

    searchInput?.addEventListener('input', filterHospitals);
    filterSelect?.addEventListener('change', filterHospitals);

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.stat-item, .emergency-card, .hospital-card').forEach(el => {
        el.classList.add('animate');
        observer.observe(el);
    });

    // Emergency call buttons
    document.querySelectorAll('.call-btn').forEach(button => {
        button.addEventListener('click', function() {
            const phoneNumber = this.closest('.emergency-card').querySelector('.phone').textContent;
            window.location.href = `tel:${phoneNumber}`;
        });
    });

    // Header scroll effect
    let lastScroll = 0;
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }

        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            // Scroll down
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            // Scroll up
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });

    // Add loading animation for images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
    });

    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', e => {
            const tip = document.createElement('div');
            tip.className = 'tooltip';
            tip.textContent = e.target.dataset.tooltip;
            document.body.appendChild(tip);

            const rect = e.target.getBoundingClientRect();
            tip.style.top = rect.top - tip.offsetHeight - 10 + 'px';
            tip.style.left = rect.left + (rect.width - tip.offsetWidth) / 2 + 'px';
        });

        tooltip.addEventListener('mouseleave', () => {
            const tip = document.querySelector('.tooltip');
            if (tip) tip.remove();
        });
    });

    // Initialize map
    const map = L.map('map').setView([28.6139, 77.2090], 12); // Delhi coordinates

    // Add Jawg Maps layer with your token
    L.tileLayer('https://tile.jawg.io/jawg-streets/{z}/{x}/{y}.png?access-token=Xn4GSI16rO7MiokT3lpre5bsRURYikF87lGVQQB7GtYBpVU5xeDc5I4QqUahPUTb', {
        attribution: '<a href="https://www.jawg.io" target="_blank">&copy; Jawg</a> - <a href="https://www.openstreetmap.org" target="_blank">&copy; OpenStreetMap</a>',
        minZoom: 0,
        maxZoom: 22
    }).addTo(map);

    // Sample hospital data - Replace with your actual data
    const hospitals = [
        {
            name: "AIIMS Delhi",
            position: [28.5672, 77.2100],
            address: "Sri Aurobindo Marg, Ansari Nagar",
            phone: "011-26588500"
        },
        {
            name: "Safdarjung Hospital",
            position: [28.5679, 77.2090],
            address: "Ansari Nagar West",
            phone: "011-26707444"
        },
        // Add more hospitals here
    ];

    // Add markers for each hospital
    hospitals.forEach(hospital => {
        const marker = L.marker(hospital.position).addTo(map);
        
        // Custom popup content
        const popupContent = `
            <div class="map-popup">
                <h3>${hospital.name}</h3>
                <p><i class="fas fa-map-marker-alt"></i> ${hospital.address}</p>
                <p><i class="fas fa-phone"></i> ${hospital.phone}</p>
                <a href="#" class="btn" onclick="showHospitalDetails('${hospital.name}')">View Details</a>
            </div>
        `;
        
        marker.bindPopup(popupContent);
    });

    // Function to show hospital details
    window.showHospitalDetails = function(hospitalName) {
        // Add your logic to show hospital details
        console.log(`Showing details for ${hospitalName}`);
    };

    // Add geolocation
    map.addControl(new L.Control.Locate({
        position: 'topright',
        strings: {
            title: "Show my location"
        }
    }));

    // Add zoom controls
    map.zoomControl.setPosition('topright');
}); 