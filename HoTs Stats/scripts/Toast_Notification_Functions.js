function showToast(message, onConfirm, isInput = false) {
  const toastContainer = document.getElementById('toast-container');
  toastContainer.innerHTML = ''; // Clear any existing toasts

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span>${message}</span>
    <div>
      ${isInput ? '<input type="text" id="toast-input" />' : ''}
      <button class="toast-confirm">Yes</button>
      <button class="toast-cancel">No</button>
    </div>
  `;
  toastContainer.appendChild(toast);

  toast.querySelector('.toast-confirm').addEventListener('click', () => {
    const inputValue = isInput ? document.getElementById('toast-input').value.trim() : null;
    toastContainer.removeChild(toast);
    if (onConfirm) {
      onConfirm(inputValue);
    }
  });

  toast.querySelector('.toast-cancel').addEventListener('click', () => {
    toastContainer.removeChild(toast);
  });
}