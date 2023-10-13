const express = require("express")
const app = express()

app.use(express.json())

const render = require("./modules/render")

const crawlers = ["Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)", "Mozilla/5.0 (Macintosh; Intel Mac OS X 11.6; rv:92.0) Gecko/20100101 Firefox/92.0", "TelegramBot (like TwitterBot)"]

app.all("*", async (request, response) => {
	if (crawlers.includes(request.headers["user-agent"]) && !request.query.hasOwnProperty("crawler")) return response.sendFile(__dirname + "/assets/crawler.gif")

	let funny = await render.meme(request.headers["x-forwarded-for"] || request.ip)

	response.contentType("image/gif")
	response.send(funny)
})

render.init().then(() => app.listen(process.env.PORT || 80))
