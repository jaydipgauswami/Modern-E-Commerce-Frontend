"use client";

import { useCart } from "@/app/context/CartContext";

function CartPage() {
  const { cartItems, removeFromCart,updateQuantity} = useCart(); 
 const totalPrice = cartItems.reduce(
  (acc, item) => acc + Number(item.price.toString().replace(/[^0-9.-]+/g, "")) * item.quantity,
  0
);


  return (
    <div className="max-w-5xl mx-auto p-6 py-30">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-gray-500">Product</th>
                <th className="px-6 py-3 text-left text-gray-500">Price</th>
                <th className="px-6 py-3 text-left text-gray-500">Quantity</th>
                <th className="px-6 py-3 text-left text-gray-500">Total</th>
                <th className="px-6 py-3 text-left text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 flex items-center gap-4">
                    <img
                      src={item.img || item.image} // context me image ka key check karo
                      alt={item.name}
                      className="h-16 w-16 object-cover rounded"
                    />
                    <span>{item.name}</span>
                  </td>
                  <td className="px-6 py-4">{item.price}</td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      value={item.quantity}
                      min={1}
                      onChange={(e) =>
                        updateQuantity(item.id, Number(e.target.value))
                      }
                      className="w-16 border rounded text-center"
                    />
                  </td>
                <td className="px-6 py-4">
  ₹{Number(item.price.toString().replace(/[^0-9.-]+/g, "")) * item.quantity}
</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mt-6 items-center gap-6">
            <span className="text-xl font-bold">Total: {totalPrice}</span>
            <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default CartPage;