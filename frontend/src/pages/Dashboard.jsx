import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const isAdmin = user?.is_admin;

    const [vehicles, setVehicles] = useState([]);
    const [search, setSearch] = useState("");
    const [editing, setEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const [vehicle, setVehicle] = useState({
        make: "",
        model: "",
        category: "",
        price: "",
        quantity: ""
    });

    useEffect(() => {
        loadVehicles();
    }, []);

    const loadVehicles = async () => {

        try {

            const res = await api.get("/vehicles/");

            setVehicles(res.data);

        } catch {

            navigate("/");

        }

    };

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");

    };

    const handleChange = (e) => {

        setVehicle({

            ...vehicle,

            [e.target.name]: e.target.value

        });

    };

    const addVehicle = async (e) => {

        e.preventDefault();

        try {

            await api.post("/vehicles/", vehicle);

            alert("Vehicle Added Successfully");

            setVehicle({
                make: "",
                model: "",
                category: "",
                price: "",
                quantity: ""
            });

            loadVehicles();

        } catch (err) {

            alert(err.response?.data?.detail || "Failed");

        }

    };

    const updateVehicle = async (e) => {

        e.preventDefault();

        try {

            await api.put(`/vehicles/${editId}`, vehicle);

            alert("Vehicle Updated");

            setEditing(false);

            setVehicle({
                make: "",
                model: "",
                category: "",
                price: "",
                quantity: ""
            });

            loadVehicles();

        } catch (err) {

            alert(err.response?.data?.detail);

        }

    };

    const editVehicle = (v) => {

        setVehicle({
            make: v.make,
            model: v.model,
            category: v.category,
            price: v.price,
            quantity: v.quantity
        });

        setEditId(v.id);

        setEditing(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };

    const deleteVehicle = async (id) => {

        if (!window.confirm("Delete this vehicle?")) return;

        try {

            await api.delete(`/vehicles/${id}`);

            alert("Vehicle Deleted");

            loadVehicles();

        } catch (err) {

            alert(err.response?.data?.detail);

        }

    };

    const purchase = async (id) => {

        try {

            await api.post(`/vehicles/${id}/purchase`);

            alert("Vehicle Purchased Successfully");

            loadVehicles();

        } catch (err) {

            alert(err.response?.data?.detail);

        }

    };

    const restockVehicle = async (id) => {

        const qty = prompt("Enter Quantity");

        if (!qty) return;

        try {

            await api.post(`/vehicles/${id}/restock?quantity=${qty}`);

            alert("Vehicle Restocked");

            loadVehicles();

        } catch (err) {

            alert(err.response?.data?.detail);

        }

    };

    const searchVehicle = async (value) => {

        setSearch(value);

        if (value === "") {

            loadVehicles();

            return;

        }

        try {

            const res = await api.get(`/vehicles/search?make=${value}`);

            setVehicles(res.data);

        } catch (err) {

            console.log(err);

        }

    };

    const carImage = (make) => {

        const cars = {

            BMW: "https://images.unsplash.com/photo-1555215695-3004980ad54e",

            Audi: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",

            Tesla: "https://images.unsplash.com/photo-1560958089-b8a1929cea89",

            Toyota: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341",

            Honda: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7"

        };

        return cars[make] || "https://images.unsplash.com/photo-1502877338535-766e1452684a";
    };

    return (
        <div className="container-fluid bg-light min-vh-100">

<div className="container-fluid px-5 py-4">

<div className="d-flex justify-content-between align-items-center mb-4">

<div>

<h1 className="fw-bold text-primary">
🚗 {isAdmin ? "Admin Dashboard" : "Car Dealership"}
</h1>

<h4 className="mt-2">
Hello,
<span className="text-success">
{" "}{user?.full_name || "User"}
</span>
 👋
</h4>

<p className="text-muted">

{isAdmin
? "Manage your dealership inventory and stock."
: "Browse premium cars and purchase your dream vehicle."}

</p>

</div>

<button
className="btn btn-danger px-4"
onClick={logout}
>
Logout
</button>

</div>

<hr />

{
isAdmin && (

<div className="card shadow-lg border-0 mb-5">

<div className="card-body">

<h3 className="mb-4">

{editing
? "✏ Update Vehicle"
: "➕ Add New Vehicle"}

</h3>

<form onSubmit={editing ? updateVehicle : addVehicle}>

<div className="row mb-3">

<div className="col-md-6">

<input
className="form-control"
placeholder="Vehicle Make"
name="make"
value={vehicle.make}
onChange={handleChange}
required
/>

</div>

<div className="col-md-6">

<input
className="form-control"
placeholder="Vehicle Model"
name="model"
value={vehicle.model}
onChange={handleChange}
required
/>

</div>

</div>

<div className="row mb-3">

<div className="col-md-4">

<input
className="form-control"
placeholder="Category"
name="category"
value={vehicle.category}
onChange={handleChange}
required
/>

</div>

<div className="col-md-4">

<input
type="number"
className="form-control"
placeholder="Price"
name="price"
value={vehicle.price}
onChange={handleChange}
required
/>

</div>

<div className="col-md-4">

<input
type="number"
className="form-control"
placeholder="Quantity"
name="quantity"
value={vehicle.quantity}
onChange={handleChange}
required
/>

</div>

</div>

<button
className="btn btn-primary px-4"
>

{editing
? "Update Vehicle"
: "Add Vehicle"}

</button>

</form>

</div>

</div>

)

}

<div className="row mb-4">

<div className="col-md-8 mx-auto">

<input
className="form-control form-control-lg"
placeholder="🔍 Search vehicle by make..."
value={search}
onChange={(e)=>searchVehicle(e.target.value)}
/>

</div>

</div>

<div className="row">

{vehicles.map((v) => (

<div
className="col-xl-3 col-lg-4 col-md-6 col-sm-8 mb-4 d-flex justify-content-center"
key={v.id}
>

<div
className="card shadow-lg border-0 h-100"
style={{
width: "350px",    
borderRadius:"20px",
overflow:"hidden",
transition:"0.3s"
}}
>

<img
src={carImage(v.make)}
alt={v.make}
style={{
height:"230px",
objectFit:"cover"
}}
/>

<div className="card-body text-center">

<h3 className="fw-bold">
{v.make}
</h3>

<h5 className="text-secondary">
{v.model}
</h5>

<span className="badge bg-primary fs-6 mb-3">
{v.category}
</span>

<h4 className="text-success mb-3">
₹ {Number(v.price).toLocaleString()}
</h4>

<p className="fw-bold">

Available :

<span
className={
v.quantity > 5
? "text-success"
: "text-danger"
}
>

{" "}
{v.quantity}

</span>

</p>

{/* USER BUTTON */}

{!isAdmin && (

<button
className="btn btn-success w-100 mb-2"
disabled={v.quantity === 0}
onClick={() => purchase(v.id)}
>

{v.quantity === 0
? "Out of Stock"
: "🛒 Purchase Vehicle"}

</button>

)}

{/* ADMIN BUTTONS */}

{isAdmin && (

<>

<button
className="btn btn-warning w-100 mb-2"
onClick={() => editVehicle(v)}
>

✏ Edit Vehicle

</button>

<button
className="btn btn-danger w-100 mb-2"
onClick={() => deleteVehicle(v.id)}
>

🗑 Delete Vehicle

</button>

<button
className="btn btn-info w-100"
onClick={() => restockVehicle(v.id)}
>

📦 Restock Vehicle

</button>

</>

)}

</div>

</div>

</div>

))}

</div>

<hr className="mt-5"/>

<div className="text-center py-4">

<h4 className="text-primary">
🚗 Car Dealership Inventory System
</h4>

<p className="text-muted mb-1">
Built with React • FastAPI • SQLite
</p>

<p className="small text-secondary">
Inventory Management | Vehicle Purchase | Role-Based Authentication
</p>

</div>

</div>

</div>

);

}

export default Dashboard;