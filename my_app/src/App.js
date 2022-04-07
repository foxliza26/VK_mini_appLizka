import React, { useState, useEffect, useRef } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, ScreenSpinner, AdaptivityProvider, AppRoot } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';
import Persik from './panels/Persik';

import io from 'socket.io-client'

const App = () => {
	const [activePanel, setActivePanel] = useState('home');
	const [fetchedUser, setUser] = useState(null);
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);
	
	const [messages, setMessages ] = useState ([])

	const SERVER_URL = 'https://5.188.141.101:5000'

	const socket=useRef(null)

	

	

	useEffect(async() => {
		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});

		let user = null

		async function fetchData() {
			user = await bridge.send('VKWebAppGetUserInfo');
			setUser(user);
			setPopout(null);

			socket.current = io(SERVER_URL)
	
			socket.current.emit ('message:get')

		}
		await fetchData();

		//console.log('useEffect')
	
	 socket.current.on ('messages',(messages) => {
		 //console.log ('on message')
		const newMessages = messages.map((msg)=>
		msg.userId === user.id ? {
			...msg, currentUser:true
		}:msg)

		setMessages(newMessages)
	})

		return () => {
			socket.current.disconnect()
		}

	}, []);

	const go = e => {
		setActivePanel(e.currentTarget.dataset.to);
	};

	const sendMessage=({
		messageText,senderName
	}) => {
		socket.current.emit ('message:add',{
			userId: fetchedUser.id,
			messageText,
			senderName,
			avatar:fetchedUser.photo_200
		})
	}

	return (
		<AdaptivityProvider>
			<AppRoot>
				<View activePanel={activePanel} popout={popout}>
					<Home 
					  id='home' 
					  fetchedUser={fetchedUser} 
					  go={go} 
					  messages={messages} 
					  sendMessage={sendMessage} />
					<Persik 
					  id='persik' 
					  go={go} />
				</View>
			</AppRoot>
		</AdaptivityProvider>
	);
}


export default App;
