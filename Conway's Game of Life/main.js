const canvas = document.getElementById("canvas")

canvas.width = 500;
canvas.height = 500;

const ctx = canvas.getContext("2d")
let cellSize = 25
let a;

const strt = document.getElementById("start")
const stp = document.getElementById("stop")


const createGrid = () => {

    let arr = []

    for (let i = 0; i < canvas.width / cellSize; i++) {

        arr[i] = []

        for (let j = 0; j < canvas.height / cellSize; j++) {

            arr[i][j] = { x: i * cellSize, y: j * cellSize, state: false }

        }

    }
    return arr
}

const drawGrid = (grid) => {

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < grid.length; i++) {

        for (let j = 0; j < grid[i].length; j++) {

            ctx.save()
            ctx.fillStyle = 'rgb(54,159,255)'
            ctx.fillStyle = 'yellowGreen'
            ctx.strokeStyle = 'darkGray'
            ctx.globalAlpha = 0.4
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.strokeRect(Grid[i][j].x, Grid[i][j].y, cellSize, cellSize)

            ctx.beginPath()
            ctx.globalAlpha = 1
            if (Grid[i][j].state) ctx.fillRect(Grid[i][j].x, Grid[i][j].y, cellSize, cellSize)
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

    a = setInterval(() => {

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        drawGrid(Grid)

        console.log('s')
        for (let i = 0; i < Grid.length; i++) {

            for (let j = 0; j < Grid[i].length; j++) {

                let check = []
                let n = getNeighbours(i, j)

                for (let k = 0; k < n.length; k++) {

                    if (n[k].state) check.push(n[k])

                }

                if (!Grid[i][j].state && check.length == 3) next[i][j].state = true
                else if (Grid[i][j].state && (check.length == 2 || check.length == 3)) next[i][j].state = true
                else next[i][j].state = false

            }

        }

        Grid = next

    }, 500)
}

let Grid = createGrid()
let next = createGrid()
drawGrid(Grid)

strt.onclick = animate
stp.onclick = () => clearInterval(a)