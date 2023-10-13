const fs = require("fs")
const size = require("image-size")
const { GIFEncoder, quantize, applyPalette } = require("gifenc")
const Canvas = require("canvas")
Canvas.registerFont("./assets/FuturaBT-ExtraBlackCondensed.otf", { family: "Futura" })
const cache = new Map()

const offset = 45
const delay = 35

let w
let h

exports.init = () => {
	return new Promise(async (resolve, reject) => {
		let { width, height } = size("./frames/0.png")
		w = width
		h = height

		let frames = fs.readdirSync("./frames")
		for (let i = 0; i < frames.length; i++) {
			let frame = frames[i]
			let image = await Canvas.loadImage(`./frames/${frame}`)

			let c = Canvas.createCanvas(w, h)
			let ctx = c.getContext("2d")
			ctx.drawImage(image, 0, 0)
			cache.set(frame, c)
		}
		resolve()
	})
}

exports.meme = async (ip) => {
	const gif = GIFEncoder()

	let f = Canvas.createCanvas(w, h + offset)
	let frame = f.getContext("2d")

	for (let i = 0; i < cache.size; i++) {
		let img = cache.get(`${i}.png`)
		frame.drawImage(img, 0, offset)

		frame.fillStyle = "#ffffff"
		frame.fillRect(0, 0, f.width, offset)

		frame.fillStyle = "#000000"
		frame.font = "25px Futura Extra Black Condensed"
		frame.textAlign = "center"
		frame.fillText(ip, f.width / 2, offset / 2 + 8)

		let { data, width, height } = frame.getImageData(0, 0, f.width, f.height)
		let palette = quantize(data, 256)
		let index = applyPalette(data, palette)

		gif.writeFrame(index, width, height, { palette, delay })
	}

	gif.finish()
	return Buffer.from(gif.bytes())
}
