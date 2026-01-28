import { useEffect, useState } from "react";

const OFFERS_KEY = "freshmart_offers";

const Offers = () => {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(OFFERS_KEY) || "[]");
    const active = saved.filter((o) => o.active !== false);
    setOffers(active);
  }, []);

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Latest Offers </h2>

      {offers.length === 0 ? (
        <div className="alert alert-warning">
          No offers available right now. Please check later.
        </div>
      ) : (
        <div className="row g-4">
          {offers.map((o) => (
            <div className="col-md-4" key={o.id}>
              <div className="card p-4 shadow-sm h-100 text-center">
                <h4 className="fw-bold text-success">{o.title}</h4>
                <p className="text-muted mb-0">{o.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Offers;
