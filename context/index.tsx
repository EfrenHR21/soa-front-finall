/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useReducer, createContext, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';


type Props = {
	children: React.ReactNode;
};

// initial state
const intialState = {
	user: null,
};

type Context = {
	state: Record<string, any>;
	dispatch: (action: {
		type: string;
		payload: any 
	}) => void;
};

const initialContext: Context = {
	state: intialState,
	dispatch: () => null,
};

// create context
const Context = createContext<Context>(initialContext);

// root reducer
const userReducer = (
	state: Record<string, any>,
	action: { type: string; payload:  any }
) => {
	switch (action.type) {
		case 'LOGIN':
			return { ...state, user: action.payload };
		case 'LOGOUT':
			return { ...state, user: null };
		case 'UPDATE_USER':
			return { ...state, user: action.payload };
		default:
			return state;
	}
};


const Provider = ({ children }: Props) => {
	const [state, dispatch] = useReducer(userReducer, intialState);
	// router
	const router = useRouter();

	useEffect(() => {
		dispatch({
			type: 'LOGIN',
			payload: localStorage.getItem('_cf_user') 
            ? JSON.parse(window.localStorage.getItem('_cf_user') || '{}')
            : null,
		});

		return;
	}, []);

	axios.interceptors.response.use(
		(response) => {
			return response;
		},
		 (error) => {
			let res = error.response;
			if (error.response.status === 401 ) {
				return new Promise((resolve, reject) => {
					axios
						.put('/api/v1/users/logout')
						.then((res) => {
							dispatch({
								type: 'LOGOUT',
								payload: null,
							});
							localStorage.removeItem('_cf_user');
							router.push('/auth');
						})
						.catch((err) => {
							reject(err);
						});
				});
			}
			return Promise.reject(error);
		}
	);

	useEffect(() => {
		const getCSRF_token = async () => {
		  
			const {data} = await axios.get('/api/v1/csrf-token');
			axios.defaults.headers.common['X-CSRF-TOKEN'] = data.result;
		  };
		
	  
		getCSRF_token();
	  }, []);
	

	return (
		<Context.Provider value={{ state, dispatch }}>
			{children}
		</Context.Provider>
	);
};

export { Context, Provider };