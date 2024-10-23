function removeProduct(productId) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, remove it!',
  }).then(result => {
    if (result.isConfirmed) {
      fetch(`/product/${productId}`, {
        method: 'DELETE',
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            Swal.fire(
              'Removed!',
              'The product has been removed.',
              'success',
            ).then(() => {
              window.location.href = '/product';
            });
          } else {
            Swal.fire(
              'Error!',
              'There was an error removing the product.',
              'error',
            );
          }
        });
    }
  });
}

document
  .getElementById('addToCartButton')
  .addEventListener('click', async function () {
    const productId = this.getAttribute('data-product-id');
    const defaultCartId = '67181b85ea4c6ce17d092490';
    quantity = 1;

    try {
      const response = await fetch(`/carts/${defaultCartId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity,
        }),
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Product added to the cart',
        });
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  });
