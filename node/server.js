/* Server using Node.js and Express */

const express = require("express")
const app = express()
const configuration = require("./configuration").express

const database = require("./database/database")

/* This is the main function of the entire server.
 * It is async so that we can use await inside of it.
 */
const main = async () => {
	// First, load all data
	const loaded = await database.loadData()
	console.log("Loaded data", loaded)

	// Serve static content from webui folder
	app.use(express.static(__dirname + "/../webui"))

	// Serve dynamic content from "/search?" API endpoint
	app.get("/search?", (req, res) => {
		database.queryCallback((resp) => {
			console.log("Select")
			console.log("Solution: " + resp[0].solution)
			res.setHeader("Content-Type", "application/json")
			res.send(JSON.stringify(resp[0]))
		})
	})

	app.listen(configuration.port, () =>
		console.log(`Server listening on port ${configuration.port}`))

	database.queryCallback((res) => {
		console.log("Solution: " + res[0].solution)
	})

	//console.log(typeof database.query)
	/*
	database.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
			if (error) throw error
		console.log("Solution hormal: " + results[0].solution)
	})

*/
}

// Start server
main()
