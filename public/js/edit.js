function updateValue(inputId) {
    const rangeInput = document.getElementById(inputId);
    const valueSpan = document.getElementById(inputId + 'rana');
    valueSpan.textContent = rangeInput.value;
  }