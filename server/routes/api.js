const {
	Router
} = require("express")
const {
	Clipboard
} = require('../../db/index')

const router = Router();



router
	.route('/clipboards')
	.post(async (req, res) => {
		const {
			name,
			content,
			language
		} = req.body;

		console.log(req.body)

		try {
			await Clipboard.create({
				name,
				content,
				language
			})

			res.send(200);
		} catch (error) {
			console.log(error);
			res.send(500);
		}
	})

router.post('/clipboards/delete', async (req, res) => {
	const {
		name
	} = req.body;

	if (!name) {
		console.log(req.body)
		return res.send(500);
	}

	const item = Clipboard.findOne({
		name
	});

	await item.remove();

	res.send({
		removed: true
	})
})

module.exports = router;