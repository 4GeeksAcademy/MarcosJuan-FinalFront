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
			user: "MarcosJuan",
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
		},
		actions: {
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},
			setCurrentContact: (item) => {setStore({currentContact: item})},
			addFavorites: (item) =>{
				const favorites = getStore().favorites;
				if(!favorites.includes(item)){
				setStore({favorites: [...getStore().favorites,item]});
				}
			},
			removeFavorites: (item) =>{
				const favorites = getStore().favorites;
				setStore({favorites:favorites.filter((favorite) => favorite != item)})
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
				setStore({contacts: data.contacts});
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
				setStore({contacts: data.contacts});
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
				if(!response.ok){
					console.log('Error: ', response.status, response.statusText);
					return
				}
				const data = await response.json();
				console.log('Personajes obtenidos:', data.results); 
				setStore({ characters: data.results });
				localStorage.setItem( 'characters', JSON.stringify(data.results) );
			},
			getDetailCharacters: async (uid) => {
				const uri = `${getStore().hostStarWars}/people/${uid}`;
				const response = await fetch(uri);
				if(!response.ok){
					console.log('Error: ', response.status, response.statusText);
					return
				}
				const data = await response.json();
				setStore({ detailCharacters: data.result.properties });
			},
			getPlanets: async () => {
				const uri = `${getStore().hostStarWars}/planets`;	
				const response = await fetch(uri);
				if(!response.ok){
					console.log('Error: ', response.status, response.statusText);
					return
				}
				const data = await response.json();
				console.log('Planetas obtenidos:', data.results); 
				setStore({ planets: data.results });
				localStorage.setItem( 'planets', JSON.stringify(data.results) );
			},	
			getDetailPlanets: async (uid) => {
				const uri = `${getStore().hostStarWars}/planets/${uid}`;
				const response = await fetch(uri);
				if(!response.ok){
					console.log('Error: ', response.status, response.statusText);
					return
				}
				const data = await response.json();
				setStore({ detailPlanets: data.result.properties });
			},
			getStarships: async () => {
				const uri = `${getStore().hostStarWars}/starships`;	
				const response = await fetch(uri);
				if(!response.ok){
					console.log('Error: ', response.status, response.statusText);
					return
				}
				const data = await response.json();
				console.log('Starships obtenidos:', data.results); 
				setStore({ starships: data.results });
				localStorage.setItem( 'starships', JSON.stringify(data.results) );
			},
			getDetailStarships: async (uid) => {
				const uri = `${getStore().hostStarWars}/starships/${uid}`;
				const response = await fetch(uri);
				if(!response.ok){
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