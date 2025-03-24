const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			host: "https://playground.4geeks.com/contact/agendas",
			contacts: [],
			currentContact: {},
			hostStarWars: "https://www.swapi.tech/api",
			characters: [],
			detailCharacters: {},
			uidCharacters: '',
			planets: [],
			detailPlanets: {},
			uidPlanets: '',
			starships: [],
			detailStarships: {},
			uidStarships: '',
			favorites: [],
			isLogged: false,
			user: null,
			alert: { text: '', background: 'primary', visible: false }
		},
		actions: {
			setCurrentContact: (item) => { setStore({ currentContact: item }) },
			setIsLogged: (value) => { setStore({ isLogged: value }) },
			setUser: (currentUser) => { setStore({ user: currentUser }) },
			setAlert: (newAlert) => setStore({ alert: newAlert }),
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},
			getFromLocalStorage: (key) => {
				const data = localStorage.getItem(key)
				return JSON.parse(data)
			},
			login: async (dataToSend) => {
				const uri = `${process.env.BACKEND_URL}/api/login`
				const response = await fetch(uri, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(dataToSend)
				})

				const data = await response.json()
				if (!response.ok) return { status: 400, data: data }
				localStorage.setItem("user", JSON.stringify(data.results))
				localStorage.setItem("accessToken", data.access_token)
				setStore({ user: data.results })
				return response;
			},
			signup: async (dataToSend) => {
				const uri = `${process.env.BACKEND_URL}/api/signup`
				console.log(dataToSend)
				const response = await fetch(uri, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(dataToSend)
				})

				if (!response.ok) {
					console.error("Error en el registro:", response.statusText);
					return null;
				}

				const body = {
					email: dataToSend.email,
					password: dataToSend.password,
				}

				const loginResponse = await getActions().login(body)
				return loginResponse
			},
			logout: async () => {
				localStorage.clear()
				setStore({ user: null })
			},
			checkAuth: async () => {
				const token = localStorage.getItem("token");
				if (!token) return;

				const response = await fetch(`${process.env.BACKEND_URL}/api/protected`, {
					headers: { "Authorization": `Bearer ${token}` }
				});

				if (response.ok) {
					const data = await response.json();
					setStore({ isLogged: true, user: data.user });
				} else {
					localStorage.removeItem("token");
					setStore({ isLogged: false, user: null });
				}
			},
			addFavorites: (item) => {
				const favorites = getStore().favorites;
				if (!favorites.includes(item)) {
					setStore({ favorites: [...getStore().favorites, item] });
				}
			},
			removeFavorites: (item) => {
				const favorites = getStore().favorites;
				setStore({ favorites: favorites.filter((favorite) => favorite != item) })
			},
			createAgenda: async () => {
				const uri = `${getStore().host}/${getStore().user}`;
				const options = {
					method: "POST"
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.error("Error: ", response.status, response.statusText);
					return;
				}
				const response2 = await fetch(uri);
				const data = await response2.json();
				setStore({ contacts: data.contacts });
			},
			getContact: async () => {
				const uri = `${getStore().host}/${getStore().user}`;
				const options = {
					method: "GET"
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					if (response.status == 404) {
						getActions().createAgenda()
					} else {
						console.error("Error: ", response.status, response.statusText);
					}
					return;
				}
				const data = await response.json();
				setStore({ contacts: data.contacts });
			},
			createContact: async (dataToSend) => {
				const uri = `${getStore().host}/${getStore().user}/contacts`;
				const options = {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(dataToSend)
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.error("Error: ", response.status, response.statusText);
					return;
				}
				getActions().getContact()
			},
			updateContact: async (id, contact) => {
				const uri = `${getStore().host}/${getStore().user}/contacts/${id}`
				const options = {
					method: "PUT",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(contact)
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.error("Error: ", response.status, response.statusText);
					return;
				}
				getActions().getContact();
			},
			deleteContact: async (id) => {
				const uri = `${getStore().host}/${getStore().user}/contacts/${id}`
				const options = {
					method: "DELETE"
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.error("Error: ", response.status, response.statusText);
					return;
				}
				getActions().getContact();
			},
			getCharacters: async () => {
				const uri = `${getStore().hostStarWars}/people`;
				const response = await fetch(uri);
				if (!response.ok) {
					console.log('Error: ', response.status, response.statusText);
					return
				}
				const data = await response.json();
				console.log('Personajes obtenidos:', data.results);
				setStore({ characters: data.results });
				localStorage.setItem('characters', JSON.stringify(data.results));
			},
			getDetailCharacters: async (uid) => {
				const uri = `${getStore().hostStarWars}/people/${uid}`;
				const response = await fetch(uri);
				if (!response.ok) {
					console.log('Error: ', response.status, response.statusText);
					return
				}
				const data = await response.json();
				setStore({ detailCharacters: data.result.properties });
			},
			getPlanets: async () => {
				const uri = `${getStore().hostStarWars}/planets`;
				const response = await fetch(uri);
				if (!response.ok) {
					console.log('Error: ', response.status, response.statusText);
					return
				}
				const data = await response.json();
				console.log('Planetas obtenidos:', data.results);
				setStore({ planets: data.results });
				localStorage.setItem('planets', JSON.stringify(data.results));
			},
			getDetailPlanets: async (uid) => {
				const uri = `${getStore().hostStarWars}/planets/${uid}`;
				const response = await fetch(uri);
				if (!response.ok) {
					console.log('Error: ', response.status, response.statusText);
					return
				}
				const data = await response.json();
				setStore({ detailPlanets: data.result.properties });
			},
			getStarships: async () => {
				const uri = `${getStore().hostStarWars}/starships`;
				const response = await fetch(uri);
				if (!response.ok) {
					console.log('Error: ', response.status, response.statusText);
					return
				}
				const data = await response.json();
				console.log('Starships obtenidos:', data.results);
				setStore({ starships: data.results });
				localStorage.setItem('starships', JSON.stringify(data.results));
			},
			getDetailStarships: async (uid) => {
				const uri = `${getStore().hostStarWars}/starships/${uid}`;
				const response = await fetch(uri);
				if (!response.ok) {
					console.log('Error: ', response.status, response.statusText);
					return
				}

				const data = await response.json();
				setStore({ detailStarships: data.result.properties });
			},
			getMessage: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			},
		}
	};
}

export default getState;