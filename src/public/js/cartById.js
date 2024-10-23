document.querySelectorAll('.remove-button').forEach(button => {
  button.addEventListener('click', async function () {
    const productId = this.getAttribute('data-product-id');
    const cartId = '67181b85ea4c6ce17d092490';

    try {
      const response = await fetch(`/carts/${cartId}/product/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        location.reload();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  });
});
