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
}

class User implements UserI {
    id
    username
    followings
    followers

    constructor(info: UserI) {
        this.id = info.id
        this.username = info.username
        this.followings = info.followings
        this.followers = info.followers
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
        return this.followings = result.data.followings.list.map((x: any) => new User(x.follow))
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
        return this.followers = result.data.followers.list.map((x: any) => new User(x.user))
    }
}

const user = new User({id: ""})

await user.getFollowers(20)
//await Promise.all((await user.getFollowers(20)).map(async x => await x.getFollowings()))

console.log(
    user.followers
)