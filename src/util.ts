type Users = {id: string, username: string}[]

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

async function getFollowings(user: string, n: number = 1): Promise<Users> {
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
            user,
        }
    )
    return result.data.followings.list.map((x: any) => x.follow)
}
async function getFollowers(user: string, n: number = 1): Promise<Users> {
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
            user,
        }
    )
    return result.data.followers.list.map((x: any) => x.user)
}

const result = await getFollowers("", 50)

console.log(
    result
)