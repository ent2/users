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

const result = await q(
    "SELECT_PROJECTS", 
    "./selectProjects.graphql", 
    {
        cacheKey: "project-popular",
        pageParam: {
            display: 8,
            order: 1,
            sort: "created",
            start: 0,
        },
        queryTitleOnly: false,
        ranked: true,
        searchAfter: [],
        searchType: "page",
    }
)

console.log(
    result.data.projectList.list[0]
)