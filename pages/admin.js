import { useEffect, useState } from "react";

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((d) => {
        setProducts(d.products);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const save = async (p) => {
    const body = {
      goods_id: p.goods_id,
      location: p.location,
      status: p.status,
      estimated_arrival: p.estimated_arrival,
    };
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const data = await res.json();
      alert("Saved and subscribers notified (if any).");
    } else {
      alert("Save failed");
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin — Products</h1>
      <p>
        Edit product location/status. Subscribers who asked for tracking will be
        notified in Mongolian when changes occur.
      </p>
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Goods ID</th>
            <th>Location</th>
            <th>Status</th>
            <th>ETA</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.goods_id}>
              <td>{p.goods_id}</td>
              <td>
                <input
                  value={p.location}
                  onChange={(e) =>
                    setProducts(
                      products.map((x) =>
                        x.goods_id === p.goods_id
                          ? { ...x, location: e.target.value }
                          : x
                      )
                    )
                  }
                />
              </td>
              <td>
                <input
                  value={p.status}
                  onChange={(e) =>
                    setProducts(
                      products.map((x) =>
                        x.goods_id === p.goods_id
                          ? { ...x, status: e.target.value }
                          : x
                      )
                    )
                  }
                />
              </td>
              <td>
                <input
                  value={p.estimated_arrival}
                  onChange={(e) =>
                    setProducts(
                      products.map((x) =>
                        x.goods_id === p.goods_id
                          ? { ...x, estimated_arrival: e.target.value }
                          : x
                      )
                    )
                  }
                />
              </td>
              <td>
                <button onClick={() => save(p)}>Save</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
