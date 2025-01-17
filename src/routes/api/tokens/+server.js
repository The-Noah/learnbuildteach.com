import * as dotenv from 'dotenv';
dotenv.config();

export async function POST(event) {
	let response = {};
	if (event.httpMethod === 'OPTIONS') {
		response = {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Headers': '*'
			}
		};
		throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)");
		return response;
	}
	const body = event.body;
	let data = {
		client_id: process.env.VITE_DISCORD_CLIENT_ID,
		client_secret: process.env.DISCORD_CLIENT_SECRET,
		grant_type: 'authorization_code',
		code: body.code,
		redirect_uri: `${event.url.origin}/oauth`,
		scope: 'identify'
	};

	let formBody = [];
	for (let property in data) {
		let encodedKey = encodeURIComponent(property);
		let encodedValue = encodeURIComponent(data[property]);
		formBody.push(encodedKey + '=' + encodedValue);
	}
	formBody = formBody.join('&');

	// request code
	let opts = {
		method: 'post',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: formBody
	};

	try {
		let res = await fetch('https://discord.com/api/oauth2/token', opts);
		let json = await res.json();
		response = {
			statusCode: 200,
			body: JSON.stringify(json)
		};
	} catch (err) {
		console.log(err);
		response = {
			statusCode: 400
		};
	}

	// Handle CORS
	if (!response.headers) {
		response.headers = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers': '*'
		};
	} else {
		response.headers['Access-Control-Allow-Origin'] = '*';
		response.headers['Access-Control-Allow-Headers'] = '*';
	}

	throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)");
	return response;
}
