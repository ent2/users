async function q(
    op: string,
    queryPath: `${string}.graphql`,
    variables: Record<string, any>,
) {
    return await fetch(
        "https://playentry.org/graphql",
        {
            method: "POST",
            body: JSON.stringify({
                operationName: op,
                query: await Deno.readTextFile(queryPath),
                variables
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }
    ).then(res => res.json())
}

interface UserI {
    id: string
    username?: string

    followings?: User[]
    followers?: User[]

    following?: number
    follower?: number
}

function infoSimplize(info: UserI & {status: {following: number, follower: number}}): UserI {
    let newInfo = {...info, ...info.status}
    return newInfo
}

class User implements UserI {
    id
    username
    followings
    followers
    following
    follower

    constructor(info: UserI) {
        this.id = info.id
        this.username = info.username
        this.followings = info.followings
        this.followers = info.followers
        this.following = info.following
        this.follower = info.follower
    }

    async getFollowings(n: number = 1): Promise<User[]> {
        const result = await q(
            "SELECT_FOLLOWINGS", 
            "./query/selectFollowings.graphql", 
            {
                pageParam: {
                    display: n,
                    order: 1,
                    sort: "created",
                    start: 0,
                },
                user: this.id,
            }
        )
        return this.followings = result.data.followings.list.map((x: any) => x.follow?.id ? new User(infoSimplize(x.follow)) : ghost)
    }
    async getFollowers(n: number = 1): Promise<User[]> {
        const result = await q(
            "SELECT_FOLLOWERS", 
            "./query/selectFollowers.graphql", 
            {
                pageParam: {
                    display: n,
                    order: 1,
                    sort: "created",
                    start: 0,
                },
                user: this.id,
            }
        )
        return this.followers = result.data.followers.list.map((x: any) => x.user?.id ? new User(infoSimplize(x.user)) : ghost)
    }
}
const ghost = new User({id: "0"})

const user = new User({id: ""})

await user.getFollowers(20)
//await Promise.all(user.followers!.map(async x => await x.getFollowings(99999)))

console.log(
    JSON.stringify(user.followers?.filter(x => x.following! > 1000).map(({id, username}) => ({id, username})))
)