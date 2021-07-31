import React, { useState } from 'react';

import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
	apiKey: 'AIzaSyAYfrsG5TocCHayK6C8MTqwGaGEwVb58dU',
	authDomain: 'superchat-72fb9.firebaseapp.com',
	projectId: 'superchat-72fb9',
	storageBucket: 'superchat-72fb9.appspot.com',
	messagingSenderId: '956097397285',
	appId: '1:956097397285:web:66d051a7522752792b35cc',
});

const auth = firebase.auth();
const firestore = firebase.firestore();

console.log(firebase);

function App() {
	const [user] = useAuthState(auth);

	return (
		<div className='App'>
			{/* <header className='App-header'>SuperChat</header> */}
			{user ? <Chat /> : <SignIn />}
			<SignOut />
		</div>
	);
}

const SignIn = () => {
	const signInWithGoogle = () => {
		const provider = new firebase.auth.GoogleAuthProvider();
		auth.signInWithPopup(provider);
	};

	return <button onClick={signInWithGoogle}>Sign in with Google</button>;
};

const SignOut = () => {
	return (
		auth.currentUser && (
			<button onClick={() => auth.signOut()}>Sign Out</button>
		)
	);
};

const Chat = () => {
	const messagesRef = firestore.collection('messages');
	const query = messagesRef.orderBy('createdAt').limit(25);

	const [messages] = useCollectionData(query, { idField: 'id' });

	const [message, setMessage] = useState('');

	const handleMessageChange = (e) => {
		setMessage(e.target.value);
	};

	const handleSendMessage = () => {
		messagesRef.add({
			text: message,
			createdAt: new Date(),
		});
		setMessage('');
	};

	return (
		<>
			<h1>This is the Chat Room</h1>
			<div>
				{messages &&
					messages.map((msg) => (
						<ChatMessage message={msg} key={msg.id} />
					))}

				<input
					type='text'
					onChange={handleMessageChange}
					value={message}
				></input>
				<input type='submit' onClick={handleSendMessage} />
			</div>
		</>
	);
};

const ChatMessage = (props) => {
	const { text } = props.message;
	console.log(text);

	return <p>{text}</p>;
};

export default App;
