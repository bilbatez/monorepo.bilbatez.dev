import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mt-4">
      Oops! Salah jalan. Kita kembali ke beranda, yuk!
      <br />
      <div className="mt-3">
        <Link to="/">
          <button>Kembali ke beranda</button>
        </Link>
      </div>
    </div>
  );
}
