import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container empty">
      <h1>We can’t find that page</h1>
      <p>The link may be old, or the address may have a typo.</p>
      <Link className="btn" to="/">
        Go to the home page
      </Link>
    </div>
  );
}
