import fetch from 'isomorphic-fetch'

class Api {
	defaultOptions = {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		}
	};

	async create(item = {
		name,
		content,
		language,
		deadline
	}) {
		await fetch("/api/clipboards", {
			...this.defaultOptions,
			body: JSON.stringify(item)
		});
	}

	async delete(name) {
		await fetch("/api/clipboards/delete", {
			...this.defaultOptions,
			body: JSON.stringify({
				name
			})
		});
	}
}

export default new Api();