// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()


document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-input");
    const searchForm = document.getElementById("search-form");

    if (searchInput) {
        const urlParams = new URLSearchParams(window.location.search);
        const q = urlParams.get('q');
        if (q) {
            searchInput.value = q;
            filterListings(q);
        }

        searchInput.addEventListener("input", (e) => {
            filterListings(e.target.value);
        });
        
        searchForm.addEventListener("submit", (e) => {
            if (window.location.pathname === "/listings" || window.location.pathname === "/") {
                e.preventDefault();
                filterListings(searchInput.value);
            }
        });
    }

    function filterListings(query) {
        const lowerQuery = query.toLowerCase().trim();
        const listings = document.querySelectorAll(".listing-link");
        if(listings.length === 0) return; 

        listings.forEach(link => {
            const cardText = link.innerText.toLowerCase();
            const dataTitle = (link.getAttribute("data-title") || "").toLowerCase();
            const dataLocation = (link.getAttribute("data-location") || "").toLowerCase();
            const dataCountry = (link.getAttribute("data-country") || "").toLowerCase();
            
            if (cardText.includes(lowerQuery) || dataTitle.includes(lowerQuery) || 
                dataLocation.includes(lowerQuery) || dataCountry.includes(lowerQuery)) {
                link.style.display = "";
            } else {
                link.style.display = "none";
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const darkModeIcon = document.getElementById('dark-mode-icon');
    
    if (document.body.classList.contains('dark-mode')) {
        if(darkModeIcon) {
            darkModeIcon.classList.remove('fa-moon');
            darkModeIcon.classList.add('fa-sun');
        }
    }

    if(darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            
            if (isDark) {
                darkModeIcon.classList.remove('fa-moon');
                darkModeIcon.classList.add('fa-sun');
            } else {
                darkModeIcon.classList.remove('fa-sun');
                darkModeIcon.classList.add('fa-moon');
            }
        });
    }
});