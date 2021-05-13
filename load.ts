async function q(
    op: string,
    queryPath: `${string}.graphql`,
    variables: Record<string, string | number>,
) {
    return JSON.parse(
        await fetch(
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
        ).then(res => res.text())
    )
}

console.log(
    await q(
        "SELECT_FOLLOWINGS", 
        "./userList.graphql", 
        {
            user: "573fa113b006225f746e3d4b"
        }
    )
)