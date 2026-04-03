import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
axios.defaults.withCredentials = true
import { useCart } from "../context/CartContext"

function Checkout() {
    let navigate = useNavigate()
    let { cart, total, clearCart } = useCart()
    let addressRef = useRef<HTMLInputElement>(null)
    let phoneRef = useRef<HTMLInputElement>(null)
    let [method, setMethod] = useState<"cod"|"easypaisa"|"jazzcash">("cod")
    let [loading, setLoading] = useState(false)

    async function handleCheckout() {
        setLoading(true)
        try {
            // 1. Place order
            let orderRes = await axios.post("http://localhost:8080/order/place", {
                items: cart.map(c => ({ item: c.id, quantity: c.quantity })),
                address: addressRef.current?.value,
                paymentMethod: method
            })

            if (!orderRes.data.success) return alert(orderRes.data.error)

            let orderId = orderRes.data.data._id

            // 2. Online payment if selected
            if (method !== "cod") {
                let payRes = await axios.post(`http://localhost:8080/pay/${method}`, {
                    orderId,
                    phone: phoneRef.current?.value,
                    amount: total
                })
                if (!payRes.data.success) return alert("Payment failed: " + payRes.data.error)
            }

            clearCart()
            navigate("/order-confirm", { state: { orderId } })
        } catch (err) {
            alert("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="checkout-page">
            <h2>Checkout</h2>
            <input ref={addressRef} type="text" placeholder="Delivery address" />
            <div className="payment-options">
                {(["cod","easypaisa","jazzcash"] as const).map(m => (
                    <button key={m} className={method === m ? "active" : ""} onClick={() => setMethod(m)}>
                        {m.toUpperCase()}
                    </button>
                ))}
            </div>
            {method !== "cod" && <input ref={phoneRef} type="text" placeholder="Mobile number (03xx)" />}
            <p>Total: Rs. {total}</p>
            <button onClick={handleCheckout} disabled={loading}>
                {loading ? "Processing..." : "Place Order"}
            </button>
        </div>
    )
}

export default Checkout