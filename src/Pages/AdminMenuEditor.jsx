import { useRef, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
axios.defaults.withCredentials = true

function AdminMenuEditor() {
    let navigate = useNavigate()
    let nameRef = useRef<HTMLInputElement>(null)
    let priceRef = useRef<HTMLInputElement>(null)
    let descRef = useRef<HTMLTextAreaElement>(null)
    let imageRef = useRef<HTMLInputElement>(null)
    let [categories, setCategories] = useState([])
    let [catId, setCatId] = useState("")
    let [items, setItems] = useState([])
    let [editId, setEditId] = useState<string|null>(null)

    useEffect(() => {
        axios.get("http://localhost:8080/cat/all").then(r => { if (r.data.success) setCategories(r.data.data) })
        axios.get("http://localhost:8080/item/all").then(r => { if (r.data.success) setItems(r.data.data) })
    }, [])

    async function handleSave() {
        let obj = {
            name: nameRef.current?.value,
            price: Number(priceRef.current?.value),
            description: descRef.current?.value,
            image: imageRef.current?.value,
            category: catId
        }
        if (editId) {
            let res = await axios.put(`http://localhost:8080/item/edit/${editId}`, obj)
            if (res.data.success) { alert("Updated!"); setEditId(null) }
        } else {
            let res = await axios.post("http://localhost:8080/item/add", obj)
            if (res.data.success == true) alert("Item added!")
            if (res.data.code == 11000) alert("Already Exists")
        }
        let fresh = await axios.get("http://localhost:8080/item/all")
        setItems(fresh.data.data)
    }

    async function handleDelete(id: string) {
        let res = await axios.delete(`http://localhost:8080/item/delete/${id}`)
        if (res.data.success) setItems((prev: any) => prev.filter((i: any) => i._id !== id))
    }

    return (
        <div>
            <h2>Menu Editor</h2>
            <input ref={nameRef} type="text" placeholder="Item name" />
            <input ref={priceRef} type="number" placeholder="Price (PKR)" />
            <textarea ref={descRef} placeholder="Description" />
            <input ref={imageRef} type="text" placeholder="Image URL" />
            <select onChange={e => setCatId(e.target.value)}>
                {categories.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <button onClick={handleSave}>{editId ? "Update Item" : "Add Item"}</button>

            <div className="items-list">
                {items.map((item: any) => (
                    <div key={item._id} className="item-row">
                        <span>{item.name} — Rs. {item.price}</span>
                        <button onClick={() => { setEditId(item._id) }}>Edit</button>
                        <button onClick={() => handleDelete(item._id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AdminMenuEditor