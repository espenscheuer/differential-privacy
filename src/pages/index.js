import React, { useEffect, useState } from 'react';

function IndexPage() {
	const [text, setText] = useState('');
	const [original, setOriginal] = useState('');
	const [found, setFound] = useState('');
	const [textContent, setTextContent] = useState('');
	const [version, setVersion] = useState(0);
	const [styles, setStyles] = useState({});

	const onegram = require('../data/1_gram_json.json');
	const twogram = require('../data/2_gram_json.json');

	const updateText = e => setText(e.target.value);

	const apiRequest = async () => {
		const response = await fetch('/api/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				original,
				text,
			}),
		});
		response
			.text()
			.then(value => {
				setFound(value);
			})
			.catch(error => {
				console.error('Error!', error);
			});
	};

	useEffect(() => {
		let generatedHTML = [];

		const words = text.split(' ');
		if (words.length === 0) {
			setStyles({});
		}

		words.forEach((word, index) => {
			const id = `word-${version}-${index}`;

			const wordStyles = {};
			let includePrevious = false;

			if (0 !== index) {
				const two = (words[index - 1] + '_' + word).toLowerCase();
				if (two in twogram) {
					let newTextDecorationColor = 'red';
					if (twogram[two] > 5000) {
						newTextDecorationColor = 'gray';
					} else if (twogram[two] > 1000) {
						newTextDecorationColor = 'yellow';
					} else if (twogram[two] > 500) {
						newTextDecorationColor = 'orange';
					}
					wordStyles['textDecoration'] = 'underline';
					wordStyles['textDecorationColor'] = newTextDecorationColor;
					includePrevious = true;
				}
			}

			const test = word.toLowerCase();
			if (test in onegram) {
				let newColor = 'red';
				if (onegram[test] >= 10000) {
					newColor = 'gray';
				} else if (onegram[test] >= 5000) {
					newColor = 'yellow';
				} else if (onegram[test] >= 1000) {
					newColor = 'orange';
				}
				wordStyles['color'] = newColor;
			}

			generatedHTML.push(
				<span key={id} style={styles[index]}>
					{word}{' '}
				</span>
			);

			if (includePrevious) {
				setStyles({
					...styles,
					[index]: {
						// ...styles[index],
						...wordStyles,
					},
					[index - 1]: {
						// ...styles[index],
						...wordStyles,
					},
				});
			} else {
				setStyles({
					...styles,
					[index]: {
						// ...styles[index],
						...wordStyles,
					},
				});
			}
		});

		setVersion(version + 1);
		setTextContent(generatedHTML);
	}, [text]);

	// useEffect(() => {
	// 	textUpdates.forEach(update => {
	// 		textContent[update.index].props.style = {
	// 			...textContent[update.index].props.style,
	// 			...update.styles,
	// 		};
	// 	});
	// }, [textUpdates]);

	return (
		<div>
			<div className="input">
				<textarea className="text-input" value={text} onChange={updateText} />
				<button className="button" onClick={() => setOriginal(text)}>
					Set Quote
				</button>
				<button className="button" onClick={apiRequest}>
					Check Quote
				</button>
			</div>
			{original && (
				<>
					<h2>Original Quote</h2>
					<blockquote>{original}</blockquote>
				</>
			)}
			{textContent.length > 0 && (
				<>
					<h2>Highlighted Quote</h2>
					<blockquote>{textContent}</blockquote>
				</>
			)}
			{found && (
				<>
					<h2>Google Result</h2>
					<blockquote>{found}</blockquote>
				</>
			)}
		</div>
	);
}

export default IndexPage;
