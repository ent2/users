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

async function getFollowing(user: string) {
    return await q(
        "SELECT_FOLLOWINGS", 
        "./selectFollowings.graphql", 
        {
            pageParam: {
                display: 1,
                order: 1,
                sort: "created",
                start: 0,
            },
            user,
        }
    )
}

const resultz = await getFollowing("573fa113b006225f746e3d4b")

console.log(
    resultz.data.followings.list.length,
    resultz.data.followings.list.map((x: any) => x.follow)[0],
    resultz.extensions
)