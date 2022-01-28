import sqlite3 from "sqlite3"
import { User } from "../src/user/user-interface"
import { UserService } from "../src/user/user-service"

export class Shuffle {

    constructor(
        private readonly db: sqlite3.Database,
        private readonly userService: UserService
    ) { }



    private _members: String[] = []
    private _isActiveShuffle: Boolean = true

    async start() {
        // this.db.run('CREATE TABLE partners (giver_id text, reciever_id text)')
        this.userService.changeGameCondition(true)
        const sql = ('SELECT id FROM users')

        var result = new Promise((res, rej) => {
            this.db.all(sql, [], async (err, rows: User[]) => {
                if (err) rej(err.message)

                this._members = rows.map(c => c["id"])
                res(this._members)
            })
        })
        await result

        if (await this.userService.getCountOfUsers() < 3 || await this.userService.getCountOfUsers() > 500) {
            throw new Error("The game can be played from 3 to 500 players")
        } else {
            await this.makeShuffle(this._members)

            var users = await this.userService.getCountOfUsers()
            var partners = await this.userService.getCountOfPartners()


            //To avoid a situation where the player did not get a pair 
            while (users !== partners) {
                await this.deletePartnersTable()
                // this.makeShuffle(this._members)
                this.start()
            }
            this._isActiveShuffle = false
        }
    }

    async deletePartnersTable() {
        const promise = new Promise((res, rej) => {
            var sql = this.db.run("DELETE FROM partners", [], (err) => {
                if (err) rej(err.message)

                res(sql)
            })
        })
        await promise
    }

    async makeShuffle(members: String[]) {
        if (this._isActiveShuffle === false) {
            throw new Error("You can`t shuffle players second time")
        } else {
            block: {
                var recievers = members.slice()

                for (var i = 0; i < members.length; i++) {
                    var curMember = members[i]
                    var recieverIndex = Math.floor(Math.random() * recievers.length)
                    while (recievers[recieverIndex] === curMember) {
                        if (await this.userService.getCountOfPartners() === members.length - 1) {
                            break block
                        } else {
                            recieverIndex = Math.floor(Math.random() * recievers.length)
                        }
                    }
                    var reciever = recievers.splice(recieverIndex, 1)[0]

                    var promise = new Promise((res, rej) => {
                        var sql = this.db.run('INSERT INTO partners(giver_id, reciever_id) VALUES(?, ?)',
                            [curMember, reciever], (err) => {
                                if (err) rej(err.message)

                                res(sql)
                            })
                    })
                    await promise
                }
            }
        }
    }
}
