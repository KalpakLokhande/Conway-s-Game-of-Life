import * as gliderModel from './Assets/Glider.json' assert{type: "json"}
import * as pulsarModel from './Assets/Pulsar.json' assert{type: "json"}
import * as gliderGunModel from './Assets/GliderGun.json' assert{type: "json"}
import * as quasarModel from './Assets/Qasar.json' assert{type: "json"}


const canvas = document.getElementById("canvas")

canvas.width = window.innerWidth - 10;
canvas.height = window.innerHeight - 10;

const ctx = canvas.getContext("2d")
let cellSize = 20
let intervalID;
let Grid = createGrid()

const strt = document.getElementById("start")
const stp = document.getElementById("stop")
const reset = document.getElementById("reset")
const model = document.getElementById('modelList')

let pulsar = { name: 'Pulsar', model: pulsarModel.default, cellSize: 20 }
let glider = { name: 'Glider', model: gliderModel.default, cellSize: 20 }
let quasar = { name: 'Quasar', model: quasarModel.default, cellSize: 15 }
let gliderGun = { name: 'Glider Gun', model: gliderGunModel.default, cellSize: 20 }
let none = { name: 'None', model: createGrid(), cellSize: 20 }
const models = [pulsar, quasar, glider, gliderGun, none]

model.onchange = (e) => {

    let currentModel = models.find(model => model.name === e.target.value)
    Grid = currentModel.model
    cellSize = currentModel.cellSize
    drawGrid(Grid)

}

function createGrid() {

    let arr = []

    for (let i = 0; i < canvas.width / cellSize; i++) {

        arr[i] = []

        for (let j = 0; j < canvas.height / cellSize; j++) {

            arr[i][j] = { x: i * cellSize, y: j * cellSize, state: false }

        }

    }
    return arr
}

const drawGrid = (grid, fillOpacity, strokOpacity = 0.2) => {

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < grid.length; i++) {

        for (let j = 0; j < grid[i].length; j++) {

            ctx.save()
            ctx.fillStyle = 'rgb(54,159,255)'
            ctx.strokeStyle = 'darkGray'
            ctx.globalAlpha = strokOpacity
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.strokeRect(Grid[i][j].x, Grid[i][j].y, cellSize, cellSize)
            ctx.restore()

            ctx.save()
            ctx.beginPath()
            ctx.fillStyle = 'yellowGreen'
            ctx.globalAlpha = fillOpacity
            if (Grid[i][j].state) {
                ctx.fillRect(Grid[i][j].x, Grid[i][j].y, cellSize, cellSize)
                ctx.strokeRect(Grid[i][j].x, Grid[i][j].y, cellSize, cellSize)
            }
            ctx.restore()

        }

    }

}

const getNeighbours = (k, l) => {

    let neighbours = []

    for (let i = -1; i < 2; i++) {

        for (let j = -1; j < 2; j++) {

            if (Grid[k + i] && Grid[k + i][l + j]) {

                if (i === 0 && j === 0) continue
                neighbours.push(Grid[k + i][l + j])

            }

        }

    }

    return neighbours

}

canvas.onmousedown = (e) => {

    for (let i = 0; i < Grid.length; i++) {

        for (let j = 0; j < Grid[i].length; j++) {

            if (e.offsetX >= Grid[i][j].x && e.offsetX <= Grid[i][j].x + cellSize && e.offsetY >= Grid[i][j].y && e.offsetY <= Grid[i][j].y + cellSize) {

                Grid[i][j].state = !Grid[i][j].state

            }

        }

    }

    drawGrid(Grid)
}

const animate = () => {

    intervalID = setInterval(() => {

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        let next = createGrid()

        drawGrid(Grid, 1, 0.2)

        for (let i = 0; i < Grid.length; i++) {

            for (let j = 0; j < Grid[i].length; j++) {

                let check = 0
                let n = getNeighbours(i, j)

                for (let k = 0; k < n.length; k++) {

                    if (n[k].state) {
                        check++
                    }

                }

                if (!Grid[i][j].state && check === 3) next[i][j].state = true
                else if (Grid[i][j].state && (check === 2 || check === 3)) next[i][j].state = true
                else next[i][j].state = false

            }

        }

        Grid = next

    }, 180)
}

drawGrid(Grid)

strt.onclick = () => animate()
stp.onclick = () => clearInterval(intervalID)
reset.onclick = () => {
    clearInterval(intervalID)
    Grid = createGrid()
    drawGrid(Grid)
}