import e from "express"
import express from "express"
import sqlite3 from "sqlite3"
import { stringify } from "uuid"
import { UserService } from "../src/user/user-service"
import { Shuffle } from "../shuffle"


async function main() {
    const app = express()

    const db = new sqlite3.Database("./database.db",
        sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
            if (err) return console.error(err)

            console.log("connection is ok")
        })


    const userService = new UserService(db)
    const shuffle = new Shuffle(db, userService)

    app.use(express.json())

    app.post("/user", (req, res) => {
        const user = req.body
        if (validation(user)) {
            if (userService.createUser(req.body)) {
                return res.end("User created")
            }

            if (!userService.createUser(req.body)) {
                res.end("You have to write 3 to 10 wishes")
            }

        } else {
            res.statusCode = 400
            return res.end("Wrong user type")
        }
    })
    // db.run('CREATE TABLE users (id text, first_name text, last_name text, wishlist text)')

    app.post("/shuffle", async (_req, res) => {
        const final = await shuffle.start()

        res.contentType("json")
        res.end(JSON.stringify(final))
    })

    app.get("/users/:id", async (req, res) => {
        const user = await userService.getUserWishlist(req.params.id)
        if (!user) {
            res.end("Wrong user id")
        }

        res.contentType("json")
        res.end(JSON.stringify(user))
    })

    app.listen(3000, () => console.log("runnin"))
}

function validation(user: any) {
    if (user["first_name"] != null && typeof (user.first_name) === "string") {
        if (user["last_name"] != null && typeof (user.last_name) === "string") {
            if (user["wishlist"] != null && typeof (user.wishlist) === "object") {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    } else {
        return false
    }
}

main()

