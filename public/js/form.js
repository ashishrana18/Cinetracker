function updateValue(inputId) {
  const rangeInput = document.getElementById(inputId);
  const valueSpan = document.getElementById(inputId + 'rana');
  valueSpan.textContent = rangeInput.value;
}
function populateYearDropdown(startYear, endYear) {
    const yearSelector = document.getElementById('yearSelector');
  
    // Clear previous options
    yearSelector.innerHTML = '';
  
    // Create and add options to the dropdown
    for (let year = startYear; year <= endYear; year++) {
      const option = document.createElement('option');
      option.value = year;
      option.text = year;
      yearSelector.appendChild(option);
    }
  }
  // Populate the year dropdown with a range of years (e.g., from 2020 to 2030)
  populateYearDropdown(1900, 2024);

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