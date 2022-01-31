import { User } from "./user-interface"
import { v4 as uuidv4 } from 'uuid'
import sqlite3 from "sqlite3"

type UserChangeSet = Pick<User, "first_name" | "last_name" | "wishlist">

export class UserService {

    constructor(
        private readonly db: sqlite3.Database
    ) { }

    private _isGameStarted: Boolean = false

    createUser(user: UserChangeSet): User | undefined {
        if (this._isGameStarted === true) {
            throw new Error("You cannot add new players after the game has started")
        } else {
            const newUSer = {
                id: uuidv4(),
                first_name: user.first_name,
                last_name: user.last_name,
                wishlist: user.wishlist
            }
            const sql = `INSERT INTO users(id, first_name, last_name, wishlist) 
            VALUES(?, ?, ?, ?)`

            if (this.WishlistValidator(newUSer.wishlist)) {
                this.db.run(sql, [uuidv4(), user.first_name, user.last_name, user.wishlist],
                    (err) => {
                        if (err) {
                            return console.log(err.message)
                        }
                        console.log(`Added info`)
                        return newUSer
                    })
            } else {
                throw new Error("You have to write 3 to 10 wishes")
            }
        }
        return
    }

    async getUserWishlist(userId: string): Promise<User | undefined> {
        if (this._isGameStarted === false) {
            throw new Error("The game hasn't started yet")
        } else {
            const sql = `SELECT users.first_name, users.last_name, users.wishlist
            FROM partners 
            LEFT JOIN users ON partners.reciever_id = users.id
            WHERE partners.giver_id=?`

            const promise = new Promise<User>((res, rej) => {
                this.db.get(sql, [userId], (err, row: User) => {
                    if (err) rej(new Error(err.message))
                    res(row)
                })
            })
            return promise
        }
    }

    async getCountOfUsers(): Promise<number> {
        const sql = 'SELECT COUNT (*) AS cnt FROM users'

        const promise = new Promise<number>((res, rej) => {
            this.db.get(sql, [], (err, row) => {
                if (err) rej(new Error(err.message))
                res(row["cnt"])
            })
        })
        return promise
    }

    async getCountOfPartners(): Promise<number> {
        const sql = 'SELECT COUNT (*) AS cnt FROM partners'

        var promise = new Promise<number>((res, rej) => {
            this.db.get(sql, [], (err, row) => {
                if (err) rej(new Error(err.message))
                res(row["cnt"])
            })
        })
        return promise
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