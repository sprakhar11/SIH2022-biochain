import { Link } from 'react-router-dom';
export const elements = [
  {
    type: 'login',
    body: (
      <Link
        className={`mx-2 text-dark text-decoration-none btn border-dark bg-none`}
        to='/login'
      >
        Login
      </Link>
    ),
  },
  {
    type: 'home',
    body: (
      <Link
        className={`mx-2 text-dark text-decoration-none btn border-dark bg-none`}
        to='/'
      >
        Home
      </Link>
    ),
  },
  {
    type: 'logout',
    body: (
      <Link
        className={`mx-2 text-dark text-decoration-none btn border-dark bg-none`}
        to='/'
      >
        Logout
      </Link>
    ),
  },
];
