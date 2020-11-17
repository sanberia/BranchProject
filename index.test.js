const functions = require('./index')

test("formatDate", () => {
    expect(functions.formatDate("2012-01-21T01:43:27Z")).toBe("2012-01-21 01:43:27");
});

test("getMemberInfo with missing member", () => {
    expect.assertions(1);

    let json = {}
    return functions.getMemberInfo('alskdfjalsdkjf').then(
        data => expect(data).toBe(undefined)
    )
});

test("getMemberInfo with existing member", () => {
    expect.assertions(1);

    let json = {}
    return functions.getMemberInfo('octocat').then(
        data => expect(data).not.toBe(undefined)
    )
});

test("formatMemberRepos with empty repo", () => {
    expect(functions.formatMemberRepos([])).toStrictEqual([])
})