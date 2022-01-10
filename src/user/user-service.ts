import { User } from "./user-interface"
import { v4 as uuidv4 } from 'uuid'

type newUserSet = Pick<User, "name" | "surName" | "gifts">

export class UserService {

    constructor() { }


    createUser(user: newUserSet): User {
        const newUSer = {
            id: uuidv4(),
            name: user.name,
            surName: user.surName,
            gifts: user.gifts
        }

        return newUSer
    }
}