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
		},
		actions: {
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},
			setCurrentContact: (item) => {setStore({currentContact: item})},
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