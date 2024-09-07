import { createContext } from 'react';

const MyContext = createContext({state: {cart: [], user: {}}, dispatchCart: () => undefined, dispatchUser: () => undefined});

export default MyContext;
