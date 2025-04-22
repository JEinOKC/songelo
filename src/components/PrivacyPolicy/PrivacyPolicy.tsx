// PrivacyPolicyViewer.tsx
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import privacyPolicyMarkdown from './PrivacyPolicy.md?raw';
import './PrivacyPolicy.css';

const PrivacyPolicyViewer: React.FC = () => {
	const [markdown, setMarkdown] = useState('');

	const loadMarkdown = async () => {
		// Fetch the raw markdown file
		setMarkdown(privacyPolicyMarkdown);
	}

	useEffect(() => {
		loadMarkdown();
	}, []);

	return (
		<div className="prose max-w-none p-4">
			<ReactMarkdown remarkPlugins={[remarkGfm]}>
				{markdown}
			</ReactMarkdown>
		</div>
	);
};

export default PrivacyPolicyViewer;
