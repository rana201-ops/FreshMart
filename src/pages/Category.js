import { useParams, Link } from "react-router-dom";
import catalog from "../data/catalog";

const Category = () => {
  const { name } = useParams();
  const category = catalog[name];

  if (!category) return <h3 className="text-center mt-5">Category not found</h3>;

  const formatName = str => str.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  return (
    <div className="container py-4">
      <img
        src={category.image}
        alt={category.title}
        className="img-fluid rounded mb-4"
        style={{ maxHeight: "280px", objectFit: "cover", width: "100%" }}
      />

      <h2 className="fw-bold mb-4">{category.title}</h2>

      <div className="row g-3">
        {Object.keys(category.subCategories).map(sub => (
          <div className="col-6 col-md-3" key={sub}>
            <Link
              to={`/category/${name}/${sub}`}
              className="card text-center shadow-sm text-decoration-none text-dark"
            >
              <div className="card-body">
                <h6>{formatName(sub)}</h6>
                <small className="text-muted">View products →</small>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
