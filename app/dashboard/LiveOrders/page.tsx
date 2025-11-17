



export default function LiveOrders() {


  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Recent Orders</h2>
      <ul className="space-y-1">
        {/*orders?.map((order) => (
          <li key={order.id} className="border-b py-1">
            {order.productTitle} - Quantity: {order.quantity}
          </li>
        ))*/}
      </ul>
    </div>
  );
}
