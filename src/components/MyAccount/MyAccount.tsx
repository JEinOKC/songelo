// import React, { useEffect, useState } from 'react';
import { useAuthState } from "../../stores/AuthStateContext";
import { useAppState } from "../../stores/AppStateContext";
import TopMenu from "../TopMenu/TopMenu";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const MyAccount: React.FC = () => {
	// const [markdown, setMarkdown] = useState('');
	const { isLoggedIn } = useAuthState();
	const { downloadMyData, forgetUser } = useAppState();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isLoggedIn) {
			navigate('/');
		}
	}
	, [isLoggedIn]);

	return (
		<>
			<TopMenu />
			<div className="prose max-w-none p-4">
				<h1 className="text-3xl font-bold">My Account</h1>

				{ isLoggedIn && (
					<ul>
						<li className="cursor-pointer underline hover:text-blue-800" onClick={()=>{
							if(confirm('Are you sure you want to delete your account? This action cannot be undone.')){
								forgetUser();
							}
						}} >Forget Me</li>
						<li className="cursor-pointer underline hover:text-blue-800" onClick={()=>{
							downloadMyData();
						}} >Download My Data</li>
					</ul>
				)}

				
			</div>
		</>
	);
};

export default MyAccount;
