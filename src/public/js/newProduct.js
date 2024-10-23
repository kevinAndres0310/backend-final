const form = document.getElementById('product-form');

form.addEventListener('submit', async event => {
  event.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch('/product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      Swal.fire({
        title: 'Done',
        text: 'Product created successfully',
        icon: 'success',
        confirmButtonText: 'Cool',
      }).then(() => {
        form.reset();
      });
    } else {
      const errorData = await response.json();
      Swal.fire({
        title: 'Error',
        text: `There was an error creating the product: ${errorData.message}`,
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
    }
  } catch (error) {
    Swal.fire({
      title: 'Error',
      text: `There was an error creating the product: ${error.message}`,
      icon: 'error',
      confirmButtonText: 'Try Again',
    });
  }
});
