import { User } from "./user-interface"
import { v4 as uuidv4 } from 'uuid'
import sqlite3 from "sqlite3"
import e from "express"

type newUserSet = Pick<User, "first_name" | "last_name" | "wishlist">

export class UserService {

    constructor(
        private readonly db: sqlite3.Database
    ) { }

    private _userId: string = ""
    private _isGameStarted: Boolean = false



    createUser(user: newUserSet): User | null {
        const newUSer = {
            id: uuidv4(),
            first_name: user.first_name,
            last_name: user.last_name,
            wishlist: user.wishlist
        }

        this.getCountOfUsers()

        if (this.WishlistValidator(newUSer.wishlist)) {
            this.db.run('INSERT INTO users(id, first_name, last_name, wishlist) VALUES(?, ?, ?, ?)',
                [uuidv4(), user.first_name, user.last_name, user.wishlist],
                (err) => {
                    if (err) {
                        return console.log(err.message)
                    }
                    console.log(`Added info`)
                })
        }
        if (!this.WishlistValidator(newUSer.wishlist)) {
            return null
        }
        return newUSer
    }

    async getUserWishlist(userId: string): Promise<Object> {
        if (!this._isGameStarted) {
            return "The game hasn't started yet"
        }

        var user: Object = {}

        if (this._isGameStarted) {
            const sql = `SELECT users.first_name, users.last_name, users.wishlist
            FROM partners 
            LEFT JOIN users ON partners.reciever_id = users.id
            WHERE partners.giver_id=?`

            await new Promise((res, rej) => {
                this.db.get(sql, [userId],
                    (err, row) => {
                        if (err) {
                            return Error("This user is not registered")
                        }
                        res(row)
                        return user = row
                    })
            }).then(e => {
                return e
            })
        }
        return user
    }

    async getCountOfUsers(): Promise<number> {
        const sql = 'SELECT COUNT (*) AS cnt FROM users'
        var count = 0

        var promise = new Promise((res, rej) => {
            this.db.get(sql, [], (err, row) => {
                if (err) {
                    return console.error(err.message);
                }
                res(sql)
                return count = row["cnt"]
            })
        })
        await promise
        return count
    }

    async getCountOfPartners(): Promise<number> {
        const sql = 'SELECT COUNT (*) AS cnt FROM partners'

        var count = 0

        var promise = new Promise((res, rej) => {
            this.db.get(sql, [], (err, row) => {
                if (err) {
                    return console.error(err.message);
                }
                res(sql)
                return count = row["cnt"]
            })
        })
        await promise
        return count
    }

    WishlistValidator(wishlist: string[]): Boolean {
        if (wishlist.length < 3 || wishlist.length > 10) {
            return false
        } else {
            return true
        }
    }

    changeGameCondition(condition: Boolean) {
        this._isGameStarted = condition
    }
}